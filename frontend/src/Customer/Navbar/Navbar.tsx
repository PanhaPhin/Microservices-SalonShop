import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


import {
  AccountCircle,
  NotificationsActive,
} from "@mui/icons-material";

import {
  Avatar,
  Badge,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import { getUser, logout } from "../../Redux/Auth/action";

const Navbar = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { auth } = useSelector((store: any) => store);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const allowedDashboardRoles = ["SALON_OWNER", "ADMIN"];
  const canAccessDashboard = allowedDashboardRoles.includes(auth.user?.role);

  const open = Boolean(anchorEl);

  // adjust this if your role field is named differently
  const isSalonOwner = auth.user?.role === "SALON_OWNER";

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    if (jwt) {
      dispatch(getUser(jwt));
    }
  }, [dispatch]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());

    localStorage.removeItem("jwt");

    handleClose();

    navigate("/login");
  };

  return (
    <div className="z-50 flex items-center justify-between px-6 py-3 shadow-md">
      {/* Left */}
      <div className="flex items-center gap-10">
        <h1
          onClick={() => navigate("/")}
          className="cursor-pointer text-2xl font-bold"
        >
          salon phnom penh
        </h1>

        <Button onClick={() => navigate("/")}>Home</Button>

        {canAccessDashboard && (
          <Button onClick={() => navigate("/salon-dashboard")}>
            Salon Dashboard
          </Button>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {!canAccessDashboard && (
          <Button variant="outlined" onClick={() => navigate("/become-partner")}>
            Become Partner
          </Button>
        )}

        <IconButton onClick={() => navigate("/notifications")}>
          <Badge badgeContent={5} color="primary">
            <NotificationsActive color="primary" />
          </Badge>
        </IconButton>

        {auth.user ? (
          <>
            <span className="font-semibold">{auth.user.fullName}</span>

            <IconButton onClick={handleClick}>
              <Avatar>
                {auth.user.fullName ? auth.user.fullName.charAt(0).toUpperCase() : "U"}
              </Avatar>
            </IconButton>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem
                onClick={() => {
                  navigate("/profile");
                  handleClose();
                }}
              >
                My Profile
              </MenuItem>

              <MenuItem
                onClick={() => {
                  navigate("/bookings");
                  handleClose();
                }}
              >
                My Bookings
              </MenuItem>

              {isSalonOwner && (
                <MenuItem
                  onClick={() => {
                    navigate("/salon-dashboard");
                    handleClose();
                  }}
                >
                  Salon Dashboard
                </MenuItem>
              )}

              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <IconButton onClick={() => navigate("/login")}>
            <AccountCircle
              sx={{
                fontSize: 45,
                color: "green",
              }}
            />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default Navbar;