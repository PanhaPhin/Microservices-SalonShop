import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  IconButton as MuiIconButton,
  Dialog,
  Switch,
} from "@mui/material";
import {
  Search,
  Add,
  Close,
  LocalOffer,
  CalendarMonth,
  ContentCut,
  TrendingUp,
  Redeem,
  Percent,
  Groups,
  Bolt,
  Schedule,
  CheckCircle,
  PauseCircle,
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
const offers = [
  {
    id: "welcome10",
    name: "Welcome Offer",
    code: "WELCOME10",
    type: "percent",
    value: 10,
    audience: "New clients",
    service: "Any service",
    status: "active",
    redemptions: 42,
    limit: 100,
    starts: "Aug 1",
    ends: "Sep 30",
    color: GREEN,
  },
  {
    id: "balayage-flash",
    name: "Balayage Flash Sale",
    code: "GOLDEN25",
    type: "percent",
    value: 25,
    audience: "All clients",
    service: "Balayage + Cut",
    status: "active",
    redemptions: 18,
    limit: 40,
    starts: "Aug 18",
    ends: "Aug 24",
    color: GOLD,
  },
  {
    id: "referral",
    name: "Refer a Friend",
    code: "FRIEND15",
    type: "flat",
    value: 15,
    audience: "Existing clients",
    service: "Any service",
    status: "active",
    redemptions: 27,
    limit: null,
    starts: "Jul 1",
    ends: "Ongoing",
    color: SAGE,
  },
  {
    id: "quiet-tues",
    name: "Quiet Tuesdays",
    code: "TUES20",
    type: "percent",
    value: 20,
    audience: "All clients",
    service: "Colour services",
    status: "scheduled",
    redemptions: 0,
    limit: 60,
    starts: "Sep 1",
    ends: "Oct 31",
    color: TERRACOTTA,
  },
  {
    id: "summer-glow",
    name: "Summer Glow",
    code: "GLOW30",
    type: "percent",
    value: 30,
    audience: "All clients",
    service: "Keratin Treatment",
    status: "expired",
    redemptions: 63,
    limit: 60,
    starts: "Jun 1",
    ends: "Jul 31",
    color: "#8B93A0",
  },
  {
    id: "birthday",
    name: "Birthday Treat",
    code: "BDAY10",
    type: "flat",
    value: 10,
    audience: "Gold members",
    service: "Any service",
    status: "active",
    redemptions: 9,
    limit: null,
    starts: "Jan 1",
    ends: "Ongoing",
    color: GREEN,
  },
];

const statusStyle = {
  active: { bg: "rgba(46,125,91,0.12)", text: GREEN, icon: CheckCircle, label: "Active" },
  scheduled: { bg: "rgba(201,162,39,0.15)", text: GOLD, icon: Schedule, label: "Scheduled" },
  expired: { bg: "rgba(139,147,160,0.15)", text: "#6B7280", icon: PauseCircle, label: "Expired" },
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

const StatusFilter = ({ value, onChange }) => {
  const options = ["All", "active", "scheduled", "expired"];
  const labels = { All: "All", active: "Active", scheduled: "Scheduled", expired: "Expired" };
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
            {labels[opt]}
          </button>
        );
      })}
    </div>
  );
};

const UsageBar = ({ redemptions, limit, color }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);
  if (!limit) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          {redemptions}
        </span>
        <span className="text-[11px] text-[#8B93A0]">redeemed &middot; no cap</span>
      </div>
    );
  }
  const pct = Math.min((redemptions / limit) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-[11px] text-[#6B6B6B] mb-1">
        <span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: INK, fontWeight: 600 }}>
            {redemptions}
          </span>{" "}
          / {limit} redeemed
        </span>
        <span>{pct.toFixed(0)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#DCD8D0] overflow-hidden">
        <div
          className="h-1.5 rounded-full"
          style={{
            width: mounted ? `${pct}%` : "0%",
            backgroundColor: color,
            transition: "width 0.9s cubic-bezier(0.34, 1.2, 0.64, 1)",
          }}
        />
      </div>
    </div>
  );
};

const NewOfferDialog = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("percent");
  const [value, setValue] = useState("");

  const inputStyle = {
    width: "100%",
    fontSize: "14px",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(18,24,31,0.12)",
    outline: "none",
    backgroundColor: "#FFFFFF",
    color: INK,
    fontFamily: "'Manrope', 'Inter', sans-serif",
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: "20px", backgroundColor: "#FFFFFF" } }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold" style={{ fontFamily: "'Fraunces', serif", color: INK }}>
            New Offer
          </h2>
          <MuiIconButton size="small" onClick={onClose}>
            <Close sx={{ fontSize: 18 }} />
          </MuiIconButton>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-medium text-[#6B6B6B] mb-1.5 block">Offer name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Autumn Refresh"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B6B6B] mb-1.5 block">Promo code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. AUTUMN15"
              style={{ ...inputStyle, fontFamily: "'IBM Plex Mono', monospace" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[#6B6B6B] mb-1.5 block">Discount type</label>
              <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "rgba(18,24,31,0.12)" }}>
                {["percent", "flat"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className="flex-1 text-xs py-2 font-medium"
                    style={{
                      backgroundColor: type === t ? GREEN : "#FFFFFF",
                      color: type === t ? "#FFFFFF" : "#6B6B6B",
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    {t === "percent" ? "% off" : "$ off"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B6B6B] mb-1.5 block">Value</label>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder={type === "percent" ? "15" : "10"}
                style={{ ...inputStyle, fontFamily: "'IBM Plex Mono', monospace" }}
              />
            </div>
          </div>
        </div>

        <Button
          fullWidth
          onClick={onClose}
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
          Create Offer
        </Button>
      </div>
    </Dialog>
  );
};

export default function Offers() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [createOpen, setCreateOpen] = useState(false);
  const [toggles, setToggles] = useState(() =>
    Object.fromEntries(offers.map((o) => [o.id, o.status === "active"]))
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return offers.filter((o) => {
      const matchesQuery =
        !q || o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q) || o.service.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || o.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  const totals = useMemo(() => {
    const active = offers.filter((o) => o.status === "active").length;
    const redemptions = offers.reduce((a, o) => a + o.redemptions, 0);
    const avgDiscount = Math.round(
      offers.filter((o) => o.type === "percent").reduce((a, o) => a + o.value, 0) /
        offers.filter((o) => o.type === "percent").length
    );
    return { active, redemptions, avgDiscount, total: offers.length };
  }, []);

  return (
    <div
      className="min-h-screen w-full px-6 py-8 md:px-10 lg:px-14"
      style={{ backgroundColor: BG, color: INK, fontFamily: "'Manrope', 'Inter', sans-serif" }}
    >
      {/* Header */}
      <Reveal delay={0} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#8B7A3F] mb-2">Marketing</p>
          <h1 className="text-3xl md:text-4xl font-semibold" style={{ fontFamily: "'Fraunces', serif", color: INK }}>
            Offers &amp; Promotions
          </h1>
          <p className="text-[#6B6B6B] mt-1 text-sm">
            {totals.active} active offer{totals.active === 1 ? "" : "s"} &middot; {totals.redemptions} total redemptions
          </p>
        </div>

        <Button
          startIcon={<Add />}
          onClick={() => setCreateOpen(true)}
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
          New Offer
        </Button>
      </Reveal>

      {/* KPI row */}
      <Reveal delay={60} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Offers", value: totals.active, icon: LocalOffer },
          { label: "Total Redemptions", value: totals.redemptions, icon: Redeem },
          { label: "Avg. Discount", value: `${totals.avgDiscount}%`, icon: Percent },
          { label: "Offers on File", value: totals.total, icon: Bolt },
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
            placeholder="Search by name, code, or service"
            className="text-sm w-full outline-none bg-transparent"
            style={{ color: INK }}
          />
        </div>
        <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      </Reveal>

      {/* Offer cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((o, i) => {
          const s = statusStyle[o.status];
          const enabled = toggles[o.id];
          return (
            <Reveal key={o.id} delay={140 + i * 60}>
              <div
                className="rounded-2xl border border-[#12181F]/[0.06] p-6"
                style={{
                  backgroundColor: CARD,
                  opacity: o.status === "expired" ? 0.7 : 1,
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
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
                      style={{ backgroundColor: `${o.color}1F` }}
                    >
                      <LocalOffer sx={{ fontSize: 20, color: o.color }} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
                        {o.name}
                      </h3>
                      <p
                        className="text-xs text-[#6B6355] mt-0.5"
                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                      >
                        {o.code}
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0" style={{ backgroundColor: s.bg, color: s.text }}>
                    <s.icon sx={{ fontSize: 13 }} />
                    {s.label}
                  </span>
                </div>

                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-2xl font-semibold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: o.color }}>
                      {o.type === "percent" ? `${o.value}% off` : `$${o.value} off`}
                    </p>
                    <p className="text-xs text-[#6B6B6B] mt-1 flex items-center gap-1">
                      <ContentCut sx={{ fontSize: 13 }} />
                      {o.service}
                    </p>
                    <p className="text-xs text-[#6B6B6B] mt-0.5 flex items-center gap-1">
                      <Groups sx={{ fontSize: 13 }} />
                      {o.audience}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#6B6B6B] flex items-center gap-1 justify-end">
                      <CalendarMonth sx={{ fontSize: 13 }} />
                      {o.starts} &ndash; {o.ends}
                    </p>
                  </div>
                </div>

                <UsageBar redemptions={o.redemptions} limit={o.limit} color={o.color} />

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-dotted border-[#12181F]/15">
                  <span className="text-xs text-[#6B6B6B]">
                    {enabled ? "Visible to clients" : "Hidden from clients"}
                  </span>
                  <Switch
                    size="small"
                    checked={enabled}
                    disabled={o.status === "expired"}
                    onChange={() => setToggles((prev) => ({ ...prev, [o.id]: !prev[o.id] }))}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: GREEN },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: GREEN },
                    }}
                  />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Reveal delay={0} className="text-center py-16">
          <p className="text-sm text-[#6B6B6B]">No offers match your search.</p>
        </Reveal>
      )}

      <NewOfferDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}