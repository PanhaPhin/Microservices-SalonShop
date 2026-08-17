import React from "react";
import { Dialog, Avatar, IconButton, Tooltip } from "@mui/material";
import {
  Close,
  Storefront,
  Person,
  Language,
  PhoneIphone,
  Block,
  CheckCircle,
  Verified,
  Email,
  CalendarMonth,
  Badge,
} from "@mui/icons-material";

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";
const RED = "#C4695A";
const RED_SOFT = "rgba(196,105,90,0.10)";

const roleMeta = {
  salon_owner: { label: "Salon Owner", icon: Storefront, color: GREEN, soft: GREEN_SOFT },
  user: { label: "User", icon: Person, color: "#5B6472", soft: "rgba(91,100,114,0.10)" },
};

const platformMeta = {
  web: { label: "Web", icon: Language },
  app: { label: "App", icon: PhoneIphone },
};

const avatarPalette = ["#7C9885", "#C9A227", "#E8927C", "#8B93A0", "#15803d"];
const avatarColor = (name) => avatarPalette[name.charCodeAt(0) % avatarPalette.length];
const initials = (name) =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 py-3" style={{ borderBottom: "1px solid rgba(18,24,31,0.06)" }}>
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: "rgba(18,24,31,0.04)" }}
    >
      <Icon sx={{ fontSize: 15, color: "#6B6B6B" }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs" style={{ color: "#8B93A0" }}>
        {label}
      </p>
      <p className="text-sm font-medium truncate" style={{ color: "#12181F" }}>
        {value}
      </p>
    </div>
  </div>
);

export default function ViewAccount({ open, account, onClose, onToggleStatus }) {
  if (!account) return null;

  const role = roleMeta[account.role];
  const RoleIcon = role.icon;
  const platform = platformMeta[account.platform];
  const PlatformIcon = platform.icon;
  const blocked = account.status === "blocked";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: "20px", backgroundColor: "#fff" } }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <span
            className="text-xs uppercase tracking-[0.2em] font-semibold"
            style={{ color: "#8B7A3F" }}
          >
            Account Details
          </span>
          <IconButton size="small" onClick={onClose}>
            <Close sx={{ fontSize: 18 }} />
          </IconButton>
        </div>

        {/* identity */}
        <div className="flex items-center gap-3.5 mb-5">
          <Avatar
            sx={{
              width: 56,
              height: 56,
              fontSize: 18,
              fontWeight: 600,
              bgcolor: avatarColor(account.name),
            }}
          >
            {initials(account.name)}
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2
                className="font-semibold text-lg truncate"
                style={{ fontFamily: "'Fraunces', serif", color: "#12181F" }}
              >
                {account.name}
              </h2>
              {account.role === "salon_owner" && <Verified sx={{ fontSize: 16, color: GREEN }} />}
            </div>
            <p className="text-sm truncate" style={{ color: "#8B93A0" }}>
              {account.email}
            </p>
          </div>
        </div>

        {/* status + role badges */}
        <div className="flex items-center gap-2 mb-5">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: role.soft, color: role.color }}
          >
            <RoleIcon sx={{ fontSize: 13 }} />
            {role.label}
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: blocked ? RED_SOFT : GREEN_SOFT, color: blocked ? RED : GREEN }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: blocked ? RED : GREEN }} />
            {blocked ? "Blocked" : "Active"}
          </span>
        </div>

        {/* info list */}
        <div className="mb-6">
          <InfoRow icon={Email} label="Email address" value={account.email} />
          <InfoRow icon={PlatformIcon} label="Registered via" value={platform.label} />
          <InfoRow icon={CalendarMonth} label="Joined" value={account.joined} />
          <InfoRow icon={Badge} label="Account ID" value={account.email.split("@")[0].toUpperCase()} />
        </div>

        {/* action */}
        <Tooltip title={blocked ? "Unblock this account" : "Block this account"}>
          <button
            onClick={() => onToggleStatus(account.email)}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl transition-colors"
            style={{
              color: blocked ? "#fff" : "#fff",
              backgroundColor: blocked ? GREEN : RED,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = blocked ? "#106b32" : "#b25749")
            }
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = blocked ? GREEN : RED)}
          >
            {blocked ? (
              <>
                <CheckCircle sx={{ fontSize: 16 }} />
                Unblock Account
              </>
            ) : (
              <>
                <Block sx={{ fontSize: 16 }} />
                Block Account
              </>
            )}
          </button>
        </Tooltip>
      </div>
    </Dialog>
  );
}