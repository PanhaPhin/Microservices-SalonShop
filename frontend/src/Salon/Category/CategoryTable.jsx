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
  CircularProgress,
  Dialog,
} from "@mui/material";

import {
  Search,
  Close,
  Edit,
  Delete,
  Add,
  Category as CategoryIcon,
  AddPhotoAlternate,
  Save,
} from "@mui/icons-material";

import api from "../../config/api";

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/100";

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

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = reject;
  });
};

function CategoryEditDialog({
  open,
  category,
  onClose,
  onUpdated,
}) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileRef = useRef(null);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setImage(category.image || "");
      setPreview(category.image || null);
      setError("");

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  }, [category]);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    try {
      setError("");

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      const base64 = await fileToBase64(file);

      setImage(base64);
    } catch (error) {
      console.error(error);
      setError("Failed to read image.");
    }
  };

  const handleRemoveImage = () => {
    setImage("");
    setPreview(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    if (!category?.id) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        name: name.trim(),
        image: image || null,
      };

      /*
       * IMPORTANT:
       *
       * Your current backend does NOT have PUT /api/categories/salon-owner/{id}.
       *
       * So this frontend expects you to add that backend endpoint.
       */
      const response = await api.put(
        `/api/categories/salon-owner/${category.id}`,
        payload
      );

      onUpdated(response.data);

      onClose();
    } catch (error) {
      console.error("Update category error:", error);

      if (error.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (error.response?.status === 403) {
        setError(
          "You do not have permission to update this category."
        );
      } else if (error.response?.status === 404) {
        setError("Category update API was not found.");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to update category."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!loading) {
          onClose();
        }
      }}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
        },
      }}
    >
      <div className="bg-white">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: GREEN_SOFT,
              }}
            >
              <CategoryIcon
                sx={{
                  color: GREEN,
                  fontSize: 23,
                }}
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Edit Category
              </h2>

              <p className="text-xs text-gray-500 mt-0.5">
                Update category information
              </p>
            </div>
          </div>

          <IconButton
            onClick={onClose}
            disabled={loading}
          >
            <Close />
          </IconButton>
        </div>

        <div className="px-6 py-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              disabled={loading}
              placeholder="Category name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category image
            </label>

            <div className="flex items-center gap-5">
              <div
                className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                style={{
                  backgroundColor: "#F3F4F6",
                  border:
                    "1px solid rgba(18,24,31,0.08)",
                }}
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt={name}
                      className="w-full h-full object-cover"
                      onError={() => {
                        setPreview(null);
                      }}
                    />

                    <IconButton
                      size="small"
                      onClick={handleRemoveImage}
                      disabled={loading}
                      sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        width: 26,
                        height: 26,
                        backgroundColor: "#fff",
                        "&:hover": {
                          backgroundColor: "#f3f4f6",
                        },
                      }}
                    >
                      <Close
                        sx={{
                          fontSize: 16,
                        }}
                      />
                    </IconButton>
                  </>
                ) : (
                  <CategoryIcon
                    sx={{
                      color: "#CBD5E1",
                      fontSize: 32,
                    }}
                  />
                )}
              </div>

              <div>
                <label
                  htmlFor="edit-category-image"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer text-sm font-semibold"
                  style={{
                    color: GREEN,
                    backgroundColor: GREEN_SOFT,
                  }}
                >
                  <AddPhotoAlternate
                    sx={{ fontSize: 18 }}
                  />

                  Select Image
                </label>

                <input
                  ref={fileRef}
                  id="edit-category-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                  onChange={handleImageChange}
                  disabled={loading}
                />

                <p className="text-xs text-gray-400 mt-2">
                  JPG, PNG or WEBP · Max 5MB
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-100">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-700 hover:bg-green-800 disabled:opacity-60"
          >
            {loading ? (
              <>
                <CircularProgress
                  size={17}
                  sx={{ color: "#fff" }}
                />

                Updating...
              </>
            ) : (
              <>
                <Save
                  sx={{ fontSize: 17 }}
                />

                Update Category
              </>
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState(null);

  const getCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/categories/salon-owner"
      );

      console.log(
        "Categories:",
        response.data
      );

      setCategories(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Get categories error:",
        error
      );

      if (error.response?.status === 401) {
        setError(
          "Unauthorized. Please login again."
        );
      } else if (error.response?.status === 403) {
        setError(
          "You do not have permission to view categories."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to load categories."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      return categories;
    }

    return categories.filter((category) =>
      category.name
        ?.toLowerCase()
        .includes(q)
    );
  }, [categories, query]);

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/api/categories/salon-owner/${id}`
      );

      setCategories((prev) =>
        prev.filter(
          (category) =>
            category.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      if (error.response?.status === 401) {
        alert(
          "Your session has expired. Please login again."
        );
      } else if (
        error.response?.status === 403
      ) {
        alert(
          "You do not have permission to delete this category."
        );
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to delete category."
        );
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setEditOpen(true);
  };

  const handleUpdated = (updatedCategory) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === updatedCategory.id
          ? updatedCategory
          : category
      )
    );
  };

  const handleAdd = () => {
    console.log("Add category");
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
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <p
            className="text-xs uppercase tracking-[0.25em] mb-2"
            style={{
              color: "#8B7A3F",
            }}
          >
            The Nika Studio
          </p>

          <div className="flex items-center gap-3">
            <h1
              className="font-semibold text-2xl md:text-3xl"
              style={{
                fontFamily:
                  "'Fraunces', serif",
                color: "#12181F",
              }}
            >
              Categories
            </h1>

            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor:
                  GREEN_SOFT,
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
              placeholder="Search categories..."
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
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
                  sx={{ fontSize: 14 }}
                />
              </IconButton>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl shrink-0"
            style={{
              backgroundColor: GREEN,
              color: "#fff",
            }}
          >
            <Add sx={{ fontSize: 18 }} />

            New Category
          </button>
        </div>
      </div>

      {error && (
        <div
          className="mb-4 rounded-xl px-4 py-3 text-sm"
          style={{
            backgroundColor: "#FEF2F2",
            color: "#B91C1C",
          }}
        >
          {error}
        </div>
      )}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "16px",
          border:
            "1px solid rgba(18,24,31,0.06)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell
                sx={{ width: 64 }}
              >
                #
              </StyledTableCell>

              <StyledTableCell>
                Image
              </StyledTableCell>

              <StyledTableCell>
                Category Name
              </StyledTableCell>

              <StyledTableCell>
                Salon ID
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
                  colSpan={5}
                  align="center"
                  sx={{ py: 8 }}
                >
                  <CircularProgress
                    size={30}
                    sx={{
                      color: GREEN,
                    }}
                  />
                </StyledTableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <StyledTableCell
                  colSpan={5}
                  align="center"
                  sx={{
                    py: 8,
                    color: "#8B93A0",
                  }}
                >
                  {query
                    ? `No categories match "${query}"`
                    : "No categories found."}
                </StyledTableCell>
              </TableRow>
            ) : (
              filtered.map(
                (category, index) => (
                  <StyledTableRow
                    key={category.id}
                  >
                    <StyledTableCell>
                      <span
                        style={{
                          fontFamily:
                            "'IBM Plex Mono', monospace",
                          color: "#8B93A0",
                        }}
                      >
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>
                    </StyledTableCell>

                    <StyledTableCell>
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 10,
                          overflow: "hidden",
                          border:
                            "1px solid rgba(18,24,31,0.08)",
                          backgroundColor:
                            "#F3F4F6",
                        }}
                      >
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.currentTarget.src =
                                FALLBACK_IMAGE;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <CategoryIcon
                              sx={{
                                color:
                                  "#CBD5E1",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </StyledTableCell>

                    <StyledTableCell>
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor:
                              GREEN_SOFT,
                          }}
                        >
                          <CategoryIcon
                            sx={{
                              fontSize: 15,
                              color: GREEN,
                            }}
                          />
                        </div>

                        <span
                          className="font-medium"
                          style={{
                            color:
                              "#12181F",
                          }}
                        >
                          {category.name}
                        </span>
                      </div>
                    </StyledTableCell>

                    <StyledTableCell>
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            "rgba(18,24,31,0.05)",
                          color: "#6B6B6B",
                        }}
                      >
                        Salon #
                        {
                          category.salonId
                        }
                      </span>
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Tooltip title="Edit category">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                category
                              )
                            }
                            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer"
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

                        <Tooltip title="Delete category">
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                category.id,
                                category.name
                              )
                            }
                            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer"
                            style={{
                              color:
                                "#C4695A",
                              backgroundColor:
                                "rgba(196,105,90,0.08)",
                            }}
                          >
                            <Delete
                              sx={{
                                fontSize: 14,
                              }}
                            />

                            Delete
                          </button>
                        </Tooltip>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CategoryEditDialog
        open={editOpen}
        category={editingCategory}
        onClose={() => {
          setEditOpen(false);
          setEditingCategory(null);
        }}
        onUpdated={handleUpdated}
      />
    </div>
  );
}