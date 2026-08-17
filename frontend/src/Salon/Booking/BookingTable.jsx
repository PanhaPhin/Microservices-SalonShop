import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
  InputBase,
  IconButton,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Search,
  ContentCut,
  MoreHoriz,
  CalendarMonth,
  Close,
} from "@mui/icons-material";

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";

const rows = [
  {
    service: "Hair Cut",
    datetime: "25 Jun 2026, 10:00 AM",
    price: "$10",
    customer: { name: "Code With Panha", email: "panhaphin17@gmail.com" },
    status: "Pending",
  },
  {
    service: "Hair Coloring",
    datetime: "25 Jun 2026, 11:30 AM",
    price: "$25",
    customer: { name: "Sok Dara", email: "dara@gmail.com" },
    status: "Confirmed",
  },
  {
    service: "Facial",
    datetime: "25 Jun 2026, 1:00 PM",
    price: "$15",
    customer: { name: "Chanthy", email: "chanthy@gmail.com" },
    status: "Completed",
  },
];

const statusStyle = {
  Pending: { bg: "#FEF3C7", fg: "#92620A", dot: "#D97706" },
  Confirmed: { bg: "#DBEAFE", fg: "#1D4ED8", dot: "#2563EB" },
  Completed: { bg: "#DCFCE7", fg: "#15803D", dot: "#16A34A" },
};

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
    padding: "14px 16px",
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

const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const avatarPalette = ["#7C9885", "#C9A227", "#E8927C", "#8B93A0", "#15803d"];
const avatarColor = (name) =>
  avatarPalette[name.charCodeAt(0) % avatarPalette.length];

export default function BookingTable() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.service.toLowerCase().includes(q) ||
        r.customer.name.toLowerCase().includes(q) ||
        r.customer.email.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div
      className="min-h-screen w-full px-6 py-8 md:px-10 lg:px-14"
      style={{ backgroundColor: "#F9FAFB", fontFamily: "'Manrope', 'Inter', sans-serif" }}
    >
      {/* header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: "#8B7A3F" }}>
            The Nika Studio
          </p>
          <div className="flex items-center gap-3">
            <h1
              className="font-semibold text-2xl md:text-3xl"
              style={{ fontFamily: "'Fraunces', serif", color: "#12181F" }}
            >
              Bookings
            </h1>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: GREEN_SOFT, color: GREEN }}
            >
              {filtered.length} total
            </span>
          </div>
        </div>

        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 border w-full md:w-72"
          style={{ backgroundColor: "#fff", borderColor: "rgba(18,24,31,0.08)" }}
        >
          <Search sx={{ fontSize: 18, color: "#8B93A0" }} />
          <InputBase
            placeholder="Search bookings…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ fontSize: 14, flex: 1 }}
          />
          {query && (
            <IconButton size="small" onClick={() => setQuery("")}>
              <Close sx={{ fontSize: 14 }} />
            </IconButton>
          )}
        </div>
      </div>

      {/* table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid rgba(18,24,31,0.06)",
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 760 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Service</StyledTableCell>
              <StyledTableCell align="right">Date &amp; Time</StyledTableCell>
              <StyledTableCell align="right">Price</StyledTableCell>
              <StyledTableCell align="right">Customer</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <StyledTableCell colSpan={6} align="center" sx={{ py: 6, color: "#8B93A0" }}>
                  No bookings match "{query}"
                </StyledTableCell>
              </TableRow>
            ) : (
              filtered.map((row, index) => {
                const s = statusStyle[row.status];
                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell>
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: GREEN_SOFT }}
                        >
                          <ContentCut sx={{ fontSize: 15, color: GREEN }} />
                        </div>
                        <span className="font-medium" style={{ color: "#12181F" }}>
                          {row.service}
                        </span>
                      </div>
                    </StyledTableCell>

                    <StyledTableCell align="right">
                      <div className="flex items-center justify-end gap-1.5" style={{ color: "#6B6B6B" }}>
                        <CalendarMonth sx={{ fontSize: 14 }} />
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>
                          {row.datetime}
                        </span>
                      </div>
                    </StyledTableCell>

                    <StyledTableCell align="right">
                      <span
                        className="font-semibold"
                        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#12181F" }}
                      >
                        {row.price}
                      </span>
                    </StyledTableCell>

                    <StyledTableCell align="right">
                      <div className="flex items-center justify-end gap-2.5">
                        <div className="text-right">
                          <p className="font-medium" style={{ color: "#12181F" }}>
                            {row.customer.name}
                          </p>
                          <p className="text-xs" style={{ color: "#8B93A0" }}>
                            {row.customer.email}
                          </p>
                        </div>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: 12,
                            fontWeight: 600,
                            bgcolor: avatarColor(row.customer.name),
                          }}
                        >
                          {initials(row.customer.name)}
                        </Avatar>
                      </div>
                    </StyledTableCell>

                    <StyledTableCell align="right">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: s.bg, color: s.fg }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: s.dot }}
                        />
                        {row.status}
                      </span>
                    </StyledTableCell>

                    <StyledTableCell align="right">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip title="Cancel booking">
                          <button
                            className="text-xs font-medium px-3 py-1.5 rounded-lg"
                            style={{
                              color: "#C4695A",
                              backgroundColor: "rgba(196,105,90,0.08)",
                              transition: "background-color 0.15s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(196,105,90,0.16)")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(196,105,90,0.08)")}
                          >
                            Cancel
                          </button>
                        </Tooltip>
                        <IconButton size="small">
                          <MoreHoriz sx={{ fontSize: 18, color: "#8B93A0" }} />
                        </IconButton>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}