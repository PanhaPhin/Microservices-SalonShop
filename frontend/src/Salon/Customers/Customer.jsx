import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  IconButton as MuiIconButton,
  Dialog,
  Chip,
} from "@mui/material";
import {
  Search,
  Add,
  Close,
  Phone,
  Mail,
  CalendarMonth,
  Star,
  StarBorder,
  ContentCut,
  TrendingUp,
  TrendingDown,
  PersonAddAlt1,
  Groups,
  Payments,
  History,
  LocalOffer,
} from "@mui/icons-material";

// shared token system, kept consistent with the rest of the app
const GREEN = "#2E7D5B";
const GREEN_SOFT = "rgba(46,125,91,0.12)";
const GOLD = "#C9A227";
const TERRACOTTA = "#E8927C";
const SAGE = "#7C9885";
const INK = "#12181F";
const CARD = "#F6F4F0";
const BG = "#F9FAFB";

// ---- demo data ----
const customers = [
  {
    id: "amara",
    name: "Amara Whitfield",
    initials: "AW",
    email: "amara.w@mail.com",
    phone: "(555) 021-4471",
    tier: "Gold",
    visits: 24,
    ltv: 2140,
    lastVisit: "2 days ago",
    nextVisit: "Sep 3, 10:00 AM",
    favorite: "Balayage + Cut",
    stylist: "Noor",
    trend: 8,
    color: GREEN,
  },
  {
    id: "leah",
    name: "Leah Osei",
    initials: "LO",
    email: "leah.osei@mail.com",
    phone: "(555) 021-9982",
    tier: "Silver",
    visits: 11,
    ltv: 690,
    lastVisit: "1 week ago",
    nextVisit: "Aug 27, 9:30 AM",
    favorite: "Gel Manicure",
    stylist: "Rin",
    trend: 3,
    color: GOLD,
  },
  {
    id: "priya",
    name: "Priya Nandan",
    initials: "PN",
    email: "priya.n@mail.com",
    phone: "(555) 021-3305",
    tier: "New",
    visits: 1,
    ltv: 45,
    lastVisit: "3 weeks ago",
    nextVisit: "Not scheduled",
    favorite: "Beard Trim",
    stylist: "Marcus",
    trend: 0,
    color: SAGE,
  },
  {
    id: "sofia",
    name: "Sofia Vance",
    initials: "SV",
    email: "sofia.vance@mail.com",
    phone: "(555) 021-7761",
    tier: "Gold",
    visits: 31,
    ltv: 3280,
    lastVisit: "Yesterday",
    nextVisit: "Sep 10, 11:00 AM",
    favorite: "Keratin Treatment",
    stylist: "Noor",
    trend: 14,
    color: GREEN,
  },
  {
    id: "ben",
    name: "Ben Iyer",
    initials: "BI",
    email: "ben.iyer@mail.com",
    phone: "(555) 021-6620",
    tier: "Silver",
    visits: 9,
    ltv: 540,
    lastVisit: "5 days ago",
    nextVisit: "Not scheduled",
    favorite: "Skin Fade",
    stylist: "Marcus",
    trend: -5,
    color: TERRACOTTA,
  },
  {
    id: "tara",
    name: "Tara Lindqvist",
    initials: "TL",
    email: "tara.l@mail.com",
    phone: "(555) 021-8834",
    tier: "New",
    visits: 2,
    ltv: 210,
    lastVisit: "2 weeks ago",
    nextVisit: "Aug 30, 1:15 PM",
    favorite: "Full Colour",
    stylist: "Rin",
    trend: 0,
    color: SAGE,
  },
];

const tierStyle = {
  Gold: { bg: "rgba(201,162,39,0.15)", text: GOLD, label: "Gold" },
  Silver: { bg: "rgba(139,147,160,0.15)", text: "#6B7280", label: "Silver" },
  New: { bg: GREEN_SOFT, text: GREEN, label: "New" },
};

const visitHistory = [
  { date: "Aug 19", service: "Balayage + Cut", stylist: "Noor", amount: 96 },
  { date: "Jul 22", service: "Root Touch-up", stylist: "Noor", amount: 68 },
  { date: "Jun 14", service: "Balayage + Cut", stylist: "Noor", amount: 92 },
];

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

const TierFilter = ({ value, onChange }) => {
  const options = ["All", "Gold", "Silver", "New"];
  return (
    <div className="flex items-center rounded-full p-1" style={{ backgroundColor: "rgba(18,24,31,0.05)" }}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="text-xs px-3 py-1.5 rounded-full font-medium"
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
};

const CustomerDetailDialog = ({ customer, open, onClose }) => {
  if (!customer) return null;
  const t = tierStyle[customer.tier];
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: "20px", backgroundColor: "#FFFFFF" } }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <Avatar sx={{ width: 52, height: 52, bgcolor: customer.color, fontSize: 18 }}>
              {customer.initials}
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold" style={{ fontFamily: "'Fraunces', serif", color: INK }}>
                {customer.name}
              </h2>
              <span
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full mt-1"
                style={{ backgroundColor: t.bg, color: t.text }}
              >
                <Star sx={{ fontSize: 12 }} />
                {t.label} member
              </span>
            </div>
          </div>
          <MuiIconButton size="small" onClick={onClose}>
            <Close sx={{ fontSize: 18 }} />
          </MuiIconButton>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5 text-sm text-[#3A3F45]">
          <div className="flex items-center gap-2">
            <Mail sx={{ fontSize: 15, color: customer.color }} />
            {customer.email}
          </div>
          <div className="flex items-center gap-2">
            <Phone sx={{ fontSize: 15, color: customer.color }} />
            {customer.phone}
          </div>
          <div className="flex items-center gap-2">
            <ContentCut sx={{ fontSize: 15, color: customer.color }} />
            Prefers {customer.favorite} with {customer.stylist}
          </div>
          <div className="flex items-center gap-2">
            <CalendarMonth sx={{ fontSize: 15, color: customer.color }} />
            Next: {customer.nextVisit}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl p-4" style={{ backgroundColor: BG, border: "1px solid rgba(18,24,31,0.06)" }}>
            <p className="text-xs text-[#6B6B6B] mb-1">Lifetime value</p>
            <p className="text-lg font-semibold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              ${customer.ltv.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: BG, border: "1px solid rgba(18,24,31,0.06)" }}>
            <p className="text-xs text-[#6B6B6B] mb-1">Total visits</p>
            <p className="text-lg font-semibold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              {customer.visits}
            </p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: BG, border: "1px solid rgba(18,24,31,0.06)" }}>
            <p className="text-xs text-[#6B6B6B] mb-1">Last visit</p>
            <p className="text-sm font-semibold mt-1">{customer.lastVisit}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 text-[#6B6B6B]">
          <History sx={{ fontSize: 15, color: customer.color }} />
          <span className="text-xs font-medium uppercase tracking-wide">Recent visits</span>
        </div>
        <div className="divide-y divide-[#12181F]/[0.08] mb-6">
          {visitHistory.map((v, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 text-sm">
              <span className="w-16 text-[#8B7A55]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {v.date}
              </span>
              <span className="flex-1 text-[#3A3F45]">{v.service}</span>
              <span className="text-xs text-[#6B6B6B] w-16 text-right">{v.stylist}</span>
              <span
                className="w-14 text-right font-medium"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                ${v.amount}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            fullWidth
            sx={{
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
            Book Appointment
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{
              color: INK,
              borderColor: "rgba(18,24,31,0.15)",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "10px",
              py: 1.1,
              "&:hover": { borderColor: GREEN, backgroundColor: GREEN_SOFT },
            }}
          >
            Send Message
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default function Customer() {
  const [query, setQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.favorite.toLowerCase().includes(q);
      const matchesTier = tierFilter === "All" || c.tier === tierFilter;
      return matchesQuery && matchesTier;
    });
  }, [query, tierFilter]);

  const totals = useMemo(() => {
    const totalLtv = customers.reduce((a, c) => a + c.ltv, 0);
    const newThisMonth = customers.filter((c) => c.tier === "New").length;
    const avgVisits = (customers.reduce((a, c) => a + c.visits, 0) / customers.length).toFixed(1);
    return { total: customers.length, totalLtv, newThisMonth, avgVisits };
  }, []);

  return (
    <div
      className="min-h-screen w-full px-6 py-8 md:px-10 lg:px-14"
      style={{ backgroundColor: BG, color: INK, fontFamily: "'Manrope', 'Inter', sans-serif" }}
    >
      {/* Header */}
      <Reveal delay={0} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#8B7A3F] mb-2">Customers</p>
          <h1 className="text-3xl md:text-4xl font-semibold" style={{ fontFamily: "'Fraunces', serif", color: INK }}>
            Client Book
          </h1>
          <p className="text-[#6B6B6B] mt-1 text-sm">
            {totals.total} clients on file &middot; {totals.newThisMonth} new this month
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
          Add Client
        </Button>
      </Reveal>

      {/* KPI row */}
      <Reveal delay={60} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Clients", value: totals.total, icon: Groups },
          { label: "New This Month", value: totals.newThisMonth, icon: PersonAddAlt1 },
          { label: "Avg. Visits / Client", value: totals.avgVisits, icon: History },
          { label: "Total Lifetime Value", value: `$${totals.totalLtv.toLocaleString()}`, icon: Payments },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl p-5 border border-[#12181F]/[0.06]" style={{ backgroundColor: CARD }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: GREEN_SOFT }}>
              <Icon sx={{ fontSize: 18, color: GREEN }} />
            </div>
            <p className="text-2xl font-semibold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              {value}
            </p>
            <p className="text-xs text-[#6B6B6B] mt-1">{label}</p>
          </div>
        ))}
      </Reveal>

      {/* Search + filter */}
      <Reveal delay={100} className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div
          className="flex items-center gap-2 rounded-xl border px-4 py-2.5 max-w-sm w-full"
          style={{ borderColor: "rgba(18,24,31,0.1)", backgroundColor: "#FFFFFF" }}
        >
          <Search sx={{ fontSize: 18, color: "#8B93A0" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or service"
            className="text-sm w-full outline-none bg-transparent"
            style={{ color: INK }}
          />
        </div>
        <TierFilter value={tierFilter} onChange={setTierFilter} />
      </Reveal>

      {/* Customer table */}
      <Reveal delay={140}>
        <div className="rounded-2xl border border-[#12181F]/[0.06] overflow-hidden" style={{ backgroundColor: CARD }}>
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 text-[11px] font-medium uppercase tracking-wide text-[#8B93A0] border-b border-[#12181F]/[0.06]">
            <span>Client</span>
            <span>Tier</span>
            <span>Visits</span>
            <span>Lifetime Value</span>
            <span>Last Visit</span>
            <span />
          </div>

          <div className="divide-y divide-[#12181F]/[0.08]">
            {filtered.map((c, i) => {
              const t = tierStyle[c.tier];
              return (
                <Reveal key={c.id} delay={160 + i * 50}>
                  <button
                    onClick={() => {
                      setSelected(c);
                      setDetailOpen(true);
                    }}
                    className="w-full text-left grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center"
                    style={{ transition: "background-color 0.2s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(18,24,31,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar sx={{ width: 34, height: 34, fontSize: 13, bgcolor: c.color }}>
                        {c.initials}
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{c.name}</p>
                        <p className="text-xs text-[#6B6355] truncate">{c.favorite}</p>
                      </div>
                    </div>

                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full w-fit"
                      style={{ backgroundColor: t.bg, color: t.text }}
                    >
                      {t.label}
                    </span>

                    <span className="text-sm hidden md:flex items-center gap-1.5">
                      {c.visits}
                      {c.trend !== 0 && (
                        <span
                          className="text-[11px] font-medium flex items-center"
                          style={{ color: c.trend > 0 ? "#5E8A69" : "#C4695A" }}
                        >
                          {c.trend > 0 ? <TrendingUp sx={{ fontSize: 12 }} /> : <TrendingDown sx={{ fontSize: 12 }} />}
                          {Math.abs(c.trend)}%
                        </span>
                      )}
                    </span>

                    <span
                      className="text-sm hidden md:inline font-medium"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      ${c.ltv.toLocaleString()}
                    </span>

                    <span className="text-xs text-[#6B6B6B] hidden md:inline">{c.lastVisit}</span>

                    <span className="text-xs font-medium hidden md:flex items-center gap-0.5 justify-end" style={{ color: GREEN }}>
                      View
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-[#6B6B6B]">No clients match your search.</p>
            </div>
          )}
        </div>
      </Reveal>

      <CustomerDetailDialog customer={selected} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </div>
  );
}