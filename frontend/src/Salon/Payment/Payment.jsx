import React, { useEffect, useMemo, useState } from "react";
import Divider from "@mui/material/Divider";
import {
  Payments as PaymentsIcon,
  TrendingUp,
  TrendingDown,
  HourglassEmpty,
  ContentCut,
  Palette,
  Spa,
  Undo,
  ArrowOutward,
  Download,
  AccountBalanceWallet,
  Percent,
  CalendarMonth,
  FilterList,
} from "@mui/icons-material";
import {
  getTotalEarnings,
  getLastPayment,
  getMonthTotal,
  getPendingTotal,
  getNextPayoutDate,
  getAvgTransaction,
  getRefundRate,
  getServiceBreakdown,
  getEarningsSeries,
  getRecentTransactions,
  getPayoutSchedule,
  getServiceIconKey,
} from "../../util/totalEarning";

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";
const AMBER = "#D97706";
const AMBER_SOFT = "rgba(217,119,6,0.10)";
const RED = "#C4695A";
const RED_SOFT = "rgba(196,105,90,0.10)";
const INK = "#12181F";
const BG = "#F9FAFB";

const payoutStatusStyle = {
  upcoming: { bg: AMBER_SOFT, text: AMBER, label: "Upcoming" },
  paid: { bg: GREEN_SOFT, text: GREEN, label: "Paid" },
};

const serviceIconMap = {
  haircut: ContentCut,
  coloring: Palette,
  facial: Spa,
  refund: Undo,
  default: PaymentsIcon,
};

const StatCard = ({ label, value, icon: Icon, accent, accentSoft, footLabel, footValue }) => (
  <div
    className="rounded-2xl p-5 border"
    style={{
      backgroundColor: "#fff",
      borderColor: "rgba(18,24,31,0.06)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = "0 10px 22px rgba(18,24,31,0.06)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "#8B93A0" }}>
        {label}
      </p>
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: accentSoft }}
      >
        <Icon sx={{ fontSize: 18, color: accent }} />
      </div>
    </div>

    <h2
      className="font-bold text-3xl mb-3"
      style={{ fontFamily: "'IBM Plex Mono', monospace", color: accent === AMBER ? accent : "#12181F" }}
    >
      {value}
    </h2>

    <Divider sx={{ borderColor: "rgba(18,24,31,0.06)" }} />

    <p className="text-sm pt-3" style={{ color: "#6B6B6B" }}>
      {footLabel}: <strong style={{ color: "#12181F" }}>{footValue}</strong>
    </p>
  </div>
);

const PeriodTabs = ({ value, onChange, options }) => (
  <div className="flex items-center rounded-full p-1" style={{ backgroundColor: "rgba(18,24,31,0.05)" }}>
    {options.map((opt) => {
      const active = value === opt;
      return (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className="text-xs px-3 py-1 rounded-full font-medium"
          style={{
            backgroundColor: active ? GREEN : "transparent",
            color: active ? "#FFFFFF" : "#6B6B6B",
            transition: "background-color 0.2s ease, color 0.2s ease",
          }}
        >
          {opt}
        </button>
      );
    })}
  </div>
);


const EarningsChart = ({ labels, values, height = 180 }) => {
  const [mounted, setMounted] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(null);
  useEffect(() => {
    setMounted(false);
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, [values]);

  const width = 560;
  const padX = 20;
  const padTop = 14;
  const padBottom = 26;
  const max = Math.max(1, ...values) * 1.15;
  const innerH = height - padTop - padBottom;
  const slot = (width - padX * 2) / (values.length || 1);
  const barWidth = Math.min(slot * 0.42, 34);

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ overflow: "visible" }}>
        {Array.from({ length: 4 }).map((_, i) => {
          const y = padTop + (innerH / 3) * i;
          return (
            <line key={i} x1={padX} x2={width - padX} y1={y} y2={y} stroke="rgba(18,24,31,0.06)" strokeWidth="1" />
          );
        })}

        {values.map((v, i) => {
          const cx = padX + slot * i + slot / 2;
          const barH = (v / max) * innerH;
          const y = padTop + innerH - barH;
          const hovered = hoverIdx === i;
          return (
            <g key={i}>
              <rect
                x={cx - barWidth / 2}
                y={mounted ? y : padTop + innerH}
                width={barWidth}
                height={mounted ? barH : 0}
                rx="6"
                fill={hovered ? AMBER : GREEN}
                style={{ transition: `y 0.7s cubic-bezier(0.34,1.2,0.64,1) ${i * 40}ms, height 0.7s cubic-bezier(0.34,1.2,0.64,1) ${i * 40}ms, fill 0.15s ease` }}
              />
              <rect
                x={cx - slot / 2}
                y={padTop}
                width={slot}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                style={{ cursor: "pointer" }}
              />
              <text x={cx} y={height - 6} textAnchor="middle" fontSize="11" fill="#8B93A0" fontFamily="'IBM Plex Mono', monospace">
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>

      {hoverIdx !== null && (
        <div
          className="absolute px-2.5 py-1.5 rounded-lg text-xs pointer-events-none"
          style={{
            left: `${((padX + slot * hoverIdx + slot / 2) / width) * 100}%`,
            top: 0,
            transform: "translate(-50%, -110%)",
            backgroundColor: INK,
            color: "#FFFFFF",
            fontFamily: "'IBM Plex Mono', monospace",
            whiteSpace: "nowrap",
            boxShadow: "0 6px 16px rgba(18,24,31,0.25)",
          }}
        >
          {labels[hoverIdx]} &middot; ${values[hoverIdx]}
        </div>
      )}
    </div>
  );
};

const ServiceBreakdownBars = ({ services }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  if (!services.length) {
    return <p className="text-sm" style={{ color: "#8B93A0" }}>No completed bookings yet.</p>;
  }

  const barColors = [GREEN, AMBER, "#5C8AA8", "#8B93A0"];

  return (
    <div className="space-y-3.5">
      {services.map((s, i) => (
        <div key={s.name}>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: "#12181F" }}>{s.name}</span>
            <span style={{ color: "#6B6B6B" }}>
              <strong style={{ color: "#12181F", fontFamily: "'IBM Plex Mono', monospace" }}>${s.amount}</strong>{" "}
              &middot; {s.pct}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(18,24,31,0.08)" }}>
            <div
              className="h-1.5 rounded-full"
              style={{
                width: mounted ? `${s.pct}%` : "0%",
                backgroundColor: barColors[i % barColors.length],
                transition: "width 0.9s cubic-bezier(0.34,1.2,0.64,1)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// bookings: array of { id, service, customerName, date, totalPrice, status }
const Payment = ({ bookings = [] }) => {
  const [period, setPeriod] = useState("Week");

  const trend = useMemo(() => getEarningsSeries(bookings, period), [bookings, period]);
  const periodTotal = useMemo(() => trend.values.reduce((a, b) => a + b, 0), [trend]);

  const totalEarnings = useMemo(() => getTotalEarnings(bookings), [bookings]);
  const lastPayment = useMemo(() => getLastPayment(bookings), [bookings]);
  const thisMonth = useMemo(() => getMonthTotal(bookings, 0), [bookings]);
  const lastMonth = useMemo(() => getMonthTotal(bookings, 1), [bookings]);
  const pending = useMemo(() => getPendingTotal(bookings), [bookings]);
  const nextPayoutDate = useMemo(() => getNextPayoutDate(), []);

  const avgTransaction = useMemo(() => getAvgTransaction(bookings), [bookings]);
  const refundRate = useMemo(() => getRefundRate(bookings), [bookings]);

  const serviceBreakdown = useMemo(() => getServiceBreakdown(bookings), [bookings]);
  const transactions = useMemo(() => getRecentTransactions(bookings, 4), [bookings]);
  const payouts = useMemo(() => getPayoutSchedule(bookings, 4), [bookings]);

  const stats = [
    {
      label: "Total Earning",
      value: `$${totalEarnings.toFixed(2)}`,
      icon: PaymentsIcon,
      accent: GREEN,
      accentSoft: GREEN_SOFT,
      footLabel: "Last Payment",
      footValue: `$${lastPayment.toFixed(2)}`,
    },
    {
      label: "This Month",
      value: `$${thisMonth.toFixed(2)}`,
      icon: TrendingUp,
      accent: GREEN,
      accentSoft: GREEN_SOFT,
      footLabel: "Last Month",
      footValue: `$${lastMonth.toFixed(2)}`,
    },
    {
      label: "Pending",
      value: `$${pending.toFixed(2)}`,
      icon: HourglassEmpty,
      accent: AMBER,
      accentSoft: AMBER_SOFT,
      footLabel: "Next Payout",
      footValue: nextPayoutDate,
    },
  ];

  const monthDelta = lastMonth ? (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1) : "0.0";

  const analystStats = [
    {
      label: "Avg. Transaction",
      value: `$${avgTransaction.toFixed(2)}`,
      delta: `${monthDelta >= 0 ? "+" : ""}${monthDelta}%`,
      icon: AccountBalanceWallet,
      positive: Number(monthDelta) >= 0,
    },
    {
      label: "Refund Rate",
      value: `${refundRate.toFixed(1)}%`,
      delta: refundRate <= 5 ? "Healthy" : "Elevated",
      icon: Undo,
      positive: refundRate <= 5,
    },
    { label: "Processing Fee", value: "—", delta: "Set by provider", icon: Percent, positive: true },
    { label: "Payout Cadence", value: "Weekly", delta: "Every Fri", icon: CalendarMonth, positive: true },
  ];

  return (
    <div
      className="min-h-screen w-full px-6 py-8 md:px-10 lg:px-14"
      style={{ backgroundColor: BG, fontFamily: "'Manrope', 'Inter', sans-serif" }}
    >
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 w-full max-w-5xl">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: "#8B7A3F" }}>
            The Nika Studio
          </p>
          <h1
            className="font-semibold text-2xl md:text-3xl"
            style={{ fontFamily: "'Fraunces', serif", color: "#12181F" }}
          >
            Payments
          </h1>
        </div>
        <button
          className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg border"
          style={{ borderColor: "rgba(18,24,31,0.12)", color: "#12181F", backgroundColor: "#fff", transition: "background-color 0.2s ease" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = GREEN_SOFT)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
        >
          <Download sx={{ fontSize: 15 }} />
          Export statement
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-5xl">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}

        {/* Analyst metrics row */}
        <div
          className="rounded-2xl p-5 sm:col-span-3 border"
          style={{ backgroundColor: "#fff", borderColor: "rgba(18,24,31,0.06)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FilterList sx={{ fontSize: 15, color: GREEN }} />
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#8B93A0" }}>
              Analyst Metrics
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {analystStats.map(({ label, value, delta, icon: Icon, positive }) => (
              <div key={label} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: GREEN_SOFT }}
                >
                  <Icon sx={{ fontSize: 16, color: GREEN }} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold leading-tight" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#12181F" }}>
                    {value}
                  </p>
                  <p className="text-xs truncate" style={{ color: "#8B93A0" }}>{label}</p>
                  <span
                    className="text-[11px] font-medium inline-flex items-center gap-0.5 mt-0.5"
                    style={{ color: positive ? GREEN : RED }}
                  >
                    {positive ? <TrendingUp sx={{ fontSize: 12 }} /> : <TrendingDown sx={{ fontSize: 12 }} />}
                    {delta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings trend + service breakdown */}
        <div
          className="rounded-2xl p-5 sm:col-span-2 border"
          style={{ backgroundColor: "#fff", borderColor: "rgba(18,24,31,0.06)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
            <div>
              <h3 className="text-base font-semibold" style={{ fontFamily: "'Fraunces', serif", color: "#12181F" }}>
                Earnings Trend
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "#8B93A0" }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: "#12181F" }}>
                  ${periodTotal.toFixed(2)}
                </span>{" "}
                total this {period.toLowerCase()}
              </p>
            </div>
            <PeriodTabs value={period} onChange={setPeriod} options={["Week", "Month", "Year"]} />
          </div>
          <div className="mt-3">
            <EarningsChart labels={trend.labels} values={trend.values} />
          </div>
        </div>

        <div
          className="rounded-2xl p-5 border"
          style={{ backgroundColor: "#fff", borderColor: "rgba(18,24,31,0.06)" }}
        >
          <h3 className="text-base font-semibold mb-4" style={{ fontFamily: "'Fraunces', serif", color: "#12181F" }}>
            Revenue by Service
          </h3>
          <ServiceBreakdownBars services={serviceBreakdown} />
        </div>

        {/* Payout schedule */}
        <div
          className="rounded-2xl p-5 sm:col-span-3 border"
          style={{ backgroundColor: "#fff", borderColor: "rgba(18,24,31,0.06)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold" style={{ fontFamily: "'Fraunces', serif", color: "#12181F" }}>
              Payout Schedule
            </h3>
            <span className="text-xs" style={{ color: "#8B93A0" }}>Paid out weekly, every Friday</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {payouts.map((p) => {
              const s = payoutStatusStyle[p.status];
              return (
                <div
                  key={p.date}
                  className="rounded-xl p-4 border"
                  style={{ borderColor: "rgba(18,24,31,0.06)", backgroundColor: BG }}
                >
                  <p className="text-xs mb-2" style={{ color: "#8B93A0" }}>{p.date}</p>
                  <p className="text-lg font-semibold mb-2" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#12181F" }}>
                    {p.amount}
                  </p>
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full inline-block"
                    style={{ backgroundColor: s.bg, color: s.text }}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div
          className="rounded-2xl p-5 sm:col-span-3 border"
          style={{ backgroundColor: "#fff", borderColor: "rgba(18,24,31,0.06)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-base font-semibold"
              style={{ fontFamily: "'Fraunces', serif", color: "#12181F" }}
            >
              Recent Transactions
            </h3>
            <button
              className="text-xs flex items-center gap-1 group"
              style={{ color: "#8B7A55", transition: "opacity 0.2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.65")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              View all
              <ArrowOutward
                sx={{ fontSize: 13, transition: "transform 0.2s ease" }}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </div>

          <div className="flex flex-col">
            {transactions.length === 0 && (
              <p className="text-sm py-3" style={{ color: "#8B93A0" }}>No transactions yet.</p>
            )}
            {transactions.map((tx, i) => {
              const Icon = serviceIconMap[getServiceIconKey(tx.positive ? tx.label : "refund")];
              const color = tx.positive ? GREEN : RED;
              const soft = tx.positive ? GREEN_SOFT : RED_SOFT;
              return (
                <div key={i}>
                  <div
                    className="flex items-center gap-3 py-3 px-2 -mx-2 rounded-lg"
                    style={{ transition: "background-color 0.15s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(18,24,31,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: soft }}
                    >
                      <Icon sx={{ fontSize: 16, color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#12181F" }}>
                        {tx.label} <span style={{ color: "#8B93A0", fontWeight: 400 }}>— {tx.customer}</span>
                      </p>
                      <p className="text-xs" style={{ color: "#8B93A0" }}>
                        {tx.date}
                      </p>
                    </div>

                    <span
                      className="text-sm font-bold shrink-0"
                      style={{ fontFamily: "'IBM Plex Mono', monospace", color }}
                    >
                      {tx.amount}
                    </span>
                  </div>
                  {i < transactions.length - 1 && <Divider sx={{ borderColor: "rgba(18,24,31,0.06)" }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;