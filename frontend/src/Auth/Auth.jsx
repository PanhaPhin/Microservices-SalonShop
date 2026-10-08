import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

import LoginBackground from "./LoginBackground";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

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

const linkButtonSx = {
  ml: 0.5,
  textTransform: "none",
  fontWeight: 600,
  color: "#38bdf8",
  "&:hover": { bgcolor: "rgba(56, 189, 248, 0.1)" },
};

/* ---------- component ---------- */
const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegister = location.pathname === "/register";

  return (
    <LoginBackground>
      <Box sx={cardSx}>
        {isRegister ? <SignupForm /> : <LoginForm />}

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <Button
              size="small"
              sx={linkButtonSx}
              onClick={() => navigate(isRegister ? "/login" : "/register")}
            >
              {isRegister ? "Log in" : "Sign up"}
            </Button>
          </Typography>
        </Box>
      </Box>
    </LoginBackground>
  );
};

export default Auth;