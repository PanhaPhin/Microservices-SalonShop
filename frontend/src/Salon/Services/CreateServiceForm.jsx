import React, { useEffect, useMemo, useRef, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import {
  Search,
  Close,
  Edit,
  Delete,
  Add,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../config/api";

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/6876708/pexels-photo-6876708.jpeg";


const SERVICE_API = "/api/service-offering";

const CATEGORY_API = "/api/categories/salon-owner";

const DURATIONS = [15, 30, 45, 60, 90];

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Service name is required")
    .max(100, "Service name is too long"),

  description: Yup.string()
    .required("Description is required")
    .max(500, "Description is too long"),

  categoryId: Yup.number()
    .typeError("Category is required")
    .required("Category is required")
    .positive("Please select a category"),

  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be greater than 0"),

  duration: Yup.number()
    .typeError("Duration is required")
    .required("Duration is required")
    .positive("Duration must be greater than 0"),

  image: Yup.string().nullable(),
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
      <label className="text-xs font-semibold text-gray-800 tracking-wide">
        {label}
      </label>

      {children}

      {touched && error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
};

function ServiceDialog({
  open,
  onClose,
  onSave,
  editingService,
  categories,
}) {
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fileRef = useRef(null);

  const isEdit = Boolean(editingService);

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: editingService?.name || "",
      description: editingService?.description || "",
      categoryId: editingService?.categoryId || "",
      price: editingService?.price ?? "",
      duration: editingService?.duration || "",
      image: editingService?.image || "",
    },

    validationSchema,

    onSubmit: async (values) => {
      try {
        setSaving(true);

        const payload = {
          name: values.name.trim(),
          description: values.description.trim(),
          price: Number(values.price),
          duration: Number(values.duration),
          categoryId: Number(values.categoryId),
          image: values.image || null,
        };

        let response;

        if (isEdit) {
          response = await api.put(
            `${SERVICE_API}/${editingService.id}`,
            payload
          );
        } else {
          response = await api.post(SERVICE_API, payload);
        }

        onSave(response.data);
      } catch (error) {
        console.error("Failed to save service:", error);

        console.error("Response:", error?.response?.data);
        console.error("Status:", error?.response?.status);

        alert(
          error?.response?.data?.message ||
            error?.response?.data ||
            "Failed to save service"
        );
      } finally {
        setSaving(false);
      }
    },
  });

  useEffect(() => {
    if (editingService?.image) {
      setPreview(editingService.image);
    } else {
      setPreview(null);
    }
  }, [editingService]);

  const handleImage = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    try {
      const objectUrl = URL.createObjectURL(file);

      setPreview(objectUrl);

      const base64 = await fileToBase64(file);

      formik.setFieldValue("image", base64);
    } catch (error) {
      console.error("Failed to process image:", error);
    }
  };

  const removeImage = () => {
    setPreview(null);
    formik.setFieldValue("image", "");

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleDialogClose = () => {
    if (saving) return;

    formik.resetForm();
    setPreview(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }

    onClose();
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 text-sm rounded-lg border bg-white outline-none transition-all
     placeholder:text-gray-400 text-gray-900
     focus:ring-2 focus:ring-green-700/10 focus:border-green-700
     ${
       formik.touched[field] && formik.errors[field]
         ? "border-red-400"
         : "border-gray-200"
     }`;

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "18px",
          overflow: "hidden",
        },
      }}
    >
      <div className="w-full bg-white flex flex-col md:flex-row">
        <aside className="w-full md:w-56 flex-shrink-0 bg-green-50 border-r border-gray-200 flex flex-col">
          <div className="flex-1 flex items-center justify-center min-h-40 md:min-h-56 relative overflow-hidden">
            {preview ? (
              <div className="relative w-full h-full group min-h-40 md:min-h-56">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover absolute inset-0"
                  onError={() => {
                    setPreview(null);
                  }}
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2.5">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 text-white text-xs font-medium rounded-md cursor-pointer"
                  >
                    <Close sx={{ fontSize: 14 }} />
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
                  <ImageIcon sx={{ fontSize: 28 }} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-800">
                    Service image
                  </p>

                  <p className="text-[11px] text-gray-500 mt-0.5">
                    PNG, JPG, WEBP
                  </p>
                </div>
              </label>
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-100 px-2 py-0.5 rounded">
              Salon Service
            </span>

            {formik.values.name && (
              <p className="mt-2 text-sm font-semibold text-gray-900 leading-tight">
                {formik.values.name}
              </p>
            )}

            {formik.values.price && (
              <p className="mt-1 text-xl font-bold text-green-700 tracking-tight">
                ${Number(formik.values.price).toFixed(2)}
              </p>
            )}

            {formik.values.duration && (
              <p className="mt-1 text-xs text-gray-500">
                {formik.values.duration} min session
              </p>
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col p-6 md:p-8 gap-6 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                {isEdit ? "Edit Service" : "Add New Service"}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                {isEdit
                  ? "Update your salon service."
                  : "Create a service for your booking catalog."}
              </p>
            </div>

            <IconButton
              size="small"
              onClick={handleDialogClose}
              disabled={saving}
            >
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Service name"
                error={formik.errors.name}
                touched={formik.touched.name}
              >
                <input
                  className={inputClass("name")}
                  name="name"
                  placeholder="e.g. Classic Haircut"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={saving}
                />
              </Field>

              <Field
                label="Category"
                error={formik.errors.categoryId}
                touched={formik.touched.categoryId}
              >
                <div className="relative">
                  <select
                    name="categoryId"
                    value={formik.values.categoryId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`${inputClass(
                      "categoryId"
                    )} pr-8 appearance-none cursor-pointer`}
                    disabled={saving || categories.length === 0}
                  >
                    <option value="">
                      {categories.length === 0
                        ? "No categories available"
                        : "Select category"}
                    </option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
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
                    <path
                      d="M4 6l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Price (USD)"
                error={formik.errors.price}
                touched={formik.touched.price}
              >
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
                    disabled={saving}
                  />
                </div>
              </Field>

              <Field
                label="Duration"
                error={formik.errors.duration}
                touched={formik.touched.duration}
              >
                <div className="flex gap-1.5 flex-wrap">
                  {DURATIONS.map((duration) => (
                    <button
                      key={duration}
                      type="button"
                      onClick={() =>
                        formik.setFieldValue("duration", duration)
                      }
                      onBlur={() =>
                        formik.setFieldTouched("duration", true)
                      }
                      disabled={saving}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        Number(formik.values.duration) === duration
                          ? "bg-green-700 text-white border-green-700"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-green-700 hover:text-green-700"
                      }`}
                    >
                      {duration}m
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <Field
              label="Description"
              error={formik.errors.description}
              touched={formik.touched.description}
            >
              <textarea
                name="description"
                rows={3}
                placeholder="Describe what's included in this service…"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${inputClass(
                  "description"
                )} resize-none leading-relaxed`}
                disabled={saving}
              />
            </Field>

            <input
              ref={fileRef}
              id="service-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleImage}
              disabled={saving}
            />

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleDialogClose}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving || categories.length === 0}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition-all cursor-pointer disabled:opacity-75 bg-green-700 hover:bg-green-800"
              >
                {saving ? (
                  <>
                    <CircularProgress
                      size={15}
                      sx={{ color: "#fff" }}
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    {isEdit ? (
                      <Edit sx={{ fontSize: 16 }} />
                    ) : (
                      <Add sx={{ fontSize: 16 }} />
                    )}

                    {isEdit ? "Update Service" : "Add Service"}
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
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingService, setEditingService] = useState(null);

  const [deleteLoading, setDeleteLoading] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);

      const response = await api.get(CATEGORY_API);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content || [];

      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
      console.error("Status:", error?.response?.status);
      console.error("Response:", error?.response?.data);

      setCategories([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return rows;

    return rows.filter((row) => {
      const name = row.name?.toLowerCase() || "";

      const description =
        row.description?.toLowerCase() || "";

      const category = categories.find(
        (item) =>
          Number(item.id) === Number(row.categoryId)
      );

      const categoryName =
        category?.name?.toLowerCase() || "";

      return (
        name.includes(q) ||
        description.includes(q) ||
        categoryName.includes(q)
      );
    });
  }, [query, rows, categories]);

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (item) =>
        Number(item.id) === Number(categoryId)
    );

    return category?.name || "Unknown";
  };

  const handleSave = (savedService) => {
    setRows((previous) => {
      const exists = previous.some(
        (row) => row.id === savedService.id
      );

      if (exists) {
        return previous.map((row) =>
          row.id === savedService.id
            ? savedService
            : row
        );
      }

      return [savedService, ...previous];
    });

    setDialogOpen(false);
    setEditingService(null);
  };

  const handleNewService = async () => {
    await fetchCategories();

    setEditingService(null);
    setDialogOpen(true);
  };

  const handleEdit = async (service) => {
    await fetchCategories();

    setEditingService(service);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(id);

      await api.delete(`${SERVICE_API}/${id}`);

      setRows((previous) =>
        previous.filter((row) => row.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete service:", error);
      console.error("Status:", error?.response?.status);
      console.error("Response:", error?.response?.data);

      alert(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Failed to delete service"
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingService(null);
  };

  return (
    <div
      className="min-h-screen w-full px-6 py-8 md:px-10 lg:px-14"
      style={{
        backgroundColor: "#F9FAFB",
        fontFamily: "'Manrope', 'Inter', sans-serif",
      }}
    >
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
              style={{
                fontFamily: "'Fraunces', serif",
                color: "#12181F",
              }}
            >
              Services
            </h1>

            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: GREEN_SOFT,
                color: GREEN,
              }}
            >
              {filtered.length} total
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2 border w-full md:w-64"
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
              placeholder="Search services…"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
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
                <Close sx={{ fontSize: 14 }} />
              </IconButton>
            )}
          </div>

          <button
            onClick={handleNewService}
            disabled={categoryLoading}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl shrink-0 disabled:opacity-60"
            style={{
              backgroundColor: GREEN,
              color: "#fff",
            }}
          >
            <Add sx={{ fontSize: 18 }} />
            New Service
          </button>
        </div>
      </div>

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
          sx={{ minWidth: 900 }}
          aria-label="services table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>
                Service
              </StyledTableCell>

              <StyledTableCell>
                Image
              </StyledTableCell>

              <StyledTableCell>
                Category
              </StyledTableCell>

              <StyledTableCell>
                Description
              </StyledTableCell>

              <StyledTableCell>
                Duration
              </StyledTableCell>

              <StyledTableCell align="right">
                Price
              </StyledTableCell>

              <StyledTableCell align="center">
                Action
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <StyledTableCell
                  colSpan={7}
                  align="center"
                  sx={{ py: 8 }}
                >
                  <CircularProgress
                    size={30}
                    sx={{ color: GREEN }}
                  />

                  <p className="text-sm text-gray-500 mt-3">
                    Loading services...
                  </p>
                </StyledTableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <StyledTableCell
                  colSpan={7}
                  align="center"
                  sx={{
                    py: 6,
                    color: "#8B93A0",
                  }}
                >
                  {query
                    ? `No services match "${query}"`
                    : "No services found"}
                </StyledTableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell
                    component="th"
                    scope="row"
                  >
                    <span
                      className="font-medium"
                      style={{
                        color: "#12181F",
                      }}
                    >
                      {row.name}
                    </span>
                  </StyledTableCell>

                  <StyledTableCell>
                    <div
                      className="overflow-hidden shrink-0"
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 10,
                        border:
                          "1px solid rgba(18,24,31,0.08)",
                        backgroundColor: "#F3F4F6",
                      }}
                    >
                      <img
                        src={
                          row.image ||
                          FALLBACK_IMAGE
                        }
                        alt={row.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(event) => {
                          event.currentTarget.src =
                            FALLBACK_IMAGE;
                        }}
                      />
                    </div>
                  </StyledTableCell>

                  <StyledTableCell>
                    <span
                      className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        color: GREEN,
                        backgroundColor: GREEN_SOFT,
                      }}
                    >
                      {getCategoryName(row.categoryId)}
                    </span>
                  </StyledTableCell>

                  <StyledTableCell>
                    <span
                      className="block max-w-xs truncate"
                      style={{
                        color: "#6B6B6B",
                      }}
                      title={row.description}
                    >
                      {row.description}
                    </span>
                  </StyledTableCell>

                  <StyledTableCell>
                    <span
                      className="text-sm"
                      style={{
                        color: "#6B6B6B",
                      }}
                    >
                      {row.duration} min
                    </span>
                  </StyledTableCell>

                  <StyledTableCell align="right">
                    <span
                      className="font-semibold"
                      style={{
                        fontFamily:
                          "'IBM Plex Mono', monospace",
                        color: "#12181F",
                      }}
                    >
                      $
                      {Number(
                        row.price || 0
                      ).toFixed(2)}
                    </span>
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Tooltip title="Edit service">
                        <button
                          onClick={() =>
                            handleEdit(row)
                          }
                          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg"
                          style={{
                            color: GREEN,
                            backgroundColor:
                              GREEN_SOFT,
                          }}
                        >
                          <Edit
                            sx={{
                              fontSize: 14,
                            }}
                          />
                          Edit
                        </button>
                      </Tooltip>

                      <Tooltip title="Delete service">
                        <button
                          onClick={() =>
                            handleDelete(row.id)
                          }
                          disabled={
                            deleteLoading === row.id
                          }
                          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg disabled:opacity-50"
                          style={{
                            color: "#C4695A",
                            backgroundColor:
                              "rgba(196,105,90,0.08)",
                          }}
                        >
                          {deleteLoading === row.id ? (
                            <CircularProgress
                              size={14}
                              sx={{
                                color: "#C4695A",
                              }}
                            />
                          ) : (
                            <Delete
                              sx={{
                                fontSize: 14,
                              }}
                            />
                          )}

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

      <ServiceDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        editingService={editingService}
        categories={categories}
      />
    </div>
  );
}