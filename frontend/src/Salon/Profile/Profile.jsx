import React, { useEffect, useMemo, useState } from "react";
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
  CircularProgress,
} from "@mui/material";

import {
  Search,
  Close,
  Storefront,
  Person,
  AdminPanelSettings,
  Language,
  Apple,
  Android,
  Block,
  CheckCircle,
  Groups,
  Verified,
  Visibility,
  WarningAmber,
  Refresh,
} from "@mui/icons-material";

import ViewAccount from "./ViewAccount";
import api from "../../config/api";

/* =========================================================
   COLORS
========================================================= */

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";

const RED = "#C4695A";
const RED_SOFT = "rgba(196,105,90,0.10)";

const GRAY = "#5B6472";
const GRAY_SOFT = "rgba(91,100,114,0.10)";

const BLUE = "#2563EB";
const BLUE_SOFT = "rgba(37,99,235,0.10)";

/* =========================================================
   ROLE
========================================================= */

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
    color: GRAY,
    soft: GRAY_SOFT,
  },

  admin: {
    label: "Admin",
    icon: AdminPanelSettings,
    color: BLUE,
    soft: BLUE_SOFT,
  },
};

/* =========================================================
   PLATFORM
========================================================= */

const platformMeta = {
  web: {
    label: "Web",
    icon: Language,
  },

  ios: {
    label: "iOS",
    icon: Apple,
  },

  android: {
    label: "Android",
    icon: Android,
  },
};

/* =========================================================
   AVATAR
========================================================= */

const avatarPalette = [
  "#7C9885",
  "#C9A227",
  "#E8927C",
  "#8B93A0",
  "#15803d",
];

const avatarColor = (name = "?") => {
  const firstChar = name.charCodeAt(0);

  return avatarPalette[
    firstChar % avatarPalette.length
  ];
};

const initials = (name = "?") =>
  name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/* =========================================================
   DATE
========================================================= */

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) {
    return "Never";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* =========================================================
   NORMALIZE ROLE
   Backend:
   SALON_OWNER
   CUSTOMER
   ADMIN

   Frontend:
   salon_owner
   user
   admin
========================================================= */

const normalizeRole = (role) => {
  const value = String(role || "")
    .trim()
    .toUpperCase();

  switch (value) {
    case "SALON_OWNER":
    case "ROLE_SALON_OWNER":
      return "salon_owner";

    case "CUSTOMER":
    case "USER":
    case "ROLE_CUSTOMER":
    case "ROLE_USER":
      return "user";

    case "ADMIN":
    case "ROLE_ADMIN":
      return "admin";

    default:
      return "user";
  }
};

/* =========================================================
   NORMALIZE PLATFORM
========================================================= */

const normalizePlatform = (platform) => {
  if (!platform) {
    return null;
  }

  const value = String(platform)
    .trim()
    .toLowerCase();

  if (platformMeta[value]) {
    return value;
  }

  return null;
};

/* =========================================================
   NORMALIZE BACKEND USER
========================================================= */

function normalizeAccount(raw = {}) {
  return {
    id: raw.id,

    name:
      raw.fullName?.trim() ||
      raw.username?.trim() ||
      "Unnamed",

    username: raw.username || "—",

    email: raw.email || "—",

    phone: raw.phone || "—",

    role: normalizeRole(raw.role),

    platform: normalizePlatform(
      raw.lastActivePlatform
    ),

    lastActiveAt: raw.lastActiveAt || null,

    lastActiveAtFormatted: formatDateTime(
      raw.lastActiveAt
    ),

    joined: formatDate(raw.createdAt),

    createdAt: raw.createdAt || null,

    updatedAt: raw.updatedAt || null,

    keycloakId: raw.keycloakId || null,

    blocked: Boolean(raw.blocked),
  };
}

/* =========================================================
   TABLE CELL
========================================================= */

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
    whiteSpace: "nowrap",
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "12px 16px",
    borderBottom:
      "1px solid rgba(18,24,31,0.06)",
  },
}));

/* =========================================================
   TABLE ROW
========================================================= */

const StyledTableRow = styled(TableRow)(() => ({
  transition: "background-color 0.15s ease",

  "&:hover": {
    backgroundColor:
      "rgba(21,128,61,0.04)",
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

/* =========================================================
   FILTERS
========================================================= */

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
    key: "admin",
    label: "Admins",
  },
  {
    key: "blocked",
    label: "Blocked",
  },
];

/* =========================================================
   PROFILE
========================================================= */

export default function Profile() {
  const [query, setQuery] = useState("");

  const [filter, setFilter] =
    useState("all");

  const [accounts, setAccounts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [selectedAccount, setSelectedAccount] =
    useState(null);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState(null);

  /* =========================================================
     LOAD ACCOUNTS
  ========================================================= */

  const loadAccounts = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(
        "GET:",
        `${api.defaults.baseURL}/api/users`
      );

      const response =
        await api.get("/api/users");

      console.log(
        "Spring Boot response:",
        response.data
      );

      const data = Array.isArray(
        response.data
      )
        ? response.data
        : response.data?.content ||
        response.data?.data ||
        [];

      const normalizedAccounts =
        data.map(normalizeAccount);

      setAccounts(normalizedAccounts);
    } catch (err) {
      console.error(
        "Load accounts error:",
        err
      );

      if (err.response?.status === 401) {
        setError(
          "Unauthorized. Your login session may have expired. Please login again."
        );
      } else if (
        err.response?.status === 403
      ) {
        setError(
          "Access denied. Only Salon Owners can view all accounts."
        );
      } else {
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Something went wrong loading accounts.";

        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const counts = useMemo(
    () => ({
      total: accounts.length,

      owners: accounts.filter(
        (account) =>
          account.role === "salon_owner"
      ).length,

      users: accounts.filter(
        (account) =>
          account.role === "user"
      ).length,

      admins: accounts.filter(
        (account) =>
          account.role === "admin"
      ).length,

      blocked: accounts.filter(
        (account) =>
          account.blocked
      ).length,
    }),
    [accounts]
  );

  const filtered = useMemo(() => {
    let list = [...accounts];

    /* ROLE FILTER */

    if (filter === "salon_owner") {
      list = list.filter(
        (account) =>
          account.role === "salon_owner"
      );
    }

    if (filter === "user") {
      list = list.filter(
        (account) =>
          account.role === "user"
      );
    }

    if (filter === "admin") {
      list = list.filter(
        (account) =>
          account.role === "admin"
      );
    }

    if (filter === "blocked") {
      list = list.filter(
        (account) =>
          account.blocked
      );
    }

    /* SEARCH */

    const q = query
      .trim()
      .toLowerCase();

    if (q) {
      list = list.filter(
        (account) => {
          const name =
            String(
              account.name || ""
            ).toLowerCase();

          const username =
            String(
              account.username || ""
            ).toLowerCase();

          const email =
            String(
              account.email || ""
            ).toLowerCase();

          const phone =
            String(
              account.phone || ""
            ).toLowerCase();

          return (
            name.includes(q) ||
            username.includes(q) ||
            email.includes(q) ||
            phone.includes(q)
          );
        }
      );
    }

    return list;
  }, [
    accounts,
    filter,
    query,
  ]);

  const toggleStatus = async (id) => {
    const target =
      accounts.find(
        (account) =>
          account.id === id
      );

    if (!target) {
      return;
    }

    const nextBlocked =
      !target.blocked;

    setUpdatingId(id);

    try {
      console.log(
        "PATCH:",
        `${api.defaults.baseURL}/api/users/${id}/status`
      );

      console.log(
        "Request body:",
        {
          blocked: nextBlocked,
        }
      );

      const response =
        await api.patch(
          `/api/users/${id}/status`,
          {
            blocked: nextBlocked,
          }
        );

      console.log(
        "Spring Boot update response:",
        response.data
      );

      /*
       * Backend returns:
       *
       * ResponseEntity<User>
       *
       * Therefore response.data is
       * the updated User.
       */

      const updatedAccount =
        normalizeAccount(
          response.data
        );

      setAccounts(
        (previous) =>
          previous.map(
            (account) =>
              account.id === id
                ? updatedAccount
                : account
          )
      );

      setSelectedAccount(
        (previous) =>
          previous &&
            previous.id === id
            ? updatedAccount
            : previous
      );
    } catch (err) {
      console.error(
        "Update account status error:",
        err
      );

      if (err.response?.status === 401) {
        alert(
          "Unauthorized. Please login again."
        );
      } else if (
        err.response?.status === 403
      ) {
        alert(
          "Access denied. Only Salon Owners can update account status."
        );
      } else {
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Could not update account status.";

        alert(message);
      }
    } finally {
      setUpdatingId(null);
    }
  };



  const handleViewAccount = (
    account
  ) => {
    setSelectedAccount(account);
    setViewOpen(true);
  };



  const handleCloseView = () => {
    setViewOpen(false);
    setSelectedAccount(null);
  };

  return (
    <div
      className="min-h-screen w-full px-6 py-8 md:px-10 lg:px-14"
      style={{
        backgroundColor: "#F9FAFB",
        fontFamily:
          "'Manrope', 'Inter', sans-serif",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

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
            fontFamily:
              "'Fraunces', serif",
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
          Manage salon owners, users, and
          administrators.
        </p>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6 text-sm"
          style={{
            backgroundColor:
              RED_SOFT,
            color: RED,
          }}
        >
          <WarningAmber
            sx={{
              fontSize: 18,
            }}
          />

          <span className="flex-1">
            {error}
          </span>

          <button
            onClick={loadAccounts}
            className="flex items-center gap-1.5 font-semibold"
          >
            <Refresh
              sx={{
                fontSize: 16,
              }}
            />

            Retry
          </button>
        </div>
      )}

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

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
            accent: GRAY,
            soft: GRAY_SOFT,
          },

          {
            label: "Blocked",
            value: counts.blocked,
            icon: Block,
            accent: RED,
            soft: RED_SOFT,
          },
        ].map(
          ({
            label,
            value,
            icon: Icon,
            accent,
            soft,
          }) => (
            <div
              key={label}
              className="rounded-2xl p-5 border"
              style={{
                backgroundColor:
                  "#fff",
                borderColor:
                  "rgba(18,24,31,0.06)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor:
                      soft,
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
                  fontFamily:
                    "'IBM Plex Mono', monospace",
                  color: "#12181F",
                }}
              >
                {loading
                  ? "—"
                  : value}
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
          )
        )}
      </div>

      {/* =====================================================
          FILTER + SEARCH
      ===================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map(
            (item) => {
              const active =
                filter ===
                item.key;

              return (
                <button
                  key={item.key}
                  onClick={() =>
                    setFilter(
                      item.key
                    )
                  }
                  className="text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors"
                  style={{
                    backgroundColor:
                      active
                        ? GREEN
                        : "#fff",

                    color: active
                      ? "#fff"
                      : "#6B6B6B",

                    border: `1px solid ${active
                        ? GREEN
                        : "rgba(18,24,31,0.10)"
                      }`,
                  }}
                >
                  {item.label}
                </button>
              );
            }
          )}
        </div>

        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 border w-full md:w-80"
          style={{
            backgroundColor:
              "#fff",
            borderColor:
              "rgba(18,24,31,0.08)",
          }}
        >
          <Search
            sx={{
              fontSize: 18,
              color: "#8B93A0",
            }}
          />

          <InputBase
            placeholder="Search name, username, email or phone…"
            value={query}
            onChange={(
              event
            ) =>
              setQuery(
                event.target
                  .value
              )
            }
            sx={{
              fontSize: 14,
              flex: 1,
            }}
          />

          {query && (
            <IconButton
              size="small"
              onClick={() =>
                setQuery("")
              }
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

      {/* =====================================================
          ACCOUNT TABLE
      ===================================================== */}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius:
            "16px",
          border:
            "1px solid rgba(18,24,31,0.06)",
          overflow: "hidden",
        }}
      >
        <Table
          sx={{
            minWidth: 950,
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
                Last Active Via
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
            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (
              <TableRow>
                <StyledTableCell
                  colSpan={6}
                  align="center"
                  sx={{
                    py: 6,
                  }}
                >
                  <CircularProgress
                    size={22}
                    sx={{
                      color: GREEN,
                    }}
                  />
                </StyledTableCell>
              </TableRow>
            ) : filtered.length ===
              0 ? (
              /* ===============================================
                 EMPTY
              =============================================== */

              <TableRow>
                <StyledTableCell
                  colSpan={6}
                  align="center"
                  sx={{
                    py: 6,
                  }}
                >
                  <div className="flex flex-col items-center">
                    <Groups
                      sx={{
                        fontSize: 38,
                        color:
                          "#CBD5E1",
                        mb: 1,
                      }}
                    />

                    <p
                      className="text-sm font-medium"
                      style={{
                        color:
                          "#6B7280",
                      }}
                    >
                      No accounts found
                    </p>

                    <p
                      className="text-xs mt-1"
                      style={{
                        color:
                          "#9CA3AF",
                      }}
                    >
                      Try changing your
                      filter or search.
                    </p>
                  </div>
                </StyledTableCell>
              </TableRow>
            ) : (
              /* ===============================================
                 DATA
              =============================================== */

              filtered.map(
                (account) => {
                  const role =
                    roleMeta[
                    account.role
                    ] ||
                    roleMeta.user;

                  const RoleIcon =
                    role.icon;

                  const platform =
                    account.platform
                      ? platformMeta[
                      account
                        .platform
                      ]
                      : null;

                  const PlatformIcon =
                    platform?.icon;

                  const blocked =
                    account.blocked;

                  const isUpdating =
                    updatingId ===
                    account.id;

                  return (
                    <StyledTableRow
                      key={
                        account.id
                      }
                    >
                      {/* =========================================
                          ACCOUNT
                      ========================================= */}

                      <StyledTableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              fontSize: 12,
                              fontWeight: 600,
                              bgcolor:
                                avatarColor(
                                  account.name
                                ),
                            }}
                          >
                            {initials(
                              account.name
                            )}
                          </Avatar>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p
                                className="font-medium truncate"
                                style={{
                                  color:
                                    "#12181F",
                                }}
                              >
                                {
                                  account.name
                                }
                              </p>

                              {account.role ===
                                "salon_owner" && (
                                  <Tooltip title="Verified Salon Owner">
                                    <Verified
                                      sx={{
                                        fontSize: 15,
                                        color:
                                          GREEN,
                                      }}
                                    />
                                  </Tooltip>
                                )}
                            </div>

                            <p
                              className="text-xs truncate"
                              style={{
                                color:
                                  "#8B93A0",
                              }}
                            >
                              {
                                account.email
                              }
                            </p>

                            {account.username !==
                              "—" && (
                                <p
                                  className="text-[11px] truncate"
                                  style={{
                                    color:
                                      "#A1A8B3",
                                  }}
                                >
                                  @
                                  {
                                    account.username
                                  }
                                </p>
                              )}
                          </div>
                        </div>
                      </StyledTableCell>

                      {/* =========================================
                          ROLE
                      ========================================= */}

                      <StyledTableCell>
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor:
                              role.soft,
                            color:
                              role.color,
                          }}
                        >
                          <RoleIcon
                            sx={{
                              fontSize: 13,
                            }}
                          />

                          {
                            role.label
                          }
                        </span>
                      </StyledTableCell>

                      {/* =========================================
                          PLATFORM
                      ========================================= */}

                      <StyledTableCell>
                        {platform ? (
                          <Tooltip
                            title={
                              account.lastActiveAt
                                ? `Last active: ${formatDateTime(
                                  account.lastActiveAt
                                )}`
                                : "Last active platform"
                            }
                          >
                            <div
                              className="flex items-center gap-1.5 cursor-default"
                              style={{
                                color:
                                  "#6B6B6B",
                              }}
                            >
                              <PlatformIcon
                                sx={{
                                  fontSize: 15,
                                }}
                              />

                              <span className="text-sm">
                                {
                                  platform.label
                                }
                              </span>
                            </div>
                          </Tooltip>
                        ) : (
                          <span
                            className="text-sm"
                            style={{
                              color:
                                "#8B93A0",
                            }}
                          >
                            Never logged in
                          </span>
                        )}
                      </StyledTableCell>

                      {/* =========================================
                          JOINED
                      ========================================= */}

                      <StyledTableCell>
                        <span
                          style={{
                            fontFamily:
                              "'IBM Plex Mono', monospace",
                            fontSize: 13,
                            color:
                              "#6B6B6B",
                          }}
                        >
                          {
                            account.joined
                          }
                        </span>
                      </StyledTableCell>

                      {/* =========================================
                          STATUS
                      ========================================= */}

                      <StyledTableCell align="center">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor:
                              blocked
                                ? RED_SOFT
                                : GREEN_SOFT,

                            color:
                              blocked
                                ? RED
                                : GREEN,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor:
                                blocked
                                  ? RED
                                  : GREEN,
                            }}
                          />

                          {blocked
                            ? "Blocked"
                            : "Active"}
                        </span>
                      </StyledTableCell>

                      {/* =========================================
                          ACTION
                      ========================================= */}

                      <StyledTableCell align="center">
                        <div className="flex items-center justify-center gap-2">
                          {/* VIEW */}

                          <Tooltip title="View account">
                            <button
                              onClick={() =>
                                handleViewAccount(
                                  account
                                )
                              }
                              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                              style={{
                                color:
                                  GREEN,
                                backgroundColor:
                                  GREEN_SOFT,
                                transition:
                                  "background-color 0.15s ease",
                              }}
                              onMouseEnter={(
                                event
                              ) => {
                                event.currentTarget.style.backgroundColor =
                                  "rgba(21,128,61,0.18)";
                              }}
                              onMouseLeave={(
                                event
                              ) => {
                                event.currentTarget.style.backgroundColor =
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

                          {/* BLOCK / UNBLOCK */}

                          <Tooltip
                            title={
                              blocked
                                ? "Unblock account"
                                : "Block account"
                            }
                          >
                            <button
                              onClick={() =>
                                toggleStatus(
                                  account.id
                                )
                              }
                              disabled={
                                isUpdating
                              }
                              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                              style={{
                                color:
                                  blocked
                                    ? GREEN
                                    : RED,

                                backgroundColor:
                                  blocked
                                    ? GREEN_SOFT
                                    : RED_SOFT,

                                opacity:
                                  isUpdating
                                    ? 0.6
                                    : 1,

                                cursor:
                                  isUpdating
                                    ? "not-allowed"
                                    : "pointer",

                                transition:
                                  "background-color 0.15s ease",
                              }}
                            >
                              {isUpdating ? (
                                <CircularProgress
                                  size={12}
                                  sx={{
                                    color:
                                      "inherit",
                                  }}
                                />
                              ) : blocked ? (
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
                }
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* =====================================================
          VIEW ACCOUNT MODAL
      ===================================================== */}

      <ViewAccount
        open={viewOpen}
        account={selectedAccount}
        onClose={
          handleCloseView
        }
        onToggleStatus={
          toggleStatus
        }
      />
    </div>
  );
}