import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { Search, Close, Inbox } from "@mui/icons-material";
import api from "../../config/api";

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";
const INK = "#12181F";
const MUTED = "#6B7280";
const BORDER = "rgba(18,24,31,0.08)";

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/6876708/pexels-photo-6876708.jpeg";

const SERVICE_API = "/api/service-offerings/salon-owner";
const CATEGORY_API = "/api/categories/salon-owner";

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
    borderBottom: `1px solid ${BORDER}`,
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

function EmptyState({ query }) {
  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <Inbox sx={{ fontSize: 28, color: "#C7CDD6" }} />
      <div className="text-sm font-medium" style={{ color: "#4B5563" }}>
        {query ? `No services match "${query}"` : "No services yet"}
      </div>
    </div>
  );
}

const ServiceTable = forwardRef(function ServiceTable(_props, ref) {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // GET SERVICES
  // =========================
  const fetchServices = async () => {
    try {
      setLoading(true);

      const response = await api.get(SERVICE_API);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content || [];

      setRows(data);
    } catch (error) {
      console.error("Failed to load services:", error);
      console.error("Status:", error?.response?.status);
      console.error("Response:", error?.response?.data);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET CATEGORIES
  // =========================
  const fetchCategories = async () => {
    try {
      const response = await api.get(CATEGORY_API);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content || [];

      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  // Lets a parent page tell this table to reload, if it ever needs to.
  useImperativeHandle(ref, () => ({
    refresh: fetchServices,
  }));

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (item) => Number(item.id) === Number(categoryId)
    );
    return category?.name || "Unknown";
  };

  // =========================
  // SEARCH
  // =========================
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((row) => {
      const name = row.name?.toLowerCase() || "";
      const description = row.description?.toLowerCase() || "";
      const categoryName =
        getCategoryName(row.categoryId)?.toLowerCase() || "";

      return (
        name.includes(q) ||
        description.includes(q) ||
        categoryName.includes(q)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, rows, categories]);

  return (
    <div
      className="min-h-screen w-full px-6 py-8 md:px-10 lg:px-14"
      style={{
        backgroundColor: "#F9FAFB",
        fontFamily: "'Manrope', 'Inter', sans-serif",
        minWidth: 0,
      }}
    >
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <p
            className="text-xs uppercase tracking-[0.25em] mb-2"
            style={{ color: "#8B7A3F" }}
          >
            The Nika Studio
          </p>

          <div className="flex items-center gap-3">
            <h1
              className="font-semibold text-2xl md:text-3xl"
              style={{ fontFamily: "'Fraunces', serif", color: INK }}
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

        {/* SEARCH */}
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 border w-full md:w-72 transition-colors focus-within:border-[#15803d]"
          style={{ backgroundColor: "#fff", borderColor: BORDER }}
        >
          <Search sx={{ fontSize: 18, color: "#9AA3AF" }} />

          <InputBase
            placeholder="Search services..."
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

      {/* TABLE */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: `1px solid ${BORDER}`,
          overflowX: "auto",
          maxWidth: "100%",
          boxShadow: "0 1px 2px rgba(18,24,31,0.04)",
        }}
      >
        <Table sx={{ minWidth: 800 }} aria-label="services table">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: 84 }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "34%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>
          <TableHead>
            <TableRow>
              <StyledTableCell>Service</StyledTableCell>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Duration</StyledTableCell>
              <StyledTableCell align="right">Price</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <StyledTableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={28} sx={{ color: GREEN }} />
                  <div className="text-sm mt-3" style={{ color: MUTED }}>
                    Loading services...
                  </div>
                </StyledTableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <StyledTableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <EmptyState query={query} />
                </StyledTableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <StyledTableRow key={row.id}>
                  {/* SERVICE NAME */}
                  <StyledTableCell component="th" scope="row">
                    <span
                      className="font-semibold block"
                      style={{ color: INK, lineHeight: 1.3 }}
                      title={row.name}
                    >
                      {row.name}
                    </span>
                  </StyledTableCell>

                  {/* IMAGE */}
                  <StyledTableCell>
                    <div
                      className="overflow-hidden shrink-0"
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 10,
                        border: `1px solid ${BORDER}`,
                        backgroundColor: "#F3F4F6",
                      }}
                    >
                      <img
                        src={row.image || FALLBACK_IMAGE}
                        alt={row.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(event) => {
                          event.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>
                  </StyledTableCell>

                  {/* CATEGORY */}
                  <StyledTableCell>
                    <span
                      className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                      style={{ color: GREEN, backgroundColor: GREEN_SOFT }}
                    >
                      {getCategoryName(row.categoryId)}
                    </span>
                  </StyledTableCell>

                  {/* DESCRIPTION */}
                  <StyledTableCell>
                    <span
                      className="block max-w-sm truncate"
                      style={{ color: MUTED }}
                      title={row.description}
                    >
                      {row.description || "No description"}
                    </span>
                  </StyledTableCell>

                  {/* DURATION */}
                  <StyledTableCell>
                    <span className="text-sm" style={{ color: MUTED }}>
                      {row.duration} min
                    </span>
                  </StyledTableCell>

                  {/* PRICE */}
                  <StyledTableCell align="right">
                    <span
                      className="font-semibold"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: INK,
                      }}
                    >
                      ${Number(row.price || 0).toFixed(2)}
                    </span>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
});

export default ServiceTable;