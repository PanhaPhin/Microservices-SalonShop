import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Button,
  IconButton,
  Dialog,
  IconButton as MuiIconButton,
} from "@mui/material";
import {
  Payments,
  EventAvailable,
  PersonAddAlt1,
  ContentCut,
  MoreHoriz,
  Add,
  ArrowOutward,
  ChevronLeft,
  ChevronRight,
  Close,
  CalendarMonth,
  AccessTime,
  TrendingUp,
  TrendingDown,
  Insights,
  Groups,
  ReceiptLong,
  EventBusy,
  AutoAwesome,
} from "@mui/icons-material";

// accent green used for the new booking flow
const GREEN = "#2E7D5B";
const GREEN_SOFT = "rgba(46,125,91,0.12)";
const GOLD = "#C9A227";
const TERRACOTTA = "#E8927C";
const SAGE = "#7C9885";
const INK = "#12181F";
const CARD = "#F6F4F0";
const BG = "#F9FAFB";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

// lightweight month calendar, no date library required
const MiniCalendar = ({ selectedDate, onSelect }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDayIndex; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSameDay = (d) => {
    if (!d || !selectedDate) return false;
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === d
    );
  };
  const isToday = (d) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  const isPast = (d) => {
    const cellDate = new Date(year, month, d);
    const cmpToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return cellDate < cmpToday;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
          {monthLabel}
        </span>
        <div className="flex items-center gap-1">
          <MuiIconButton
            size="small"
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            sx={{ "&:hover": { backgroundColor: GREEN_SOFT } }}
          >
            <ChevronLeft sx={{ fontSize: 18 }} />
          </MuiIconButton>
          <MuiIconButton
            size="small"
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            sx={{ "&:hover": { backgroundColor: GREEN_SOFT } }}
          >
            <ChevronRight sx={{ fontSize: 18 }} />
          </MuiIconButton>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-[10px] text-center text-[#8B93A0] font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const disabled = isPast(d) && !isToday(d);
          const selected = isSameDay(d);
          return (
            <button
              key={i}
              disabled={disabled}
              onClick={() => onSelect(new Date(year, month, d))}
              className="aspect-square rounded-lg text-xs flex items-center justify-center"
              style={{
                backgroundColor: selected ? GREEN : isToday(d) ? GREEN_SOFT : "transparent",
                color: disabled ? "#C7C2B8" : selected ? "#FFFFFF" : "#12181F",
                fontWeight: selected || isToday(d) ? 600 : 400,
                cursor: disabled ? "not-allowed" : "pointer",
                border: isToday(d) && !selected ? `1px solid ${GREEN}` : "1px solid transparent",
                transition: "background-color 0.15s ease, color 0.15s ease, transform 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!disabled && !selected) e.currentTarget.style.backgroundColor = GREEN_SOFT;
              }}
              onMouseLeave={(e) => {
                if (!disabled && !selected) e.currentTarget.style.backgroundColor = isToday(d) ? GREEN_SOFT : "transparent";
              }}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const NewBookingDialog = ({ open, onClose, initialDate, initialTime, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState(initialDate || null);
  const [selectedTime, setSelectedTime] = useState(initialTime || null);

  // keep dialog in sync if the header already has a selection
  useEffect(() => {
    if (open) {
      setSelectedDate(initialDate || null);
      setSelectedTime(initialTime || null);
    }
  }, [open, initialDate, initialTime]);

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm?.(selectedDate, selectedTime);
    onClose();
  };

  const canConfirm = selectedDate && selectedTime;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          backgroundColor: "#FFFFFF",
        },
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold" style={{ fontFamily: "'Fraunces', serif", color: "#12181F" }}>
            New Booking
          </h2>
          <MuiIconButton size="small" onClick={handleClose}>
            <Close sx={{ fontSize: 18 }} />
          </MuiIconButton>
        </div>

        <div className="flex items-center gap-2 mb-2 text-[#6B6B6B]">
          <CalendarMonth sx={{ fontSize: 16, color: GREEN }} />
          <span className="text-xs font-medium uppercase tracking-wide">Select a date</span>
        </div>
        <div
          className="rounded-xl border p-4 mb-5"
          style={{ borderColor: "rgba(18,24,31,0.08)", backgroundColor: "#F9FAFB" }}
        >
          <MiniCalendar selectedDate={selectedDate} onSelect={setSelectedDate} />
        </div>

        <div className="flex items-center gap-2 mb-2 text-[#6B6B6B]">
          <AccessTime sx={{ fontSize: 16, color: GREEN }} />
          <span className="text-xs font-medium uppercase tracking-wide">Select a time</span>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-6 max-h-40 overflow-y-auto pr-1">
          {TIME_SLOTS.map((t) => {
            const selected = selectedTime === t;
            return (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className="text-xs rounded-lg py-1.5"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  backgroundColor: selected ? GREEN : GREEN_SOFT,
                  color: selected ? "#FFFFFF" : "#12181F",
                  fontWeight: selected ? 600 : 400,
                  transition: "background-color 0.15s ease, color 0.15s ease",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        {selectedDate && selectedTime && (
          <p className="text-xs text-[#6B6B6B] mb-4">
            Booking for{" "}
            <span style={{ color: GREEN, fontWeight: 600 }}>
              {selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </span>{" "}
            at <span style={{ color: GREEN, fontWeight: 600 }}>{selectedTime}</span>
          </p>
        )}

        <Button
          fullWidth
          disabled={!canConfirm}
          onClick={handleConfirm}
          sx={{
            bgcolor: GREEN,
            color: "#FFFFFF",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "10px",
            py: 1.1,
            boxShadow: "none",
            "&:hover": { bgcolor: "#256B4C" },
            "&.Mui-disabled": { bgcolor: "#DCD8D0", color: "#8B93A0" },
          }}
        >
          Confirm Booking
        </Button>
      </div>
    </Dialog>
  );
};

// ---- demo data (wire up to your redux store / API later) ----
const kpis = [
  { label: "Today's Revenue", value: "$1,284", delta: "+12%", icon: Payments },
  { label: "Bookings Today", value: "18", delta: "+3", icon: EventAvailable },
  { label: "New Clients", value: "5", delta: "+2", icon: PersonAddAlt1 },
  { label: "Chairs Occupied", value: "72%", delta: "-4%", icon: ContentCut },
];

// secondary analyst-facing KPIs
const analystKpis = [
  { label: "Avg. Ticket Size", value: "$71.30", delta: "+4.2%", icon: ReceiptLong, positive: true },
  { label: "Client Retention", value: "64%", delta: "+2.1%", icon: Groups, positive: true },
  { label: "No-show Rate", value: "3.8%", delta: "-1.4%", icon: EventBusy, positive: true },
  { label: "Rebooking Rate", value: "58%", delta: "-3.0%", icon: Insights, positive: false },
];

const bookings = [
  { time: "09:00", client: "Amara Whitfield", service: "Balayage + Cut", stylist: "Noor", status: "confirmed" },
  { time: "09:30", client: "Leah Osei", service: "Gel Manicure", stylist: "Rin", status: "confirmed" },
  { time: "10:15", client: "Priya Nandan", service: "Beard Trim", stylist: "Marcus", status: "pending" },
  { time: "11:00", client: "Sofia Vance", service: "Keratin Treatment", stylist: "Noor", status: "confirmed" },
  { time: "12:30", client: "Ben Iyer", service: "Skin Fade", stylist: "Marcus", status: "completed" },
  { time: "13:15", client: "Tara Lindqvist", service: "Full Colour", stylist: "Rin", status: "pending" },
];

const stylists = [
  { name: "Noor", load: 90 },
  { name: "Rin", load: 65 },
  { name: "Marcus", load: 48 },
];

const topServices = [
  { name: "Balayage", pct: 88 },
  { name: "Gel Manicure", pct: 64 },
  { name: "Skin Fade", pct: 51 },
  { name: "Keratin Treatment", pct: 39 },
];

// revenue series per period, for the analytics chart
const revenueSeries = {
  Week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [860, 940, 1010, 890, 1284, 1610, 1180],
  },
  Month: {
    labels: ["W1", "W2", "W3", "W4"],
    values: [5620, 6140, 5890, 7040],
  },
  Quarter: {
    labels: ["Apr", "May", "Jun", "Jul"],
    values: [21400, 23800, 22950, 26610],
  },
};

// last vs. this period, for the comparison bars
const comparisonSeries = {
  Week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    previous: [790, 860, 930, 810, 1120, 1440, 1020],
    current: [860, 940, 1010, 890, 1284, 1610, 1180],
  },
  Month: {
    labels: ["W1", "W2", "W3", "W4"],
    previous: [5210, 5680, 5490, 6300],
    current: [5620, 6140, 5890, 7040],
  },
  Quarter: {
    labels: ["Apr", "May", "Jun", "Jul"],
    previous: [19800, 21200, 21600, 24100],
    current: [21400, 23800, 22950, 26610],
  },
};

const insightNotes = [
  {
    icon: TrendingUp,
    tone: SAGE,
    text: "Saturday revenue is up 18% versus the trailing 4-week average, driven mostly by colour services.",
  },
  {
    icon: TrendingDown,
    tone: TERRACOTTA,
    text: "Rebooking rate slipped 3 points this month. Clients seen by Marcus are least likely to rebook on the spot.",
  },
  {
    icon: AutoAwesome,
    tone: GOLD,
    text: "Balayage clients have the highest average ticket ($96) and the highest 60-day repeat rate (71%).",
  },
];

const statusStyle = {
  confirmed: { bg: "bg-[#7C9885]/15", dot: "bg-[#7C9885]", label: "Confirmed" },
  pending: { bg: "bg-[#C9A227]/15", dot: "bg-[#C9A227]", label: "Pending" },
  completed: { bg: "bg-[#8B93A0]/15", dot: "bg-[#8B93A0]", label: "Completed" },
};

// simple SVG donut, no chart lib needed — animates in on mount
const Occupancy = ({ pct = 72 }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - ((mounted ? pct : 0) / 100) * c;
  return (
    <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#DCD8D0" strokeWidth="10" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="#C9A227"
        strokeWidth="10"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.34, 1.2, 0.64, 1)" }}
      />
    </svg>
  );
};

// tiny helper: fade + rise in, staggered by index
const Reveal = ({ children, delay = 0, className = "" }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {children}
    </div>
  );
};

// ---- analytics: revenue trend (SVG area/line chart with hover tooltip) ----
const RevenueTrendChart = ({ labels, values, height = 220 }) => {
  const [mounted, setMounted] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(null);
  useEffect(() => {
    setMounted(false);
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, [values]);

  const width = 640;
  const padX = 28;
  const padTop = 18;
  const padBottom = 30;
  const max = Math.max(...values) * 1.12;
  const min = 0;
  const innerH = height - padTop - padBottom;
  const stepX = (width - padX * 2) / (values.length - 1);

  const points = values.map((v, i) => {
    const x = padX + i * stepX;
    const y = padTop + innerH - ((v - min) / (max - min)) * innerH;
    return { x, y, v };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padTop + innerH} L ${points[0].x} ${padTop + innerH} Z`;

  // catmull-rom-ish smoothing kept simple: straight segments read cleanly at this size
  const gridLines = 4;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GREEN} stopOpacity="0.28" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* gridlines */}
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const y = padTop + (innerH / gridLines) * i;
          return (
            <line
              key={i}
              x1={padX}
              x2={width - padX}
              y1={y}
              y2={y}
              stroke="rgba(18,24,31,0.06)"
              strokeWidth="1"
            />
          );
        })}

        {/* area fill, clipped to reveal on mount */}
        <clipPath id="revealClip">
          <rect
            x="0"
            y="0"
            width={mounted ? width : 0}
            height={height}
            style={{ transition: "width 1s cubic-bezier(0.34, 1.2, 0.64, 1)" }}
          />
        </clipPath>
        <g clipPath="url(#revealClip)">
          <path d={areaPath} fill="url(#revenueFill)" />
          <path d={linePath} fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* hover targets + dots */}
        {points.map((p, i) => (
          <g key={i}>
            <line
              x1={p.x}
              x2={p.x}
              y1={padTop}
              y2={padTop + innerH}
              stroke={GREEN}
              strokeWidth="1"
              opacity={hoverIdx === i ? 0.25 : 0}
              style={{ transition: "opacity 0.15s ease" }}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={hoverIdx === i ? 5 : 3}
              fill={hoverIdx === i ? GREEN : "#FFFFFF"}
              stroke={GREEN}
              strokeWidth="2"
              opacity={mounted ? 1 : 0}
              style={{ transition: "opacity 0.4s ease, r 0.15s ease" }}
            />
            <rect
              x={p.x - stepX / 2}
              y={padTop}
              width={stepX}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              style={{ cursor: "pointer" }}
            />
            <text
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              fontSize="11"
              fill="#8B93A0"
              fontFamily="'IBM Plex Mono', monospace"
            >
              {labels[i]}
            </text>
          </g>
        ))}
      </svg>

      {hoverIdx !== null && (
        <div
          className="absolute px-2.5 py-1.5 rounded-lg text-xs pointer-events-none"
          style={{
            left: `${(points[hoverIdx].x / width) * 100}%`,
            top: Math.max(points[hoverIdx].y - 46, 0),
            transform: "translateX(-50%)",
            backgroundColor: INK,
            color: "#FFFFFF",
            fontFamily: "'IBM Plex Mono', monospace",
            whiteSpace: "nowrap",
            boxShadow: "0 6px 16px rgba(18,24,31,0.25)",
          }}
        >
          {labels[hoverIdx]} &middot; ${points[hoverIdx].v.toLocaleString()}
        </div>
      )}
    </div>
  );
};

// ---- analytics: this-period vs last-period grouped bars ----
const ComparisonBars = ({ labels, previous, current }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(false);
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, [current]);

  const max = Math.max(...previous, ...current) * 1.1;

  return (
    <div className="flex items-end justify-between gap-2" style={{ height: 160 }}>
      {labels.map((label, i) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
          <div className="w-full flex items-end justify-center gap-1" style={{ height: 128 }}>
            <div
              className="rounded-t-md"
              style={{
                width: 8,
                height: mounted ? `${(previous[i] / max) * 100}%` : 0,
                backgroundColor: "#DCD8D0",
                transition: `height 0.7s cubic-bezier(0.34,1.2,0.64,1) ${i * 40}ms`,
              }}
              title={`Previous: $${previous[i].toLocaleString()}`}
            />
            <div
              className="rounded-t-md"
              style={{
                width: 8,
                height: mounted ? `${(current[i] / max) * 100}%` : 0,
                backgroundColor: GREEN,
                transition: `height 0.7s cubic-bezier(0.34,1.2,0.64,1) ${i * 40 + 60}ms`,
              }}
              title={`Current: $${current[i].toLocaleString()}`}
            />
          </div>
          <span className="text-[10px] text-[#8B93A0]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

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

function SalonDashboard() {
  const [barsIn, setBarsIn] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState(null);
  const [period, setPeriod] = useState("Week");

  useEffect(() => {
    const t = requestAnimationFrame(() => setBarsIn(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const trend = useMemo(() => revenueSeries[period], [period]);
  const comparison = useMemo(() => comparisonSeries[period], [period]);
  const periodTotal = useMemo(() => trend.values.reduce((a, b) => a + b, 0), [trend]);
  const periodDelta = useMemo(() => {
    const prevTotal = comparison.previous.reduce((a, b) => a + b, 0);
    const curTotal = comparison.current.reduce((a, b) => a + b, 0);
    return (((curTotal - prevTotal) / prevTotal) * 100).toFixed(1);
  }, [comparison]);

  return (
    <div
      className="min-h-screen w-full px-6 py-8 md:px-10 lg:px-14"
      style={{
        backgroundColor: BG,
        color: INK,
        fontFamily: "'Manrope', 'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <Reveal delay={0} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#8B7A3F] mb-2">
            Salon Dashboard
          </p>
          <h1
            className="text-3xl md:text-4xl font-semibold"
            style={{ fontFamily: "'Fraunces', serif", color: INK }}
          >
            Good afternoon, Priya
          </h1>
          <p className="text-[#6B6B6B] mt-1 text-sm">
            Thursday, 16 August &middot; The Nika Studio
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AvatarGroup max={4}>
            <Avatar sx={{ bgcolor: SAGE }}>N</Avatar>
            <Avatar sx={{ bgcolor: GOLD }}>R</Avatar>
            <Avatar sx={{ bgcolor: TERRACOTTA }}>M</Avatar>
          </AvatarGroup>
          <Button
            startIcon={<Add />}
            onClick={() => setBookingOpen(true)}
            sx={{
              bgcolor: GREEN,
              color: "#FFFFFF",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "10px",
              px: 2.5,
              boxShadow: "none",
              transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
              "&:hover": {
                bgcolor: "#256B4C",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 18px rgba(46,125,91,0.35)",
              },
              "&:active": { transform: "translateY(0)" },
            }}
          >
            New Booking
          </Button>
        </div>
      </Reveal>

      <NewBookingDialog
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialDate={bookingDate}
        initialTime={bookingTime}
        onConfirm={(d, t) => {
          setBookingDate(d);
          setBookingTime(t);
        }}
      />

      {/* Primary KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(({ label, value, delta, icon: Icon }, i) => (
          <Reveal key={label} delay={80 * i}>
            <div
              className="rounded-2xl p-5 border border-[#12181F]/[0.06] group cursor-default"
              style={{
                backgroundColor: CARD,
                transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(18,24,31,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    transition: "transform 0.25s ease",
                    backgroundColor: label === "Bookings Today" ? GREEN_SOFT : "rgba(201,162,39,0.15)",
                  }}
                >
                  <Icon sx={{ fontSize: 18, color: label === "Bookings Today" ? GREEN : GOLD }} />
                </div>
                <span
                  className={`text-xs font-medium ${
                    delta.startsWith("-") ? "text-[#C4695A]" : "text-[#5E8A69]"
                  }`}
                >
                  {delta}
                </span>
              </div>
              <p
                className="text-2xl font-semibold"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {value}
              </p>
              <p className="text-xs text-[#6B6B6B] mt-1">{label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Secondary analyst KPI row */}
      <Reveal delay={60} className="mb-10">
        <div className="rounded-2xl border border-[#12181F]/[0.06] p-5" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="flex items-center gap-2 mb-4">
            <Insights sx={{ fontSize: 16, color: GREEN }} />
            <span className="text-xs font-medium uppercase tracking-wide text-[#6B6B6B]">
              Analyst Metrics
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {analystKpis.map(({ label, value, delta, icon: Icon, positive }) => (
              <div key={label} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: GREEN_SOFT }}
                >
                  <Icon sx={{ fontSize: 16, color: GREEN }} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold leading-tight" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    {value}
                  </p>
                  <p className="text-xs text-[#6B6B6B] truncate">{label}</p>
                  <span
                    className="text-[11px] font-medium inline-flex items-center gap-0.5 mt-0.5"
                    style={{ color: positive ? "#5E8A69" : "#C4695A" }}
                  >
                    {positive ? <TrendingUp sx={{ fontSize: 12 }} /> : <TrendingDown sx={{ fontSize: 12 }} />}
                    {delta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Analytics: revenue trend + comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Reveal delay={120} className="lg:col-span-2">
          <div className="rounded-2xl border border-[#12181F]/[0.06] p-6" style={{ backgroundColor: CARD }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
              <div>
                <h2 className="text-lg font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
                  Revenue Trend
                </h2>
                <p className="text-xs text-[#6B6B6B] mt-0.5">
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, color: INK }}>
                    ${periodTotal.toLocaleString()}
                  </span>{" "}
                  total &middot;{" "}
                  <span style={{ color: periodDelta.startsWith("-") ? "#C4695A" : "#5E8A69", fontWeight: 600 }}>
                    {periodDelta.startsWith("-") ? "" : "+"}
                    {periodDelta}%
                  </span>{" "}
                  vs. prior {period.toLowerCase()}
                </p>
              </div>
              <PeriodTabs value={period} onChange={setPeriod} options={["Week", "Month", "Quarter"]} />
            </div>
            <div className="mt-4">
              <RevenueTrendChart labels={trend.labels} values={trend.values} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="rounded-2xl border border-[#12181F]/[0.06] p-6 h-full" style={{ backgroundColor: CARD }}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-[#6B6B6B]">Current vs. Prior</h3>
              <div className="flex items-center gap-3 text-[10px] text-[#8B93A0]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: "#DCD8D0" }} />
                  Prior
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: GREEN }} />
                  Current
                </span>
              </div>
            </div>
            <div className="mt-4">
              <ComparisonBars labels={comparison.labels} previous={comparison.previous} current={comparison.current} />
            </div>
          </div>
        </Reveal>
      </div>

      {/* Analyst insights strip */}
      <Reveal delay={200} className="mb-10">
        <div className="rounded-2xl border border-[#12181F]/[0.06] p-6" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="flex items-center gap-2 mb-4">
            <AutoAwesome sx={{ fontSize: 16, color: GOLD }} />
            <h3 className="text-sm font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
              Insights this week
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insightNotes.map((n, i) => (
              <div
                key={i}
                className="rounded-xl p-4 flex gap-3"
                style={{ backgroundColor: BG, border: "1px solid rgba(18,24,31,0.06)" }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${n.tone}22` }}
                >
                  <n.icon sx={{ fontSize: 15, color: n.tone }} />
                </div>
                <p className="text-xs leading-relaxed text-[#3A3F45]">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Book (ledger list) */}
        <Reveal delay={120} className="lg:col-span-2">
          <div
            className="rounded-2xl border border-[#12181F]/[0.06] p-6"
            style={{ backgroundColor: CARD, color: INK }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
                Today's Book
              </h2>
              <button
                className="text-xs text-[#8B7A55] flex items-center gap-1 group"
                style={{ transition: "opacity 0.2s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.65")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                View full calendar
                <ArrowOutward
                  sx={{
                    fontSize: 14,
                    transition: "transform 0.2s ease",
                  }}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            </div>

            <div className="divide-y divide-[#12181F]/[0.08]">
              {bookings.map((b, i) => {
                const s = statusStyle[b.status];
                return (
                  <Reveal key={b.time + b.client} delay={160 + 60 * i}>
                    <div
                      className="flex items-center gap-4 py-3.5 rounded-lg px-2 -mx-2"
                      style={{ transition: "background-color 0.2s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(18,24,31,0.03)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <span
                        className="w-14 shrink-0 text-sm text-[#8B7A55]"
                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                      >
                        {b.time}
                      </span>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{b.client}</p>
                        <p className="text-xs text-[#6B6355] truncate">
                          {b.service} &middot; with {b.stylist}
                        </p>
                      </div>

                      {/* dotted leader */}
                      <div className="hidden md:block flex-1 border-b border-dotted border-[#12181F]/20 mx-2" />

                      <span
                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${s.bg}`}
                        style={{ transition: "transform 0.2s ease" }}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>

                      <IconButton
                        size="small"
                        sx={{
                          transition: "background-color 0.2s ease, transform 0.2s ease",
                          "&:hover": { backgroundColor: "rgba(18,24,31,0.06)" },
                        }}
                      >
                        <MoreHoriz sx={{ fontSize: 18, color: "#8B7A55" }} />
                      </IconButton>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Occupancy */}
          <Reveal delay={200}>
            <div
              className="rounded-2xl border border-[#12181F]/[0.06] p-6 flex flex-col items-center"
              style={{ backgroundColor: CARD }}
            >
              <h3 className="text-sm font-medium self-start mb-2 text-[#6B6B6B]">
                Chair Occupancy
              </h3>
              <div className="relative">
                <Occupancy pct={72} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-semibold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    72%
                  </span>
                </div>
              </div>

              <div className="w-full mt-5 space-y-3">
                {stylists.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{s.name}</span>
                      <span className="text-[#6B6B6B]">{s.load}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#DCD8D0] overflow-hidden">
                      <div
                        className="h-1.5 rounded-full bg-[#C9A227]"
                        style={{
                          width: barsIn ? `${s.load}%` : "0%",
                          transition: "width 1s cubic-bezier(0.34, 1.2, 0.64, 1)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Top services */}
          <Reveal delay={260}>
            <div
              className="rounded-2xl border border-[#12181F]/[0.06] p-6"
              style={{ backgroundColor: CARD }}
            >
              <h3 className="text-sm font-medium mb-4 text-[#6B6B6B]">
                Top Services This Week
              </h3>
              <div className="space-y-3">
                {topServices.map((s) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-sm w-32 truncate">{s.name}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-[#DCD8D0] overflow-hidden">
                      <div
                        className="h-1.5 rounded-full bg-[#E8927C]"
                        style={{
                          width: barsIn ? `${s.pct}%` : "0%",
                          transition: "width 1s cubic-bezier(0.34, 1.2, 0.64, 1)",
                        }}
                      />
                    </div>
                    <span
                      className="text-xs text-[#6B6B6B] w-8 text-right"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {s.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

export default SalonDashboard;