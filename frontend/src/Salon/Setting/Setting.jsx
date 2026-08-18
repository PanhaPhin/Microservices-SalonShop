import React, { useMemo, useState } from "react";
import {
  ShieldCheck,
  Users,
  KeyRound,
  Lock,
  History,
  Globe,
  Coins,
  Clock,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Check,
  Search,
  Eye,
  EyeOff,
} from "lucide-react";

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";
const RED = "#C4695A";
const RED_SOFT = "rgba(196,105,90,0.10)";
const INK = "#12181F";
const MUTED = "#6B6B6B";
const GOLD = "#8B7A3F";
const BORDER = "rgba(18,24,31,0.08)";

/* ---------------- shared bits ---------------- */

function SectionCard({ icon: Icon, title, description, children }) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: BORDER, backgroundColor: "#fff" }}
    >
      <div className="flex items-start gap-3 px-6 py-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: GREEN_SOFT }}
        >
          <Icon size={17} color={GREEN} />
        </div>
        <div>
          <h2 className="font-semibold text-base" style={{ color: INK, fontFamily: "'Fraunces', serif" }}>
            {title}
          </h2>
          {description && (
            <p className="text-sm mt-0.5" style={{ color: MUTED }}>
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div>
        <p className="text-sm font-medium" style={{ color: INK }}>
          {label}
        </p>
        {description && (
          <p className="text-xs mt-0.5" style={{ color: MUTED }}>
            {description}
          </p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className="relative w-11 h-6 rounded-full transition-colors shrink-0"
        style={{ backgroundColor: checked ? GREEN : "rgba(18,24,31,0.15)" }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? "translateX(22px)" : "translateX(2px)" }}
        />
      </button>
    </div>
  );
}

function Select({ value, onChange, options, icon: Icon }) {
  return (
    <div
      className="flex items-center gap-2 rounded-xl border px-3 py-2.5"
      style={{ borderColor: BORDER, backgroundColor: "#fff" }}
    >
      {Icon && <Icon size={16} color={MUTED} />}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm flex-1 outline-none bg-transparent appearance-none"
        style={{ color: INK }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} color={MUTED} />
    </div>
  );
}

function Pill({ children, tone = "muted" }) {
  const tones = {
    muted: { bg: "rgba(18,24,31,0.05)", fg: MUTED },
    green: { bg: GREEN_SOFT, fg: GREEN },
    red: { bg: RED_SOFT, fg: RED },
  };
  const t = tones[tone];
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ backgroundColor: t.bg, color: t.fg }}
    >
      {children}
    </span>
  );
}

/* ---------------- data ---------------- */

const initialRoles = [
  { id: 1, name: "Owner", members: 1, description: "Full access to every module and setting" },
  { id: 2, name: "Manager", members: 2, description: "Runs day-to-day operations, limited system access" },
  { id: 3, name: "Front Desk", members: 4, description: "Bookings, checkout, and customer records" },
  { id: 4, name: "Stylist", members: 6, description: "Own schedule and assigned clients only" },
];

const permissionModules = [
  "Transactions",
  "Bookings",
  "Customers",
  "Staff",
  "Reports",
  "Settings",
];

function defaultPermissionMatrix() {
  // role name -> module -> boolean
  return {
    Owner: Object.fromEntries(permissionModules.map((m) => [m, true])),
    Manager: {
      Transactions: true,
      Bookings: true,
      Customers: true,
      Staff: true,
      Reports: true,
      Settings: false,
    },
    "Front Desk": {
      Transactions: true,
      Bookings: true,
      Customers: true,
      Staff: false,
      Reports: false,
      Settings: false,
    },
    Stylist: {
      Transactions: false,
      Bookings: true,
      Customers: false,
      Staff: false,
      Reports: false,
      Settings: false,
    },
  };
}

const auditLog = [
  { id: 1, actor: "Sophea K.", action: "Updated role permissions for Front Desk", time: "Today, 9:42 AM", tone: "green" },
  { id: 2, actor: "Dara M.", action: "Signed in from a new device", time: "Today, 8:15 AM", tone: "muted" },
  { id: 3, actor: "System", action: "Failed login attempt (3x) for lina.t@nika.studio", time: "Yesterday, 11:58 PM", tone: "red" },
  { id: 4, actor: "Chan P.", action: "Changed password", time: "Yesterday, 4:20 PM", tone: "muted" },
  { id: 5, actor: "Marcus V.", action: "Exported transactions report", time: "Jun 21, 2026", tone: "muted" },
  { id: 6, actor: "System", action: "Two-factor authentication enabled account-wide", time: "Jun 19, 2026", tone: "green" },
];

/* ---------------- main component ---------------- */

export default function Setting() {
  // roles
  const [roles, setRoles] = useState(initialRoles);
  const [newRoleName, setNewRoleName] = useState("");

  // permissions
  const [matrix, setMatrix] = useState(defaultPermissionMatrix());

  // password & security
  const [require2FA, setRequire2FA] = useState(true);
  const [minLength, setMinLength] = useState(true);
  const [requireSymbol, setRequireSymbol] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // audit log
  const [auditQuery, setAuditQuery] = useState("");

  // regional
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("Asia/Phnom_Penh");

  const filteredAudit = useMemo(() => {
    const q = auditQuery.trim().toLowerCase();
    if (!q) return auditLog;
    return auditLog.filter(
      (a) => a.actor.toLowerCase().includes(q) || a.action.toLowerCase().includes(q)
    );
  }, [auditQuery]);

  const togglePermission = (role, mod) => {
    setMatrix((prev) => ({
      ...prev,
      [role]: { ...prev[role], [mod]: !prev[role][mod] },
    }));
  };

  const addRole = () => {
    const name = newRoleName.trim();
    if (!name) return;
    const id = Math.max(0, ...roles.map((r) => r.id)) + 1;
    setRoles((prev) => [...prev, { id, name, members: 0, description: "No description yet" }]);
    setMatrix((prev) => ({
      ...prev,
      [name]: Object.fromEntries(permissionModules.map((m) => [m, false])),
    }));
    setNewRoleName("");
  };

  const removeRole = (id, name) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
    setMatrix((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  return (
    <div
      className="min-h-screen w-full px-6 py-8 md:px-10 lg:px-14"
      style={{ backgroundColor: "#F9FAFB", fontFamily: "'Manrope', 'Inter', sans-serif" }}
    >
      {/* header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: GOLD }}>
          The Nika Studio
        </p>
        <h1
          className="font-semibold text-2xl md:text-3xl"
          style={{ fontFamily: "'Fraunces', serif", color: INK }}
        >
          System &amp; Security Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: MUTED }}>
          Manage who has access, how accounts are secured, and regional preferences.
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-4xl">
        {/* User roles */}
        <SectionCard icon={Users} title="User Roles" description="Groups of staff with shared access levels">
          <div className="flex flex-col divide-y" style={{ borderColor: BORDER }}>
            {roles.map((role) => (
              <div key={role.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ backgroundColor: GREEN_SOFT, color: GREEN }}
                  >
                    {role.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: INK }}>
                      {role.name}
                    </p>
                    <p className="text-xs" style={{ color: MUTED }}>
                      {role.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Pill>{role.members} member{role.members === 1 ? "" : "s"}</Pill>
                  <button className="p-1.5 rounded-lg hover:bg-black/5" title="Edit role">
                    <Pencil size={14} color={MUTED} />
                  </button>
                  <button
                    className="p-1.5 rounded-lg hover:bg-black/5"
                    title="Remove role"
                    onClick={() => removeRole(role.id, role.name)}
                  >
                    <Trash2 size={14} color={RED} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
            <input
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="New role name…"
              className="text-sm flex-1 rounded-xl border px-3 py-2 outline-none"
              style={{ borderColor: BORDER, color: INK }}
            />
            <button
              onClick={addRole}
              className="flex items-center gap-1.5 text-sm font-medium rounded-xl px-3 py-2 text-white"
              style={{ backgroundColor: GREEN }}
            >
              <Plus size={15} />
              Add role
            </button>
          </div>
        </SectionCard>

        {/* Permissions */}
        <SectionCard
          icon={ShieldCheck}
          title="Permissions"
          description="Choose which modules each role can access"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: 560, borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th className="text-left py-2 pr-4 font-medium" style={{ color: MUTED }}>
                    Module
                  </th>
                  {roles.map((role) => (
                    <th key={role.id} className="text-center py-2 px-3 font-medium" style={{ color: MUTED }}>
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionModules.map((mod) => (
                  <tr key={mod} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td className="py-2.5 pr-4 font-medium" style={{ color: INK }}>
                      {mod}
                    </td>
                    {roles.map((role) => {
                      const checked = matrix[role.name]?.[mod] ?? false;
                      return (
                        <td key={role.id} className="text-center py-2.5 px-3">
                          <button
                            onClick={() => togglePermission(role.name, mod)}
                            className="w-6 h-6 rounded-md border inline-flex items-center justify-center transition-colors"
                            style={{
                              borderColor: checked ? GREEN : BORDER,
                              backgroundColor: checked ? GREEN : "transparent",
                            }}
                          >
                            {checked && <Check size={14} color="#fff" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Password & security */}
        <SectionCard
          icon={Lock}
          title="Password &amp; Security"
          description="Account protection rules for everyone at your studio"
        >
          <div className="grid sm:grid-cols-2 gap-4 mb-2">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>
                Current password
              </label>
              <div
                className="flex items-center gap-2 rounded-xl border px-3 py-2.5"
                style={{ borderColor: BORDER }}
              >
                <KeyRound size={15} color={MUTED} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="text-sm flex-1 outline-none bg-transparent"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>
                New password
              </label>
              <div
                className="flex items-center gap-2 rounded-xl border px-3 py-2.5"
                style={{ borderColor: BORDER }}
              >
                <KeyRound size={15} color={MUTED} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="text-sm flex-1 outline-none bg-transparent"
                />
                <button onClick={() => setShowPassword((s) => !s)} className="shrink-0">
                  {showPassword ? <EyeOff size={15} color={MUTED} /> : <Eye size={15} color={MUTED} />}
                </button>
              </div>
            </div>
          </div>

          <button
            className="text-sm font-medium rounded-xl px-4 py-2 text-white mb-2"
            style={{ backgroundColor: GREEN }}
          >
            Update password
          </button>

          <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${BORDER}` }}>
            <Toggle
              checked={require2FA}
              onChange={setRequire2FA}
              label="Require two-factor authentication"
              description="All staff must verify sign-in with a second device"
            />
            <Toggle
              checked={minLength}
              onChange={setMinLength}
              label="Minimum 10-character passwords"
            />
            <Toggle
              checked={requireSymbol}
              onChange={setRequireSymbol}
              label="Require a number and symbol"
            />

            <div className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-sm font-medium" style={{ color: INK }}>
                  Auto sign-out after inactivity
                </p>
                <p className="text-xs mt-0.5" style={{ color: MUTED }}>
                  Protects unattended devices at the front desk
                </p>
              </div>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="text-sm rounded-lg border px-2.5 py-1.5 outline-none"
                style={{ borderColor: BORDER, color: INK }}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>
        </SectionCard>

        {/* Audit logs */}
        <SectionCard
          icon={History}
          title="Audit Logs"
          description="A record of security-relevant activity on this account"
        >
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2 border mb-4"
            style={{ borderColor: BORDER }}
          >
            <Search size={15} color={MUTED} />
            <input
              value={auditQuery}
              onChange={(e) => setAuditQuery(e.target.value)}
              placeholder="Search by person or action…"
              className="text-sm flex-1 outline-none bg-transparent"
            />
          </div>

          <div className="flex flex-col divide-y" style={{ borderColor: BORDER }}>
            {filteredAudit.length === 0 ? (
              <p className="text-sm py-6 text-center" style={{ color: MUTED }}>
                No matching activity
              </p>
            ) : (
              filteredAudit.map((entry) => (
                <div key={entry.id} className="flex items-start justify-between py-3 first:pt-0 last:pb-0 gap-3">
                  <div>
                    <p className="text-sm" style={{ color: INK }}>
                      <span className="font-medium">{entry.actor}</span>{" "}
                      <span style={{ color: MUTED }}>{entry.action}</span>
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: MUTED }}>
                      {entry.time}
                    </p>
                  </div>
                  {entry.tone === "red" && <Pill tone="red">Attention</Pill>}
                  {entry.tone === "green" && <Pill tone="green">Security</Pill>}
                </div>
              ))
            )}
          </div>
        </SectionCard>

        {/* Regional preferences */}
        <SectionCard
          icon={Globe}
          title="Regional Preferences"
          description="Language, currency, and timezone used across the studio"
        >
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>
                Language
              </label>
              <Select
                icon={Globe}
                value={language}
                onChange={setLanguage}
                options={[
                  { value: "en", label: "English" },
                  { value: "km", label: "ភាសាខ្មែរ (Khmer)" },
                  { value: "fr", label: "Français" },
                  { value: "zh", label: "中文" },
                ]}
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>
                Currency
              </label>
              <Select
                icon={Coins}
                value={currency}
                onChange={setCurrency}
                options={[
                  { value: "USD", label: "USD — US Dollar" },
                  { value: "KHR", label: "KHR — Cambodian Riel" },
                  { value: "EUR", label: "EUR — Euro" },
                  { value: "THB", label: "THB — Thai Baht" },
                ]}
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: MUTED }}>
                Timezone
              </label>
              <Select
                icon={Clock}
                value={timezone}
                onChange={setTimezone}
                options={[
                  { value: "Asia/Phnom_Penh", label: "Phnom Penh (GMT+7)" },
                  { value: "Asia/Bangkok", label: "Bangkok (GMT+7)" },
                  { value: "Asia/Singapore", label: "Singapore (GMT+8)" },
                  { value: "UTC", label: "UTC" },
                ]}
              />
            </div>
          </div>
        </SectionCard>

        {/* save bar */}
        <div className="flex justify-end gap-3 pb-4">
          <button
            className="text-sm font-medium rounded-xl px-4 py-2 border"
            style={{ borderColor: BORDER, color: INK }}
          >
            Discard changes
          </button>
          <button
            className="text-sm font-medium rounded-xl px-5 py-2 text-white"
            style={{ backgroundColor: GREEN }}
          >
            Save settings
          </button>
        </div>
      </div>
    </div>
  );
}