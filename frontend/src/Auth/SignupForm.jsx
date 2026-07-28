import React from "react";
import {
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { registerUser } from "../Redux/Auth/action";

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
    },

    validationSchema: Yup.object({
      fullName: Yup.string().required("Full Name is required"),

      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      const userData = {
        ...values,
        username: values.email,
      };

      try {
        await dispatch(
          registerUser({
            data: userData,
            navigate,
          })
        );

        await Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Your account has been created successfully.",
          confirmButtonText: "OK",
        });

        formik.resetForm();

        navigate("/login");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text:
            error.response?.data?.message ||
            "Something went wrong. Please try again.",
          confirmButtonText: "OK",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Typography align="center" variant="h5" sx={{ mb: 2 }}>
        Sign Up
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <TextField
          margin="normal"
          fullWidth
          name="fullName"
          label="Full Name"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.fullName &&
            Boolean(formik.errors.fullName)
          }
          helperText={
            formik.touched.fullName &&
            formik.errors.fullName
          }
        />

        <TextField
          margin="normal"
          fullWidth
          name="email"
          label="Email Address"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.email &&
            Boolean(formik.errors.email)
          }
          helperText={
            formik.touched.email &&
            formik.errors.email
          }
        />

        <TextField
          margin="normal"
          fullWidth
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.password &&
            Boolean(formik.errors.password)
          }
          helperText={
            formik.touched.password &&
            formik.errors.password
          }
        />

        <TextField
          margin="normal"
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword &&
            formik.errors.confirmPassword
          }
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
    </Container>
  );
};

export default SignupForm;