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
} from "@mui/material";
import { Search, Close, Edit, Delete, Add } from "@mui/icons-material";

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";

const rows = [
  {
    service: "Hair Cut",
    title: "Basic Hair Styling",
    price: "$10",
    image: "https://images.pexels.com/photos/6876708/pexels-photo-6876708.jpeg",
  },
  {
    service: "Hair Coloring",
    title: "Premium Color Package",
    price: "$25",
    image: "https://images.pexels.com/photos/6876708/pexels-photo-6876708.jpeg",
  },
  {
    service: "Facial",
    title: "Skin Care Treatment",
    price: "$15",
    image: "https://images.pexels.com/photos/6876708/pexels-photo-6876708.jpeg",
  },
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

export default function ServiceTable() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.service.toLowerCase().includes(q) || r.title.toLowerCase().includes(q)
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
              Services
            </h1>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: GREEN_SOFT, color: GREEN }}
            >
              {filtered.length} total
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2 border w-full md:w-64"
            style={{ backgroundColor: "#fff", borderColor: "rgba(18,24,31,0.08)" }}
          >
            <Search sx={{ fontSize: 18, color: "#8B93A0" }} />
            <InputBase
              placeholder="Search services…"
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

          <button
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl shrink-0"
            style={{
              backgroundColor: GREEN,
              color: "#fff",
              transition: "background-color 0.15s ease, transform 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#106b32";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = GREEN;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Add sx={{ fontSize: 18 }} />
            New Service
          </button>
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
        <Table sx={{ minWidth: 700 }} aria-label="services table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Service</StyledTableCell>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell align="right">Price</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <StyledTableCell colSpan={5} align="center" sx={{ py: 6, color: "#8B93A0" }}>
                  No services match "{query}"
                </StyledTableCell>
              </TableRow>
            ) : (
              filtered.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    <span className="font-medium" style={{ color: "#12181F" }}>
                      {row.service}
                    </span>
                  </StyledTableCell>

                  <StyledTableCell>
                    <div
                      className="overflow-hidden shrink-0"
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 10,
                        border: "1px solid rgba(18,24,31,0.08)",
                      }}
                    >
                      <img
                        src={row.image}
                        alt={row.service}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      />
                    </div>
                  </StyledTableCell>

                  <StyledTableCell>
                    <span style={{ color: "#6B6B6B" }}>{row.title}</span>
                  </StyledTableCell>

                  <StyledTableCell align="right">
                    <span
                      className="font-semibold"
                      style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#12181F" }}
                    >
                      {row.price}
                    </span>
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Tooltip title="Edit service">
                        <button
                          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg"
                          style={{
                            color: GREEN,
                            backgroundColor: GREEN_SOFT,
                            transition: "background-color 0.15s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(21,128,61,0.18)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = GREEN_SOFT)}
                        >
                          <Edit sx={{ fontSize: 14 }} />
                          Edit
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete service">
                        <button
                          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg"
                          style={{
                            color: "#C4695A",
                            backgroundColor: "rgba(196,105,90,0.08)",
                            transition: "background-color 0.15s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(196,105,90,0.16)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(196,105,90,0.08)")}
                        >
                          <Delete sx={{ fontSize: 14 }} />
                          Delete
                        </button>
                      </Tooltip>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}