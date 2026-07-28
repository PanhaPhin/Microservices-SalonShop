import React, { useState } from "react";

import {
  Button,
  TextField,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

import { useFormik } from "formik";
import * as Yup from "yup";

import { useDispatch } from "react-redux";
import { loginUser } from "../Redux/Auth/action";

import { useNavigate } from "react-router-dom";


const LoginForm = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);


  const formik = useFormik({

    initialValues: {
      email: "",
      password: "",
    },


    validationSchema: Yup.object({

      email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),


      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),

    }),


    onSubmit: async (values) => {

      try {

        await dispatch(
          loginUser({
            data: values,
            navigate,
          })
        );


        setOpenSuccess(true);


      } catch (error) {

        console.log(error);

        setOpenError(true);

      }

    }

  });



  return (

    <Box>


      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontWeight: 700,
          mb: 1,
        }}
      >
        Welcome Back
      </Typography>



      <Typography
        sx={{
          textAlign: "center",
          color: "text.secondary",
          mb: 3,
        }}
      >
        Login to your account
      </Typography>




      <form onSubmit={formik.handleSubmit}>


        <TextField

          fullWidth

          margin="normal"

          label="Email Address"

          name="email"

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

          fullWidth

          margin="normal"

          label="Password"

          type="password"

          name="password"

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



        <Button

          type="submit"

          fullWidth

          variant="contained"

          sx={{

            mt: 3,

            py: 1.3,

            borderRadius: 3,

            fontWeight: 600,

            textTransform: "none",

            fontSize: "16px",

          }}

        >

          Login

        </Button>


      </form>





      <Snackbar

        open={openSuccess}

        autoHideDuration={3000}

        onClose={() => setOpenSuccess(false)}

        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}

      >

        <Alert

          severity="success"

          variant="filled"

          onClose={() => setOpenSuccess(false)}

        >

          Login Successfully 🎉

        </Alert>


      </Snackbar>





      <Snackbar

        open={openError}

        autoHideDuration={3000}

        onClose={() => setOpenError(false)}

        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}

      >

        <Alert

          severity="error"

          variant="filled"

          onClose={() => setOpenError(false)}

        >

          Login Failed ❌

        </Alert>


      </Snackbar>


    </Box>

  );

};


export default LoginForm;