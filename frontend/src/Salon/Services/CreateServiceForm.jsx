import { useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const CATEGORIES = ["Hair Care", "Shaving", "Massage", "Facial", "Hair Coloring"];
const DURATIONS = [15, 30, 45, 60, 90];

const validationSchema = Yup.object({
  serviceName: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  category: Yup.string().required("Required"),
  price: Yup.number().required("Required").positive("Must be greater than 0"),
  duration: Yup.number().required("Required").positive("Required"),
});

function Field({ label, error, touched, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-800 tracking-wide">{label}</label>
      {children}
      {touched && error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

export default function CreateServiceForm() {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef();

  const formik = useFormik({
    initialValues: { serviceName: "", description: "", category: "", price: "", duration: "" },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      console.log({ ...values, image });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        resetForm();
        setPreview(null);
        setImage(null);
      }, 2000);
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

  const inputClass = (field) =>
    `w-full px-3 py-2 text-sm rounded-lg border bg-white outline-none transition-all
     placeholder:text-gray-400 text-gray-900
     focus:ring-2 focus:ring-green-700/10 focus:border-green-700
     ${formik.touched[field] && formik.errors[field] ? "border-red-400" : "border-gray-200"}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex">

        {/* Left: Poster panel */}
        <aside className="w-56 flex-shrink-0 bg-green-50 border-r border-gray-200 flex flex-col">
          <div className="flex-1 flex items-center justify-center min-h-56 relative overflow-hidden">
            {preview ? (
              <div className="relative w-full h-full group min-h-56">
                <img src={preview} alt="preview" className="w-full h-full object-cover absolute inset-0" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2.5">
                  <button type="button" onClick={removeImage}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 text-white text-xs font-medium rounded-md cursor-pointer">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label htmlFor="service-image"
                className="flex flex-col items-center justify-center gap-3 p-8 w-full h-full cursor-pointer hover:bg-green-100/60 transition-colors text-center">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-700">
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <rect x="3" y="6" width="26" height="20" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="11" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3 22l7-6 5 4 4-3 10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                ${parseFloat(formik.values.price).toFixed(2)}
              </p>
            )}
            {formik.values.duration && (
              <p className="mt-1 text-xs text-gray-500">{formik.values.duration} min session</p>
            )}
          </div>
        </aside>

        {/* Right: Form */}
        <main className="flex-1 flex flex-col p-8 gap-6 min-w-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Add New Service</h1>
            <p className="text-sm text-gray-500 mt-1">Create a service for your booking catalog.</p>
          </div>

          <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Service name" error={formik.errors.serviceName} touched={formik.touched.serviceName}>
                <input className={inputClass("serviceName")} name="serviceName" placeholder="e.g. Classic Haircut"
                  value={formik.values.serviceName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              </Field>

              <Field label="Category" error={formik.errors.category} touched={formik.touched.category}>
                <div className="relative">
                  <select name="category" value={formik.values.category}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className={`${inputClass("category")} pr-8 appearance-none cursor-pointer`}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (USD)" error={formik.errors.price} touched={formik.touched.price}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium pointer-events-none">$</span>
                  <input type="number" name="price" placeholder="0.00" min="0" step="0.01"
                    value={formik.values.price} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className={`${inputClass("price")} pl-6`} />
                </div>
              </Field>

              <Field label="Duration" error={formik.errors.duration} touched={formik.touched.duration}>
                <div className="flex gap-1.5 flex-wrap">
                  {DURATIONS.map(d => (
                    <button key={d} type="button"
                      onClick={() => formik.setFieldValue("duration", d)}
                      onBlur={() => formik.setFieldTouched("duration", true)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer
                        ${formik.values.duration === d
                          ? "bg-green-700 text-white border-green-700"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-green-700 hover:text-green-700"}`}>
                      {d}m
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <Field label="Description" error={formik.errors.description} touched={formik.touched.description}>
              <textarea name="description" rows={4} placeholder="Describe what's included in this service…"
                value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className={`${inputClass("description")} resize-none leading-relaxed`} />
            </Field>

            <input ref={fileRef} id="service-image" type="file" accept="image/*" className="hidden" onChange={handleImage} />

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
              <button type="button"
                onClick={() => { formik.resetForm(); setPreview(null); setImage(null); }}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={submitted}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition-all cursor-pointer disabled:opacity-75
                  ${submitted ? "bg-green-600" : "bg-green-700 hover:bg-green-800"}`}>
                {submitted ? (
                  <><svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>Saved</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M2 10V13h3l7-7-3-3-7 7zM13 4l-1-1-1 1 1 1 1-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>Add Service</>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}