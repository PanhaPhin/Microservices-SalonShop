import React, { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Search,
  X,
  Scissors,
  Palette,
  Sparkles,
  Undo2,
  Calendar,
  FileSpreadsheet,
  Printer,
} from "lucide-react";

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";
const RED = "#C4695A";
const RED_SOFT = "rgba(196,105,90,0.10)";

function createData(label, customer, date, amount, positive, icon, method) {
  return { label, customer, date, amount, positive, icon, method };
}

const rows = [
  createData("Classic Haircut", "Sophea K.", "Jun 24, 2026", 25.0, true, Scissors, "Card"),
  createData("Hair Coloring", "Dara M.", "Jun 22, 2026", 80.0, true, Palette, "Cash"),
  createData("Refund", "Lina T.", "Jun 20, 2026", -10.0, false, Undo2, "Card"),
  createData("Facial Treatment", "Chan P.", "Jun 18, 2026", 55.0, true, Sparkles, "Card"),
  createData("Beard Trim", "Marcus V.", "Jun 17, 2026", 12.0, true, Scissors, "Cash"),
];

function formatAmount(n) {
  const sign = n < 0 ? "-" : "+";
  return `${sign}$${Math.abs(n).toFixed(2)}`;
}

// "Jun 24, 2026" -> Date, and -> "2026-06-24" for <input type="date">
function toDate(dateStr) {
  return new Date(dateStr);
}
function toISO(dateStr) {
  const d = toDate(dateStr);
  return d.toISOString().slice(0, 10);
}

export default function TransactionTable() {
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const printRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const from = dateFrom ? new Date(dateFrom + "T00:00:00") : null;
    const to = dateTo ? new Date(dateTo + "T23:59:59") : null;

    return rows.filter((r) => {
      const matchesQuery =
        !q || r.label.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q);

      const rowDate = toDate(r.date);
      const matchesFrom = !from || rowDate >= from;
      const matchesTo = !to || rowDate <= to;

      return matchesQuery && matchesFrom && matchesTo;
    });
  }, [query, dateFrom, dateTo]);

  const hasDateFilter = Boolean(dateFrom || dateTo);

  const clearDates = () => {
    setDateFrom("");
    setDateTo("");
  };

  const rangeLabel = useMemo(() => {
    if (!hasDateFilter) return "All dates";
    if (dateFrom && dateTo) return `${dateFrom} → ${dateTo}`;
    if (dateFrom) return `From ${dateFrom}`;
    return `Through ${dateTo}`;
  }, [dateFrom, dateTo, hasDateFilter]);

  // ---- Excel export ----
  const exportExcel = () => {
    const data = filtered.map((r) => ({
      Description: r.label,
      Customer: r.customer,
      Date: r.date,
      Method: r.method,
      Amount: r.amount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet["!cols"] = [{ wch: 20 }, { wch: 16 }, { wch: 14 }, { wch: 10 }, { wch: 12 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const suffix = hasDateFilter
      ? `_${dateFrom || "start"}_to_${dateTo || "end"}`
      : "";
    XLSX.writeFile(workbook, `nika-studio-transactions${suffix}.xlsx`);
  };

  // ---- PDF export (browser print → Save as PDF) ----
  const exportPDF = () => {
    const rowsHtml = filtered
      .map(
        (r) => `
        <tr>
          <td>${r.label}</td>
          <td>${r.customer}</td>
          <td>${r.date}</td>
          <td>${r.method}</td>
          <td style="text-align:right;color:${r.positive ? GREEN : RED};font-weight:700;">${formatAmount(
          r.amount
        )}</td>
        </tr>`
      )
      .join("");

    const total = filtered.reduce((sum, r) => sum + r.amount, 0);

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Nika Studio — Transactions</title>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: 'Manrope', 'Inter', Arial, sans-serif;
              color: #12181F;
              padding: 32px;
            }
            .eyebrow {
              text-transform: uppercase;
              letter-spacing: 0.25em;
              font-size: 11px;
              color: #8B7A3F;
              margin: 0 0 6px 0;
            }
            h1 {
              font-size: 22px;
              margin: 0 0 4px 0;
            }
            .meta {
              font-size: 12px;
              color: #6B6B6B;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 13px;
            }
            th {
              background: ${GREEN};
              color: #fff;
              text-align: left;
              padding: 10px 12px;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.04em;
            }
            th:last-child, td:last-child { text-align: right; }
            td {
              padding: 9px 12px;
              border-bottom: 1px solid rgba(18,24,31,0.08);
            }
            tfoot td {
              font-weight: 700;
              border-top: 2px solid ${GREEN};
              border-bottom: none;
            }
          </style>
        </head>
        <body>
          <p class="eyebrow">The Nika Studio</p>
          <h1>Transactions</h1>
          <p class="meta">${rangeLabel} · ${filtered.length} transaction${
      filtered.length === 1 ? "" : "s"
    }${query ? ` · search: "${query}"` : ""}</p>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Method</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || `<tr><td colspan="5" style="text-align:center;color:#8B93A0;padding:24px;">No transactions in this range</td></tr>`}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4">Net total</td>
                <td style="color:${total >= 0 ? GREEN : RED};">${formatAmount(total)}</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    // give the new window a tick to paint before printing
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div
      className="min-h-screen w-full px-6 py-8 md:px-10 lg:px-14"
      style={{ backgroundColor: "#F9FAFB", fontFamily: "'Manrope', 'Inter', sans-serif" }}
      ref={printRef}
    >
      {/* header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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

          <div className="flex flex-wrap items-center gap-2">
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2 border w-full sm:w-64"
              style={{ backgroundColor: "#fff", borderColor: "rgba(18,24,31,0.08)" }}
            >
              <Search size={16} color="#8B93A0" />
              <input
                placeholder="Search transactions…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="text-sm flex-1 outline-none bg-transparent"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-[#8B93A0] hover:text-[#12181F]">
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              onClick={exportExcel}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium border transition-colors"
              style={{ backgroundColor: "#fff", borderColor: "rgba(18,24,31,0.08)", color: "#12181F" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = GREEN_SOFT)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
            >
              <FileSpreadsheet size={16} color={GREEN} />
              Export Excel
            </button>

            <button
              onClick={exportPDF}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium border transition-colors"
              style={{ backgroundColor: "#fff", borderColor: "rgba(18,24,31,0.08)", color: "#12181F" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = GREEN_SOFT)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
            >
              <Printer size={16} color={GREEN} />
              Export PDF
            </button>
          </div>
        </div>

        {/* date range filter */}
        <div
          className="flex flex-wrap items-center gap-3 rounded-xl px-4 py-3 border"
          style={{ backgroundColor: "#fff", borderColor: "rgba(18,24,31,0.08)" }}
        >
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#12181F" }}>
            <Calendar size={16} color={GREEN} />
            Date range
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm rounded-lg border px-2.5 py-1.5 outline-none"
              style={{ borderColor: "rgba(18,24,31,0.12)", color: "#12181F" }}
            />
            <span style={{ color: "#8B93A0" }}>to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-sm rounded-lg border px-2.5 py-1.5 outline-none"
              style={{ borderColor: "rgba(18,24,31,0.12)", color: "#12181F" }}
            />
          </div>

          {hasDateFilter && (
            <button
              onClick={clearDates}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: GREEN_SOFT, color: GREEN }}
            >
              <X size={12} />
              Clear
            </button>
          )}

          <span className="text-xs ml-auto" style={{ color: "#8B93A0" }}>
            {rangeLabel}
          </span>
        </div>
      </div>

      {/* table */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(18,24,31,0.06)", backgroundColor: "#fff" }}
      >
        <table className="w-full" style={{ minWidth: 650, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Description", "Customer", "Date", "Method", "Amount"].map((h, i) => (
                <th
                  key={h}
                  className="text-xs font-semibold uppercase tracking-wide px-4 py-3.5"
                  style={{
                    backgroundColor: GREEN,
                    color: "#fff",
                    textAlign: i === 3 || i === 4 ? "right" : "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-sm" style={{ color: "#8B93A0" }}>
                  No transactions match your filters
                </td>
              </tr>
            ) : (
              filtered.map((row, index) => {
                const Icon = row.icon;
                const color = row.positive ? GREEN : RED;
                const soft = row.positive ? GREEN_SOFT : RED_SOFT;
                return (
                  <tr
                    key={index}
                    className="transition-colors"
                    style={{ borderBottom: "1px solid rgba(18,24,31,0.06)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(21,128,61,0.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: soft }}
                        >
                          <Icon size={15} color={color} />
                        </div>
                        <span className="font-medium text-sm" style={{ color: "#12181F" }}>
                          {row.label}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm" style={{ color: "#6B6B6B" }}>
                        {row.customer}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#6B6B6B" }}>
                        {row.date}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "rgba(18,24,31,0.05)", color: "#6B6B6B" }}
                      >
                        {row.method}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <span
                        className="font-bold text-sm"
                        style={{ fontFamily: "'IBM Plex Mono', monospace", color }}
                      >
                        {formatAmount(row.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}