import React, { useMemo, useRef, useState } from "react";
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
  Dialog,
} from "@mui/material";
import { Search, Close, Edit, Delete, Add } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";
const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/6876708/pexels-photo-6876708.jpeg";

const CATEGORIES = ["Hair Care", "Shaving", "Massage", "Facial", "Hair Coloring"];
const DURATIONS = [15, 30, 45, 60, 90];

const initialRows = [
  {
    service: "Hair Cut",
    title: "Basic Hair Styling",
    price: "$10",
    image: FALLBACK_IMAGE,
  },
  {
    service: "Hair Coloring",
    title: "Premium Color Package",
    price: "$25",
    image: FALLBACK_IMAGE,
  },
  {
    service: "Facial",
    title: "Skin Care Treatment",
    price: "$15",
    image: FALLBACK_IMAGE,
  },
];

const validationSchema = Yup.object({
  serviceName: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  category: Yup.string().required("Required"),
  price: Yup.number().required("Required").positive("Must be greater than 0"),
  duration: Yup.number().required("Required").positive("Required"),
});

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

function Field({ label, error, touched, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-800 tracking-wide">{label}</label>
      {children}
      {touched && error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

// ---- New Service dialog: same design as CreateServiceForm, wrapped in a modal ----
function NewServiceDialog({ open, onClose, onCreate }) {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef();

  const formik = useFormik({
    initialValues: { serviceName: "", description: "", category: "", price: "", duration: "" },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      onCreate({
        service: values.category,
        title: values.serviceName,
        price: `$${parseFloat(values.price).toFixed(2)}`,
        image: preview || FALLBACK_IMAGE,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        resetForm();
        setPreview(null);
        setImage(null);
        onClose();
      }, 900);
    },
  });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setPreview(null);
    setImage(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDialogClose = () => {
    formik.resetForm();
    setPreview(null);
    setImage(null);
    onClose();
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 text-sm rounded-lg border bg-white outline-none transition-all
     placeholder:text-gray-400 text-gray-900
     focus:ring-2 focus:ring-green-700/10 focus:border-green-700
     ${formik.touched[field] && formik.errors[field] ? "border-red-400" : "border-gray-200"}`;

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: "18px", overflow: "hidden" } }}
    >
      <div className="w-full bg-white flex flex-col md:flex-row">
        {/* Left: Poster panel */}
        <aside className="w-full md:w-56 flex-shrink-0 bg-green-50 border-r border-gray-200 flex flex-col">
          <div className="flex-1 flex items-center justify-center min-h-40 md:min-h-56 relative overflow-hidden">
            {preview ? (
              <div className="relative w-full h-full group min-h-40 md:min-h-56">
                <img src={preview} alt="preview" className="w-full h-full object-cover absolute inset-0" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2.5">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 text-white text-xs font-medium rounded-md cursor-pointer"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="service-image"
                className="flex flex-col items-center justify-center gap-3 p-8 w-full h-full cursor-pointer hover:bg-green-100/60 transition-colors text-center"
              >
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-700">
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <rect x="3" y="6" width="26" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="11" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      d="M3 22l7-6 5 4 4-3 10 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Service image</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">PNG, JPG, WEBP</p>
                </div>
              </label>
            )}
          </div>

          {/* Live preview */}
          <div className="p-4 border-t border-gray-200">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-100 px-2 py-0.5 rounded">
              Salon Service
            </span>
            {formik.values.serviceName && (
              <p className="mt-2 text-sm font-semibold text-gray-900 leading-tight">{formik.values.serviceName}</p>
            )}
            {formik.values.price && (
              <p className="mt-1 text-xl font-bold text-green-700 tracking-tight">
                ${parseFloat(formik.values.price || 0).toFixed(2)}
              </p>
            )}
            {formik.values.duration && (
              <p className="mt-1 text-xs text-gray-500">{formik.values.duration} min session</p>
            )}
          </div>
        </aside>

        {/* Right: Form */}
        <main className="flex-1 flex flex-col p-6 md:p-8 gap-6 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Add New Service</h1>
              <p className="text-sm text-gray-500 mt-1">Create a service for your booking catalog.</p>
            </div>
            <IconButton size="small" onClick={handleDialogClose}>
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </div>

          <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Service name" error={formik.errors.serviceName} touched={formik.touched.serviceName}>
                <input
                  className={inputClass("serviceName")}
                  name="serviceName"
                  placeholder="e.g. Classic Haircut"
                  value={formik.values.serviceName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Field>

              <Field label="Category" error={formik.errors.category} touched={formik.touched.category}>
                <div className="relative">
                  <select
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`${inputClass("category")} pr-8 appearance-none cursor-pointer`}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (USD)" error={formik.errors.price} touched={formik.touched.price}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`${inputClass("price")} pl-6`}
                  />
                </div>
              </Field>

              <Field label="Duration" error={formik.errors.duration} touched={formik.touched.duration}>
                <div className="flex gap-1.5 flex-wrap">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => formik.setFieldValue("duration", d)}
                      onBlur={() => formik.setFieldTouched("duration", true)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer
                        ${
                          formik.values.duration === d
                            ? "bg-green-700 text-white border-green-700"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-green-700 hover:text-green-700"
                        }`}
                    >
                      {d}m
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <Field label="Description" error={formik.errors.description} touched={formik.touched.description}>
              <textarea
                name="description"
                rows={3}
                placeholder="Describe what's included in this service…"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${inputClass("description")} resize-none leading-relaxed`}
              />
            </Field>

            <input ref={fileRef} id="service-image" type="file" accept="image/*" className="hidden" onChange={handleImage} />

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleDialogClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitted}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition-all cursor-pointer disabled:opacity-75
                  ${submitted ? "bg-green-600" : "bg-green-700 hover:bg-green-800"}`}
              >
                {submitted ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Saved
                  </>
                ) : (
                  <>
                    <Add sx={{ fontSize: 16 }} />
                    Add Service
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </Dialog>
  );
}

export default function ServicesPage() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(initialRows);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.service.toLowerCase().includes(q) || r.title.toLowerCase().includes(q)
    );
  }, [query, rows]);

  const handleCreate = (newRow) => {
    setRows((prev) => [newRow, ...prev]);
  };

  const handleDelete = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

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
            onClick={() => setDialogOpen(true)}
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
                <StyledTableRow key={`${row.title}-${index}`}>
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
                          onClick={() => handleDelete(index)}
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

      <NewServiceDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onCreate={handleCreate} />
    </div>
  );
}