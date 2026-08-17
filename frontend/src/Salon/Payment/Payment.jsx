import React from "react";
import Divider from "@mui/material/Divider";
import {
  Payments,
  TrendingUp,
  HourglassEmpty,
  ContentCut,
  Palette,
  Spa,
  Undo,
  ArrowOutward,
} from "@mui/icons-material";

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";
const AMBER = "#D97706";
const AMBER_SOFT = "rgba(217,119,6,0.10)";
const RED = "#C4695A";
const RED_SOFT = "rgba(196,105,90,0.10)";

const stats = [
  {
    label: "Total Earning",
    value: "$100",
    icon: Payments,
    accent: GREEN,
    accentSoft: GREEN_SOFT,
    footLabel: "Last Payment",
    footValue: "$20",
  },
  {
    label: "This Month",
    value: "$45",
    icon: TrendingUp,
    accent: GREEN,
    accentSoft: GREEN_SOFT,
    footLabel: "Last Month",
    footValue: "$38",
  },
  {
    label: "Pending",
    value: "$15",
    icon: HourglassEmpty,
    accent: AMBER,
    accentSoft: AMBER_SOFT,
    footLabel: "Next Payout",
    footValue: "June 30",
  },
];

const transactions = [
  {
    label: "Classic Haircut",
    customer: "Sophea K.",
    date: "Jun 24",
    amount: "+$25",
    positive: true,
    icon: ContentCut,
  },
  {
    label: "Hair Coloring",
    customer: "Dara M.",
    date: "Jun 22",
    amount: "+$80",
    positive: true,
    icon: Palette,
  },
  {
    label: "Refund",
    customer: "Lina T.",
    date: "Jun 20",
    amount: "-$10",
    positive: false,
    icon: Undo,
  },
  {
    label: "Facial Treatment",
    customer: "Chan P.",
    date: "Jun 18",
    amount: "+$55",
    positive: true,
    icon: Spa,
  },
];

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

const Payment = () => {
  return (
    <div
      className="min-h-screen w-full px-6 py-8 md:px-10 lg:px-14"
      style={{ backgroundColor: "#F9FAFB", fontFamily: "'Manrope', 'Inter', sans-serif" }}
    >
      {/* header */}
      <div className="mb-6">
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}

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
            {transactions.map((tx, i) => {
              const Icon = tx.icon;
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