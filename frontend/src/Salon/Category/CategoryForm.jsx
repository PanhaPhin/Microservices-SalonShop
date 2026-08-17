import React, { useRef, useState } from "react";
import { IconButton } from "@mui/material";
import { AddPhotoAlternate, Close, Save, Category as CategoryIcon } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";

const validationSchema = Yup.object({
  name: Yup.string().required("Category name is required").min(2, "Minimum 2 characters"),
});

export default function CategoryForm() {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef();

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      if (image) formData.append("image", image);

      console.log("Form Values:", values);
      console.log("Image:", image);
      // API Call Here
      // axios.post('/api/categories', formData)

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        resetForm();
        setPreview(null);
        setImage(null);
        if (fileRef.current) fileRef.current.value = "";
      }, 1200);
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const inputClass = `w-full px-3 py-2.5 text-sm rounded-lg border bg-white outline-none transition-all
     placeholder:text-gray-400 text-gray-900
     focus:ring-2 focus:ring-green-700/10 focus:border-green-700
     ${formik.touched.name && formik.errors.name ? "border-red-400" : "border-gray-200"}`;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-6 py-12"
      style={{ backgroundColor: "#F9FAFB", fontFamily: "'Manrope', 'Inter', sans-serif" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl border overflow-hidden"
        style={{ backgroundColor: "#fff", borderColor: "rgba(18,24,31,0.08)" }}
      >
        {/* header */}
        <div className="px-7 pt-7 pb-5" style={{ borderBottom: "1px solid rgba(18,24,31,0.06)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: GREEN_SOFT }}
            >
              <CategoryIcon sx={{ fontSize: 20, color: GREEN }} />
            </div>
            <div>
              <h1
                className="font-semibold text-xl"
                style={{ fontFamily: "'Fraunces', serif", color: "#12181F" }}
              >
                Create Category
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "#8B93A0" }}>
                Add a new category for your salon services.
              </p>
            </div>
          </div>
        </div>

        {/* form */}
        <form onSubmit={formik.handleSubmit} noValidate className="px-7 py-6 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide" style={{ color: "#374151" }}>
              Category name
            </label>
            <input
              id="name"
              name="name"
              placeholder="e.g. Hair Coloring"
              className={inputClass}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <span className="text-xs text-red-500">{formik.errors.name}</span>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold tracking-wide" style={{ color: "#374151" }}>
              Category image
            </label>

            <div className="flex gap-4 flex-wrap mt-2">
              {preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-28 h-28 rounded-xl object-cover"
                    style={{ border: "1px solid rgba(18,24,31,0.08)" }}
                  />
                  <IconButton
                    size="small"
                    onClick={handleRemoveImage}
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 8px rgba(18,24,31,0.15)",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </div>
              )}

              <label
                htmlFor="image-upload"
                className="w-28 h-28 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors"
                style={{
                  border: `1.5px dashed ${GREEN}`,
                  backgroundColor: GREEN_SOFT,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(21,128,61,0.16)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = GREEN_SOFT)}
              >
                <AddPhotoAlternate sx={{ fontSize: 28, color: GREEN }} />
                <span className="text-xs mt-1 font-medium" style={{ color: GREEN }}>
                  Upload
                </span>
              </label>

              <input
                ref={fileRef}
                id="image-upload"
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <p className="text-xs mt-2" style={{ color: "#8B93A0" }}>
              PNG, JPG or WEBP — recommended 400×400px
            </p>
          </div>

          <div
            className="flex items-center justify-end gap-2.5 pt-5"
            style={{ borderTop: "1px solid rgba(18,24,31,0.06)" }}
          >
            <button
              type="button"
              onClick={() => {
                formik.resetForm();
                handleRemoveImage();
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer"
              style={{ color: "#6B6B6B", borderColor: "rgba(18,24,31,0.12)", backgroundColor: "#fff" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F9FAFB")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saved}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition-all cursor-pointer disabled:opacity-80"
              style={{ backgroundColor: saved ? "#16a34a" : GREEN }}
              onMouseEnter={(e) => {
                if (!saved) e.currentTarget.style.backgroundColor = "#106b32";
              }}
              onMouseLeave={(e) => {
                if (!saved) e.currentTarget.style.backgroundColor = GREEN;
              }}
            >
              {saved ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Saved
                </>
              ) : (
                <>
                  <Save sx={{ fontSize: 16 }} />
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