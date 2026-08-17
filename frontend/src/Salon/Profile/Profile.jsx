import React, { useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputBase,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";

import {
  Search,
  Close,
  Storefront,
  Person,
  Language,
  PhoneIphone,
  Block,
  CheckCircle,
  Groups,
  Verified,
  Visibility,
} from "@mui/icons-material";

import ViewAccount from "./ViewAccount";

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";

const RED = "#C4695A";
const RED_SOFT = "rgba(196,105,90,0.10)";

const initialAccounts = [
  {
    name: "Nika Chan",
    email: "nika@nikasalon.com",
    role: "salon_owner",
    platform: "web",
    joined: "Jan 12, 2024",
    status: "active",
  },
  {
    name: "Sophea Khun",
    email: "sophea.k@gmail.com",
    role: "user",
    platform: "app",
    joined: "Mar 3, 2025",
    status: "active",
  },
  {
    name: "Dara Meas",
    email: "dara.meas@gmail.com",
    role: "user",
    platform: "app",
    joined: "Apr 18, 2025",
    status: "active",
  },
  {
    name: "Golden Scissors Salon",
    email: "contact@goldenscissors.com",
    role: "salon_owner",
    platform: "web",
    joined: "Jun 9, 2025",
    status: "blocked",
  },
  {
    name: "Lina Try",
    email: "lina.try@gmail.com",
    role: "user",
    platform: "web",
    joined: "Jul 22, 2025",
    status: "active",
  },
  {
    name: "Marcus Vann",
    email: "marcus.v@gmail.com",
    role: "user",
    platform: "app",
    joined: "Aug 2, 2025",
    status: "blocked",
  },
  {
    name: "Chan Pisey",
    email: "pisey.chan@gmail.com",
    role: "salon_owner",
    platform: "app",
    joined: "Aug 14, 2025",
    status: "active",
  },
];

const roleMeta = {
  salon_owner: {
    label: "Salon Owner",
    icon: Storefront,
    color: GREEN,
    soft: GREEN_SOFT,
  },

  user: {
    label: "User",
    icon: Person,
    color: "#5B6472",
    soft: "rgba(91,100,114,0.10)",
  },
};

const platformMeta = {
  web: {
    label: "Web",
    icon: Language,
  },

  app: {
    label: "App",
    icon: PhoneIphone,
  },
};

const avatarPalette = [
  "#7C9885",
  "#C9A227",
  "#E8927C",
  "#8B93A0",
  "#15803d",
];

const avatarColor = (name) =>
  avatarPalette[name.charCodeAt(0) % avatarPalette.length];

const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: GREEN,
    color: "#fff",
    fontWeight: 600,
    fontSize: 12,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    border: 0,
    padding: "14px 16px",
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "12px 16px",
    borderBottom: "1px solid rgba(18,24,31,0.06)",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  transition: "background-color 0.15s ease",

  "&:hover": {
    backgroundColor: "rgba(21,128,61,0.04)",
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const FILTERS = [
  {
    key: "all",
    label: "All",
  },
  {
    key: "salon_owner",
    label: "Salon Owners",
  },
  {
    key: "user",
    label: "Users",
  },
  {
    key: "blocked",
    label: "Blocked",
  },
];

export default function Profile() {
  const [query, setQuery] = useState("");

  const [filter, setFilter] = useState("all");

  const [accounts, setAccounts] = useState(initialAccounts);

  // Selected account for ViewAccount dialog
  const [selectedAccount, setSelectedAccount] = useState(null);

  // ViewAccount dialog state
  const [viewOpen, setViewOpen] = useState(false);

  /*
   * Account statistics
   */
  const counts = useMemo(
    () => ({
      total: accounts.length,

      owners: accounts.filter((a) => a.role === "salon_owner").length,

      users: accounts.filter((a) => a.role === "user").length,

      blocked: accounts.filter((a) => a.status === "blocked").length,
    }),
    [accounts]
  );

  /*
   * Filter + Search
   */
  const filtered = useMemo(() => {
    let list = accounts;

    if (filter === "salon_owner") {
      list = list.filter((a) => a.role === "salon_owner");
    } else if (filter === "user") {
      list = list.filter((a) => a.role === "user");
    } else if (filter === "blocked") {
      list = list.filter((a) => a.status === "blocked");
    }

    const q = query.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q)
      );
    }

    return list;
  }, [accounts, filter, query]);

  /*
   * Toggle Account Status
   */
  const toggleStatus = (email) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.email === email
          ? {
              ...a,
              status: a.status === "active" ? "blocked" : "active",
            }
          : a
      )
    );

    // Update currently opened account
    setSelectedAccount((prev) => {
      if (!prev || prev.email !== email) {
        return prev;
      }

      return {
        ...prev,
        status: prev.status === "active" ? "blocked" : "active",
      };
    });
  };

  /*
   * Open View Account
   */
  const handleViewAccount = (account) => {
    setSelectedAccount(account);
    setViewOpen(true);
  };

  /*
   * Close View Account
   */
  const handleCloseView = () => {
    setViewOpen(false);
    setSelectedAccount(null);
  };

  return (
    <div
      className="min-h-screen w-full px-6 py-8 md:px-10 lg:px-14"
      style={{
        backgroundColor: "#F9FAFB",
        fontFamily: "'Manrope', 'Inter', sans-serif",
      }}
    >
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="mb-6">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-2"
          style={{
            color: "#8B7A3F",
          }}
        >
          Platform Administration
        </p>

        <h1
          className="font-semibold text-2xl md:text-3xl"
          style={{
            fontFamily: "'Fraunces', serif",
            color: "#12181F",
          }}
        >
          Accounts
        </h1>

        <p
          className="text-sm mt-1"
          style={{
            color: "#8B93A0",
          }}
        >
          All salon owners and users registered via web or app.
        </p>
      </div>

      {/* =========================================================
          STAT CARDS
      ========================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Accounts",
            value: counts.total,
            icon: Groups,
            accent: GREEN,
            soft: GREEN_SOFT,
          },

          {
            label: "Salon Owners",
            value: counts.owners,
            icon: Storefront,
            accent: GREEN,
            soft: GREEN_SOFT,
          },

          {
            label: "Users",
            value: counts.users,
            icon: Person,
            accent: "#5B6472",
            soft: "rgba(91,100,114,0.10)",
          },

          {
            label: "Blocked",
            value: counts.blocked,
            icon: Block,
            accent: RED,
            soft: RED_SOFT,
          },
        ].map(({ label, value, icon: Icon, accent, soft }) => (
          <div
            key={label}
            className="rounded-2xl p-5 border"
            style={{
              backgroundColor: "#fff",
              borderColor: "rgba(18,24,31,0.06)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: soft,
                }}
              >
                <Icon
                  sx={{
                    fontSize: 18,
                    color: accent,
                  }}
                />
              </div>
            </div>

            <p
              className="text-2xl font-semibold"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: "#12181F",
              }}
            >
              {value}
            </p>

            <p
              className="text-xs mt-1"
              style={{
                color: "#8B93A0",
              }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* =========================================================
          FILTER + SEARCH
      ========================================================= */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map((f) => {
            const active = filter === f.key;

            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors"
                style={{
                  backgroundColor: active ? GREEN : "#fff",
                  color: active ? "#fff" : "#6B6B6B",
                  border: `1px solid ${
                    active ? GREEN : "rgba(18,24,31,0.10)"
                  }`,
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 border w-full md:w-72"
          style={{
            backgroundColor: "#fff",
            borderColor: "rgba(18,24,31,0.08)",
          }}
        >
          <Search
            sx={{
              fontSize: 18,
              color: "#8B93A0",
            }}
          />

          <InputBase
            placeholder="Search by name or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              fontSize: 14,
              flex: 1,
            }}
          />

          {query && (
            <IconButton
              size="small"
              onClick={() => setQuery("")}
            >
              <Close
                sx={{
                  fontSize: 14,
                }}
              />
            </IconButton>
          )}
        </div>
      </div>

      {/* =========================================================
          ACCOUNT TABLE
      ========================================================= */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid rgba(18,24,31,0.06)",
          overflow: "hidden",
        }}
      >
        <Table
          sx={{
            minWidth: 900,
          }}
          aria-label="accounts table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>
                Account
              </StyledTableCell>

              <StyledTableCell>
                Role
              </StyledTableCell>

              <StyledTableCell>
                Registered via
              </StyledTableCell>

              <StyledTableCell>
                Joined
              </StyledTableCell>

              <StyledTableCell align="center">
                Status
              </StyledTableCell>

              <StyledTableCell align="center">
                Action
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <StyledTableCell
                  colSpan={6}
                  align="center"
                  sx={{
                    py: 6,
                    color: "#8B93A0",
                  }}
                >
                  No accounts match your filters
                </StyledTableCell>
              </TableRow>
            ) : (
              filtered.map((a) => {
                const role = roleMeta[a.role];

                const RoleIcon = role.icon;

                const platform = platformMeta[a.platform];

                const PlatformIcon = platform.icon;

                const blocked = a.status === "blocked";

                return (
                  <StyledTableRow key={a.email}>
                    {/* =================================================
                        ACCOUNT
                    ================================================= */}
                    <StyledTableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            fontSize: 12,
                            fontWeight: 600,
                            bgcolor: avatarColor(a.name),
                          }}
                        >
                          {initials(a.name)}
                        </Avatar>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p
                              className="font-medium truncate"
                              style={{
                                color: "#12181F",
                              }}
                            >
                              {a.name}
                            </p>

                            {a.role === "salon_owner" && (
                              <Verified
                                sx={{
                                  fontSize: 14,
                                  color: GREEN,
                                }}
                              />
                            )}
                          </div>

                          <p
                            className="text-xs truncate"
                            style={{
                              color: "#8B93A0",
                            }}
                          >
                            {a.email}
                          </p>
                        </div>
                      </div>
                    </StyledTableCell>

                    {/* =================================================
                        ROLE
                    ================================================= */}
                    <StyledTableCell>
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: role.soft,
                          color: role.color,
                        }}
                      >
                        <RoleIcon
                          sx={{
                            fontSize: 13,
                          }}
                        />

                        {role.label}
                      </span>
                    </StyledTableCell>

                    {/* =================================================
                        PLATFORM
                    ================================================= */}
                    <StyledTableCell>
                      <div
                        className="flex items-center gap-1.5"
                        style={{
                          color: "#6B6B6B",
                        }}
                      >
                        <PlatformIcon
                          sx={{
                            fontSize: 15,
                          }}
                        />

                        <span className="text-sm">
                          {platform.label}
                        </span>
                      </div>
                    </StyledTableCell>

                    {/* =================================================
                        JOINED
                    ================================================= */}
                    <StyledTableCell>
                      <span
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 13,
                          color: "#6B6B6B",
                        }}
                      >
                        {a.joined}
                      </span>
                    </StyledTableCell>

                    {/* =================================================
                        STATUS
                    ================================================= */}
                    <StyledTableCell align="center">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: blocked
                            ? RED_SOFT
                            : GREEN_SOFT,
                          color: blocked ? RED : GREEN,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: blocked
                              ? RED
                              : GREEN,
                          }}
                        />

                        {blocked ? "Blocked" : "Active"}
                      </span>
                    </StyledTableCell>

                    {/* =================================================
                        ACTIONS
                    ================================================= */}
                    <StyledTableCell align="center">
                      <div className="flex items-center justify-center gap-2">

                        {/* VIEW BUTTON */}
                        <Tooltip title="View account">
                          <button
                            onClick={() =>
                              handleViewAccount(a)
                            }
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                            style={{
                              color: GREEN,
                              backgroundColor: GREEN_SOFT,
                              transition:
                                "background-color 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "rgba(21,128,61,0.18)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                GREEN_SOFT;
                            }}
                          >
                            <Visibility
                              sx={{
                                fontSize: 14,
                              }}
                            />

                            View
                          </button>
                        </Tooltip>

                        {/* BLOCK / UNBLOCK BUTTON */}
                        <Tooltip
                          title={
                            blocked
                              ? "Unblock account"
                              : "Block account"
                          }
                        >
                          <button
                            onClick={() =>
                              toggleStatus(a.email)
                            }
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                            style={{
                              color: blocked
                                ? GREEN
                                : RED,
                              backgroundColor: blocked
                                ? GREEN_SOFT
                                : RED_SOFT,
                              transition:
                                "background-color 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                blocked
                                  ? "rgba(21,128,61,0.18)"
                                  : "rgba(196,105,90,0.18)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                blocked
                                  ? GREEN_SOFT
                                  : RED_SOFT;
                            }}
                          >
                            {blocked ? (
                              <>
                                <CheckCircle
                                  sx={{
                                    fontSize: 14,
                                  }}
                                />

                                Unblock
                              </>
                            ) : (
                              <>
                                <Block
                                  sx={{
                                    fontSize: 14,
                                  }}
                                />

                                Block
                              </>
                            )}
                          </button>
                        </Tooltip>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* =========================================================
          VIEW ACCOUNT DIALOG
      ========================================================= */}
      <ViewAccount
        open={viewOpen}
        account={selectedAccount}
        onClose={handleCloseView}
        onToggleStatus={toggleStatus}
      />
    </div>
  );
}