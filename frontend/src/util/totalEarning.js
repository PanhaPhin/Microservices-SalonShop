

export const getPriceTotal = (bookings) => {
  return bookings.reduce((acc, booking) => booking.totalPrice + acc, 0);
};

const isCompleted = (b) => b.status === "completed";
const isPending = (b) => b.status === "pending";
const isRefunded = (b) => b.status === "refunded";

export const getCompletedBookings = (bookings) => bookings.filter(isCompleted);

// ---- Top stat cards ----

export const getTotalEarnings = (bookings) => getPriceTotal(getCompletedBookings(bookings));

export const getPendingTotal = (bookings) => getPriceTotal(bookings.filter(isPending));

export const getLastPayment = (bookings) => {
  const completed = getCompletedBookings(bookings)
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  return completed[0]?.totalPrice ?? 0;
};

function isSameMonth(dateStr, monthOffset = 0) {
  const d = new Date(dateStr);
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
  return d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth();
}

export const getMonthTotal = (bookings, monthOffset = 0) =>
  getPriceTotal(getCompletedBookings(bookings).filter((b) => isSameMonth(b.date, monthOffset)));

// next payout: naive rule — next upcoming Friday
export const getNextPayoutDate = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun ... 5 = Fri
  const daysUntilFriday = (5 - day + 7) % 7 || 7;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilFriday);
  return next.toLocaleDateString("en-US", { month: "long", day: "numeric" });
};

// ---- Analyst metrics row ----

export const getAvgTransaction = (bookings) => {
  const completed = getCompletedBookings(bookings);
  if (!completed.length) return 0;
  return getPriceTotal(completed) / completed.length;
};

export const getRefundRate = (bookings) => {
  if (!bookings.length) return 0;
  const refunded = bookings.filter(isRefunded).length;
  return (refunded / bookings.length) * 100;
};

// ---- Revenue by service ----

export const getServiceBreakdown = (bookings) => {
  const completed = getCompletedBookings(bookings);
  const total = getPriceTotal(completed);
  const byService = {};
  completed.forEach((b) => {
    byService[b.service] = (byService[b.service] || 0) + b.totalPrice;
  });
  return Object.entries(byService)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => ({
      name,
      amount,
      pct: total ? Math.round((amount / total) * 100) : 0,
    }));
};

// ---- Earnings trend chart ----

export const getEarningsSeries = (bookings, period) => {
  const completed = getCompletedBookings(bookings);
  const now = new Date();

  if (period === "Week") {
    const labels = [];
    const values = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      labels.push(d.toLocaleDateString("en-US", { weekday: "short" }));
      values.push(
        getPriceTotal(completed.filter((b) => new Date(b.date).toDateString() === d.toDateString()))
      );
    }
    return { labels, values };
  }

  if (period === "Month") {
    const labels = [];
    const values = [];
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    for (let w = 0; w < 4; w++) {
      const weekStart = new Date(startOfMonth);
      weekStart.setDate(startOfMonth.getDate() + w * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      labels.push(`W${w + 1}`);
      values.push(
        getPriceTotal(
          completed.filter((b) => {
            const d = new Date(b.date);
            return d >= weekStart && d <= weekEnd;
          })
        )
      );
    }
    return { labels, values };
  }

  // Year — trailing 4 months
  const labels = [];
  const values = [];
  for (let i = 3; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(d.toLocaleDateString("en-US", { month: "short" }));
    values.push(
      getPriceTotal(
        completed.filter((b) => {
          const bd = new Date(b.date);
          return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth();
        })
      )
    );
  }
  return { labels, values };
};

// ---- Recent transactions list ----

export const getRecentTransactions = (bookings, limit = 4) => {
  return bookings
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit)
    .map((b) => ({
      label: b.service,
      customer: b.customerName,
      date: new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      amount: b.status === "refunded" ? `-$${b.totalPrice}` : `+$${b.totalPrice}`,
      positive: b.status !== "refunded",
    }));
};

// ---- Payout schedule ----
// Groups completed bookings into weekly (Fri-Sat) payout buckets.
// The bucket containing "today" is marked "upcoming"; earlier ones are "paid".
export const getPayoutSchedule = (bookings, weeksBack = 4) => {
  const completed = getCompletedBookings(bookings);
  const now = new Date();
  const day = now.getDay();
  const daysSinceFriday = (day + 2) % 7; // Fri=5 -> 0
  const mostRecentFriday = new Date(now);
  mostRecentFriday.setDate(now.getDate() - daysSinceFriday);

  const payouts = [];
  for (let i = 0; i < weeksBack; i++) {
    const periodEnd = new Date(mostRecentFriday);
    periodEnd.setDate(mostRecentFriday.getDate() - i * 7);
    const periodStart = new Date(periodEnd);
    periodStart.setDate(periodEnd.getDate() - 6);

    const amount = getPriceTotal(
      completed.filter((b) => {
        const d = new Date(b.date);
        return d >= periodStart && d <= periodEnd;
      })
    );

    payouts.push({
      date: periodEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      amount: `$${amount.toFixed(2)}`,
      status: i === 0 ? "upcoming" : "paid",
    });
  }
  return payouts;
};

// ---- Service -> icon key mapping (used by the component to pick a MUI icon) ----

export const getServiceIconKey = (serviceName = "") => {
  const s = serviceName.toLowerCase();
  if (s.includes("refund")) return "refund";
  if (s.includes("color")) return "coloring";
  if (s.includes("facial") || s.includes("spa")) return "facial";
  if (s.includes("hair") || s.includes("cut")) return "haircut";
  return "default";
};