import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { registerUser } from "../Redux/Auth/action";

/* ---------- validation ---------- */
const validationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Use at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
});

/* ---------- styles ---------- */
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

// Keeps the SweetAlert popups consistent with the dark card.
const swalTheme = {
  background: "#0f172a",
  color: "#f1f5f9",
  confirmButtonColor: "#38bdf8",
  confirmButtonText: "OK",
};

/* ---------- component ---------- */
const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
    },
    validationSchema,
    onSubmit: async (values) => {
      const userData = { ...values, username: values.email };

      try {
        await dispatch(registerUser({ data: userData, navigate }));

        await Swal.fire({
          ...swalTheme,
          icon: "success",
          title: "Account created",
          text: "You can now log in with your email and password.",
        });

        formik.resetForm();
        navigate("/login");
      } catch (error) {
        Swal.fire({
          ...swalTheme,
          icon: "error",
          title: "Sign up failed",
          text:
            error.response?.data?.message ||
            "Something went wrong. Please try again.",
        });
      }
    },
  });

  // Shared props for every input
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

  const passwordAdornment = (
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
  );

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", fontWeight: 700, color: "#f8fafc", mb: 1 }}
      >
        Create account
      </Typography>
      <Typography sx={{ textAlign: "center", color: "#94a3b8", mb: 2 }}>
        Sign up to get started
      </Typography>

      <form onSubmit={formik.handleSubmit} noValidate>
        <TextField
          {...getFieldProps("fullName")}
          label="Full name"
          autoComplete="name"
        />

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
          autoComplete="new-password"
          InputProps={{ endAdornment: passwordAdornment }}
        />

        <TextField
          {...getFieldProps("confirmPassword")}
          label="Confirm password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
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
            "Sign up"
          )}
        </Button>
      </form>
    </Box>
  );
};

export default SignupForm;