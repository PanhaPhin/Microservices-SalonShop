import React from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Box, Paper, Typography } from "@mui/material";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegister = location.pathname === "/register";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: 420,
          borderRadius: 4,
          p: 4,
        }}
      >
        {isRegister ? (
          <>
            <SignupForm />

            <Box
              sx={{
                textAlign: "center",
                mt: 3,
              }}
            >
              <Typography variant="body2">
                Already have an account?
                <Button
                  size="small"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <LoginForm />

            <Box
              sx={{
                textAlign: "center",
                mt: 3,
              }}
            >
              <Typography variant="body2">
                Don't have an account?
                <Button
                  size="small"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </Button>
              </Typography>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Auth;