import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../Redux/Auth/action";

/* ---------- validation ---------- */
const validationSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Use at least 6 characters")
    .required("Password is required"),
});

/* ---------- styles ---------- */
const cardSx = {
  p: { xs: 3, sm: 4.5 },
  borderRadius: 4,
  bgcolor: "rgba(15, 23, 42, 0.72)",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  boxShadow: "0 24px 60px rgba(0, 0, 0, 0.45)",
};

const fieldSx = {
  "& .MuiInputLabel-root": { color: "#94a3b8" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#38bdf8" },
  "& .MuiOutlinedInput-root": {
    color: "#f1f5f9",
    borderRadius: 2.5,
    bgcolor: "rgba(2, 6, 23, 0.45)",
    "& fieldset": { borderColor: "rgba(148, 163, 184, 0.25)" },
    "&:hover fieldset": { borderColor: "rgba(148, 163, 184, 0.5)" },
    "&.Mui-focused fieldset": { borderColor: "#38bdf8" },
  },
};

const buttonSx = {
  mt: 3,
  py: 1.4,
  borderRadius: 2.5,
  fontSize: 16,
  fontWeight: 600,
  textTransform: "none",
  color: "#04111f",
  background: "linear-gradient(90deg, #38bdf8, #a78bfa)",
  boxShadow: "0 8px 24px rgba(56, 189, 248, 0.3)",
  transition: "transform .2s, box-shadow .2s",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 12px 30px rgba(56, 189, 248, 0.45)",
  },
  "&.Mui-disabled": { color: "rgba(4, 17, 31, 0.6)", opacity: 0.7 },
};

/* ---------- component ---------- */
const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ open: false, severity: "success" });

  const closeToast = () => setToast((prev) => ({ ...prev, open: false }));

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(loginUser({ data: values, navigate }));
        setToast({ open: true, severity: "success" });
      } catch (error) {
        console.error(error);
        setToast({ open: true, severity: "error" });
      }
    },
  });

  // Shared props for both inputs
  const getFieldProps = (name) => ({
    name,
    fullWidth: true,
    margin: "normal",
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched[name] && Boolean(formik.errors[name]),
    helperText: formik.touched[name] && formik.errors[name],
    sx: fieldSx,
  });

  return (
    <Box sx={cardSx}>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", fontWeight: 700, color: "#f8fafc", mb: 1 }}
      >
        Welcome back
      </Typography>
      <Typography sx={{ textAlign: "center", color: "#94a3b8", mb: 3 }}>
        Log in to your account
      </Typography>

      <form onSubmit={formik.handleSubmit} noValidate>
        <TextField
          {...getFieldProps("email")}
          label="Email address"
          type="email"
          autoComplete="email"
        />

        <TextField
          {...getFieldProps("password")}
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  sx={{ color: "#94a3b8" }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={formik.isSubmitting}
          sx={buttonSx}
        >
          {formik.isSubmitting ? (
            <CircularProgress size={22} sx={{ color: "#04111f" }} />
          ) : (
            "Log in"
          )}
        </Button>
      </form>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={toast.severity} variant="filled" onClose={closeToast}>
          {toast.severity === "success"
            ? "Logged in successfully"
            : "Login failed. Check your email and password."}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginForm;