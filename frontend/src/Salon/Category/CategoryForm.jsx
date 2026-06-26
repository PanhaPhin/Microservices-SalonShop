import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import {
  AddPhotoAlternate,
  Close,
  Save,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Category name is required")
    .min(2, "Minimum 2 characters"),
});

export default function CategoryForm() {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();

      formData.append("name", values.name);

      if (image) {
        formData.append("image", image);
      }

      console.log("Form Values:", values);
      console.log("Image:", image);

      // API Call Here
      // axios.post('/api/categories', formData)
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
  };

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-2xl rounded-2xl">
        <CardContent className="p-6">
          <Typography variant="h5" fontWeight={700}>
            Create Category
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Add a new category for your salon services.
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-5">
              <TextField
                fullWidth
                id="name"
                label="Category Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.name &&
                  Boolean(formik.errors.name)
                }
                helperText={
                  formik.touched.name &&
                  formik.errors.name
                }
              />

              <div>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 2 }}
                >
                  Category Image
                </Typography>

                <div className="flex gap-4 flex-wrap">
                  {preview && (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-28 h-28 rounded-xl object-cover border"
                      />

                      <IconButton
                        size="small"
                        onClick={handleRemoveImage}
                        className="!absolute !-top-2 !-right-2 bg-white shadow"
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </div>
                  )}

                  <label
                    htmlFor="image-upload"
                    className="w-28 h-28 border-2 border-dashed border-green-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-green-50"
                  >
                    <AddPhotoAlternate
                      sx={{
                        fontSize: 32,
                        color: "#15803d",
                      }}
                    />
                    <span className="text-xs mt-1">
                      Upload
                    </span>
                  </label>

                  <input
                    id="image-upload"
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => formik.resetForm()}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  sx={{
                    backgroundColor: "#15803d",
                    "&:hover": {
                      backgroundColor: "#166534",
                    },
                  }}
                >
                  Save Category
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}