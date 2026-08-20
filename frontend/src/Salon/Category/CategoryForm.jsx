import React, { useRef, useState } from "react";
import { IconButton, CircularProgress } from "@mui/material";
import {
  AddPhotoAlternate,
  Close,
  Save,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

import api from "../../config/api";

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Category name is required")
    .min(2, "Minimum 2 characters")
    .max(100, "Maximum 100 characters"),

  image: Yup.string().nullable(),
});

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });
};

export default function CategoryForm() {
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fileRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        setSuccess("");
        setError("");

        const categoryData = {
          name: values.name.trim(),
          image: values.image || null,
        };

        console.log("Sending category:", categoryData);

        const response = await api.post(
          "/api/categories/salon-owner",
          categoryData
        );

        console.log("Create category response:", response.data);

        setSuccess("Category created successfully.");

        resetForm();
        setPreview(null);
        setImageFile(null);

        if (fileRef.current) {
          fileRef.current.value = "";
        }

        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } catch (error) {
        console.error("Create category error:", error);

        if (error.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else if (error.response?.status === 403) {
          setError(
            "You do not have permission to create a category."
          );
        } else if (error.response?.status === 404) {
          setError("Salon not found for this account.");
        } else {
          setError(
            error.response?.data?.message ||
              error.response?.data ||
              "Failed to create category."
          );
        }
      } finally {
        setLoading(false);
      }
    },
  });

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

      setImageFile(file);

      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);

      const base64 = await fileToBase64(file);

      formik.setFieldValue("image", base64);

      console.log("Image converted to Base64");
    } catch (error) {
      console.error("Image conversion error:", error);
      setError("Failed to process image.");
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreview(null);

    formik.setFieldValue("image", "");

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    handleRemoveImage();
    setError("");
    setSuccess("");
  };

  const inputClass = (hasError = false) =>
    `w-full px-4 py-3 text-sm rounded-xl border bg-white outline-none transition-all
     placeholder:text-gray-400 text-gray-900
     focus:ring-2 focus:ring-green-700/10 focus:border-green-700
     ${
       hasError
         ? "border-red-400"
         : "border-gray-200"
     }`;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 py-10"
      style={{
        backgroundColor: "#F7F9F8",
        fontFamily: "'Manrope', 'Inter', sans-serif",
      }}
    >
      <div
        className="w-full max-w-xl rounded-3xl border overflow-hidden shadow-sm"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "rgba(18,24,31,0.08)",
        }}
      >
        <div
          className="px-7 sm:px-8 pt-8 pb-6"
          style={{
            borderBottom: "1px solid rgba(18,24,31,0.06)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: GREEN_SOFT,
              }}
            >
              <CategoryIcon
                sx={{
                  fontSize: 24,
                  color: GREEN,
                }}
              />
            </div>

            <div>
              <h1
                className="font-semibold text-2xl"
                style={{
                  fontFamily: "'Fraunces', serif",
                  color: "#12181F",
                }}
              >
                Create Category
              </h1>

              <p
                className="text-sm mt-1"
                style={{
                  color: "#8B93A0",
                }}
              >
                Add a new category for your salon services.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          noValidate
          className="px-7 sm:px-8 py-7 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm font-semibold"
              style={{
                color: "#374151",
              }}
            >
              Category name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Hair Coloring"
              className={inputClass(
                formik.touched.name &&
                  formik.errors.name
              )}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />

            {formik.touched.name &&
              formik.errors.name && (
                <span className="text-xs text-red-500">
                  {formik.errors.name}
                </span>
              )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-semibold"
              style={{
                color: "#374151",
              }}
            >
              Category image
            </label>

            <div className="flex items-center gap-5">
              <div
                className="relative w-32 h-32 rounded-2xl overflow-hidden flex items-center justify-center shrink-0"
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
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />

                    <IconButton
                      type="button"
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
                        boxShadow:
                          "0 2px 8px rgba(18,24,31,0.15)",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </>
                ) : (
                  <CategoryIcon
                    sx={{
                      fontSize: 32,
                      color: "#CBD5D1",
                    }}
                  />
                )}
              </div>

              <div>
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer text-sm font-semibold"
                  style={{
                    color: GREEN,
                    backgroundColor: GREEN_SOFT,
                    border:
                      "1px solid rgba(21,128,61,0.15)",
                  }}
                >
                  <AddPhotoAlternate
                    sx={{ fontSize: 19 }}
                  />

                  Select Image
                </label>

                <input
                  ref={fileRef}
                  id="image-upload"
                  hidden
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  disabled={loading}
                />

                <p
                  className="text-xs mt-2"
                  style={{
                    color: "#9CA3AF",
                  }}
                >
                  JPG, PNG or WEBP · Max 5MB
                </p>
              </div>
            </div>

            {imageFile && (
              <p
                className="text-xs mt-1"
                style={{
                  color: "#6B7280",
                }}
              >
                Selected: {imageFile.name}
              </p>
            )}
          </div>

          {success && (
            <div
              className="rounded-xl px-4 py-3 text-sm font-medium"
              style={{
                backgroundColor: "#F0FDF4",
                color: "#15803D",
                border: "1px solid #DCFCE7",
              }}
            >
              {success}
            </div>
          )}

          {error && (
            <div
              className="rounded-xl px-4 py-3 text-sm font-medium"
              style={{
                backgroundColor: "#FEF2F2",
                color: "#B91C1C",
                border: "1px solid #FEE2E2",
              }}
            >
              {error}
            </div>
          )}

          <div
            className="flex items-center justify-end gap-3 pt-5"
            style={{
              borderTop:
                "1px solid rgba(18,24,31,0.06)",
            }}
          >
            <button
              type="button"
              disabled={loading}
              onClick={handleCancel}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl border cursor-pointer disabled:opacity-50"
              style={{
                color: "#6B7280",
                borderColor:
                  "rgba(18,24,31,0.12)",
                backgroundColor: "#FFFFFF",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl cursor-pointer disabled:opacity-70"
              style={{
                backgroundColor: GREEN,
              }}
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={17}
                    sx={{
                      color: "#FFFFFF",
                    }}
                  />

                  Creating...
                </>
              ) : (
                <>
                  <Save
                    sx={{
                      fontSize: 17,
                    }}
                  />

                  Save Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}