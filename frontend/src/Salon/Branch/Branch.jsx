import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Button,
  IconButton as MuiIconButton,
  Dialog,
} from "@mui/material";
import {
  Storefront,
  LocationOn,
  Phone,
  Payments,
  EventAvailable,
  Groups,
  ContentCut,
  TrendingUp,
  TrendingDown,
  Add,
  Close,
  Star,
  ChevronRight,
  Search,
} from "@mui/icons-material";

// shared token system, kept consistent with the main dashboard
const GREEN = "#2E7D5B";
const GREEN_SOFT = "rgba(46,125,91,0.12)";
const GOLD = "#C9A227";
const TERRACOTTA = "#E8927C";
const SAGE = "#7C9885";
const INK = "#12181F";
const CARD = "#F6F4F0";
const BG = "#F9FAFB";

// ---- demo data ----
const branches = [
  {
    id: "flora",
    name: "Flora District",
    address: "214 Maple Row, Flora District",
    phone: "(555) 014-2291",
    manager: "Priya Nandan",
    initials: "PN",
    status: "open",
    revenueToday: 1284,
    revenueDelta: 12,
    bookingsToday: 18,
    occupancy: 72,
    staffCount: 6,
    rating: 4.8,
    color: GREEN,
  },
  {
    id: "harbor",
    name: "Harbor Quay",
    address: "9 Pier Street, Harbor Quay",
    phone: "(555) 014-7735",
    manager: "Desmond Okafor",
    initials: "DO",
    status: "open",
    revenueToday: 960,
    revenueDelta: -4,
    bookingsToday: 13,
    occupancy: 58,
    staffCount: 4,
    rating: 4.6,
    color: GOLD,
  },
  {
    id: "north",
    name: "North Fields",
    address: "77 Aldergate Ave, North Fields",
    phone: "(555) 014-5560",
    manager: "Yuki Tanaka",
    initials: "YT",
    status: "closed",
    revenueToday: 0,
    revenueDelta: 0,
    bookingsToday: 0,
    occupancy: 0,
    staffCount: 5,
    rating: 4.9,
    color: TERRACOTTA,
  },
  {
    id: "riverside",
    name: "Riverside Mews",
    address: "48 Millrace Lane, Riverside Mews",
    phone: "(555) 014-8802",
    manager: "Amara Whitfield",
    initials: "AW",
    status: "open",
    revenueToday: 1560,
    revenueDelta: 21,
    bookingsToday: 22,
    occupancy: 88,
    staffCount: 7,
    rating: 4.7,
    color: SAGE,
  },
];

const statusStyle = {
  open: { bg: "bg-[#7C9885]/15", dot: "bg-[#7C9885]", label: "Open now" },
  closed: { bg: "bg-[#8B93A0]/15", dot: "bg-[#8B93A0]", label: "Closed" },
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

const OccupancyRing = ({ pct = 0, color = GREEN, size = 56 }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, [pct]);
  const r = 22;
  const c = 2 * Math.PI * r;
  const offset = c - ((mounted ? pct : 0) / 100) * c;
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" className="-rotate-90 shrink-0">
      <circle cx="28" cy="28" r={r} fill="none" stroke="#DCD8D0" strokeWidth="6" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.34, 1.2, 0.64, 1)" }}
      />
    </svg>
  );
};

const BranchDetailDialog = ({ branch, open, onClose }) => {
  if (!branch) return null;
  const s = statusStyle[branch.status];
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: "20px", backgroundColor: "#FFFFFF" } }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold" style={{ fontFamily: "'Fraunces', serif", color: INK }}>
              {branch.name}
            </h2>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mt-2 ${s.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          </div>
          <MuiIconButton size="small" onClick={onClose}>
            <Close sx={{ fontSize: 18 }} />
          </MuiIconButton>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-[#3A3F45]">
            <LocationOn sx={{ fontSize: 16, color: branch.color }} />
            {branch.address}
          </div>
          <div className="flex items-center gap-2 text-sm text-[#3A3F45]">
            <Phone sx={{ fontSize: 16, color: branch.color }} />
            {branch.phone}
          </div>
          <div className="flex items-center gap-2 text-sm text-[#3A3F45]">
            <Groups sx={{ fontSize: 16, color: branch.color }} />
            Managed by {branch.manager} &middot; {branch.staffCount} staff
          </div>
          <div className="flex items-center gap-2 text-sm text-[#3A3F45]">
            <Star sx={{ fontSize: 16, color: GOLD }} />
            {branch.rating} average rating
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-4" style={{ backgroundColor: BG, border: "1px solid rgba(18,24,31,0.06)" }}>
            <p className="text-xs text-[#6B6B6B] mb-1">Revenue today</p>
            <p className="text-xl font-semibold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              ${branch.revenueToday.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: BG, border: "1px solid rgba(18,24,31,0.06)" }}>
            <p className="text-xs text-[#6B6B6B] mb-1">Bookings today</p>
            <p className="text-xl font-semibold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              {branch.bookingsToday}
            </p>
          </div>
        </div>

        <Button
          fullWidth
          onClick={onClose}
          sx={{
            mt: 3,
            bgcolor: GREEN,
            color: "#FFFFFF",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "10px",
            py: 1.1,
            boxShadow: "none",
            "&:hover": { bgcolor: "#256B4C" },
          }}
        >
          View full dashboard
        </Button>
      </div>
    </Dialog>
  );
};

export default function Branch() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return branches;
    return branches.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.manager.toLowerCase().includes(q)
    );
  }, [query]);

  const totals = useMemo(() => {
    const open = branches.filter((b) => b.status === "open");
    return {
      revenue: open.reduce((a, b) => a + b.revenueToday, 0),
      bookings: open.reduce((a, b) => a + b.bookingsToday, 0),
      staff: branches.reduce((a, b) => a + b.staffCount, 0),
      openCount: open.length,
    };
  }, []);

  return (
    <div
      className="min-h-screen w-full px-6 py-8 md:px-10 lg:px-14"
      style={{ backgroundColor: BG, color: INK, fontFamily: "'Manrope', 'Inter', sans-serif" }}
    >
      {/* Header */}
      <Reveal delay={0} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#8B7A3F] mb-2">Branches</p>
          <h1 className="text-3xl md:text-4xl font-semibold" style={{ fontFamily: "'Fraunces', serif", color: INK }}>
            All Locations
          </h1>
          <p className="text-[#6B6B6B] mt-1 text-sm">
            {totals.openCount} of {branches.length} branches open right now
          </p>
        </div>

        <Button
          startIcon={<Add />}
          sx={{
            bgcolor: GREEN,
            color: "#FFFFFF",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "10px",
            px: 2.5,
            boxShadow: "none",
            transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
            "&:hover": { bgcolor: "#256B4C", transform: "translateY(-2px)", boxShadow: "0 8px 18px rgba(46,125,91,0.35)" },
            "&:active": { transform: "translateY(0)" },
          }}
        >
          Add Branch
        </Button>
      </Reveal>

      {/* Portfolio KPI row */}
      <Reveal delay={60} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Revenue Today (all)", value: `$${totals.revenue.toLocaleString()}`, icon: Payments },
          { label: "Bookings Today (all)", value: totals.bookings, icon: EventAvailable },
          { label: "Total Staff", value: totals.staff, icon: Groups },
          { label: "Open Branches", value: `${totals.openCount}/${branches.length}`, icon: Storefront },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl p-5 border border-[#12181F]/[0.06]"
            style={{ backgroundColor: CARD }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: GREEN_SOFT }}
            >
              <Icon sx={{ fontSize: 18, color: GREEN }} />
            </div>
            <p className="text-2xl font-semibold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              {value}
            </p>
            <p className="text-xs text-[#6B6B6B] mt-1">{label}</p>
          </div>
        ))}
      </Reveal>

      {/* Search */}
      <Reveal delay={100} className="mb-6">
        <div
          className="flex items-center gap-2 rounded-xl border px-4 py-2.5 max-w-sm"
          style={{ borderColor: "rgba(18,24,31,0.1)", backgroundColor: "#FFFFFF" }}
        >
          <Search sx={{ fontSize: 18, color: "#8B93A0" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by branch, address, or manager"
            className="text-sm w-full outline-none bg-transparent"
            style={{ color: INK }}
          />
        </div>
      </Reveal>

      {/* Branch cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((b, i) => {
          const s = statusStyle[b.status];
          return (
            <Reveal key={b.id} delay={140 + i * 60}>
              <button
                onClick={() => {
                  setSelected(b);
                  setDetailOpen(true);
                }}
                className="w-full text-left rounded-2xl border border-[#12181F]/[0.06] p-6 group"
                style={{ backgroundColor: CARD, transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 14px 28px rgba(18,24,31,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${b.color}1F` }}
                    >
                      <Storefront sx={{ fontSize: 20, color: b.color }} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
                        {b.name}
                      </h3>
                      <p className="text-xs text-[#6B6355] flex items-center gap-1 mt-0.5">
                        <LocationOn sx={{ fontSize: 13 }} />
                        {b.address}
                      </p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${s.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-lg font-semibold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                        ${b.revenueToday.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-[#6B6B6B]">Revenue today</p>
                    </div>
                    {b.revenueDelta !== 0 && (
                      <span
                        className="text-xs font-medium flex items-center gap-0.5"
                        style={{ color: b.revenueDelta > 0 ? "#5E8A69" : "#C4695A" }}
                      >
                        {b.revenueDelta > 0 ? (
                          <TrendingUp sx={{ fontSize: 13 }} />
                        ) : (
                          <TrendingDown sx={{ fontSize: 13 }} />
                        )}
                        {Math.abs(b.revenueDelta)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <OccupancyRing pct={b.occupancy} color={b.color} />
                    <div className="text-right">
                      <p className="text-sm font-semibold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                        {b.occupancy}%
                      </p>
                      <p className="text-[11px] text-[#6B6B6B]">Occupied</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-dotted border-[#12181F]/15">
                  <div className="flex items-center gap-2">
                    <Avatar sx={{ width: 26, height: 26, fontSize: 12, bgcolor: b.color }}>
                      {b.initials}
                    </Avatar>
                    <span className="text-xs text-[#3A3F45]">{b.manager}</span>
                  </div>
                  <span
                    className="text-xs font-medium flex items-center gap-0.5"
                    style={{ color: b.color, transition: "gap 0.2s ease" }}
                  >
                    Details
                    <ChevronRight sx={{ fontSize: 15 }} />
                  </span>
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Reveal delay={0} className="text-center py-16">
          <p className="text-sm text-[#6B6B6B]">No branches match "{query}".</p>
        </Reveal>
      )}

      <BranchDetailDialog branch={selected} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </div>
  );
}