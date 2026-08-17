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
} from "@mui/material";
import { Search, Close, ContentCut, Palette, Spa, Undo } from "@mui/icons-material";

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";
const RED = "#C4695A";
const RED_SOFT = "rgba(196,105,90,0.10)";

function createData(label, customer, date, amount, positive, icon, method) {
  return { label, customer, date, amount, positive, icon, method };
}

const rows = [
  createData("Classic Haircut", "Sophea K.", "Jun 24, 2026", "+$25.00", true, ContentCut, "Card"),
  createData("Hair Coloring", "Dara M.", "Jun 22, 2026", "+$80.00", true, Palette, "Cash"),
  createData("Refund", "Lina T.", "Jun 20, 2026", "-$10.00", false, Undo, "Card"),
  createData("Facial Treatment", "Chan P.", "Jun 18, 2026", "+$55.00", true, Spa, "Card"),
  createData("Beard Trim", "Marcus V.", "Jun 17, 2026", "+$12.00", true, ContentCut, "Cash"),
];

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

export default function TransactionTable() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.label.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q)
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
              Transactions
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
            placeholder="Search transactions…"
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
        <Table sx={{ minWidth: 650 }} aria-label="transactions table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell align="right">Method</StyledTableCell>
              <StyledTableCell align="right">Amount</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <StyledTableCell colSpan={5} align="center" sx={{ py: 6, color: "#8B93A0" }}>
                  No transactions match "{query}"
                </StyledTableCell>
              </TableRow>
            ) : (
              filtered.map((row, index) => {
                const Icon = row.icon;
                const color = row.positive ? GREEN : RED;
                const soft = row.positive ? GREEN_SOFT : RED_SOFT;
                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: soft }}
                        >
                          <Icon sx={{ fontSize: 15, color }} />
                        </div>
                        <span className="font-medium" style={{ color: "#12181F" }}>
                          {row.label}
                        </span>
                      </div>
                    </StyledTableCell>

                    <StyledTableCell>
                      <span style={{ color: "#6B6B6B" }}>{row.customer}</span>
                    </StyledTableCell>

                    <StyledTableCell>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#6B6B6B" }}>
                        {row.date}
                      </span>
                    </StyledTableCell>

                    <StyledTableCell align="right">
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "rgba(18,24,31,0.05)", color: "#6B6B6B" }}
                      >
                        {row.method}
                      </span>
                    </StyledTableCell>

                    <StyledTableCell align="right">
                      <span
                        className="font-bold"
                        style={{ fontFamily: "'IBM Plex Mono', monospace", color }}
                      >
                        {row.amount}
                      </span>
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