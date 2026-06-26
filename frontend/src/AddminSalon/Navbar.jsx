import React, { useState } from "react";
import {
  IconButton,
  Badge,
  Drawer,
} from "@mui/material";
import {
  NotificationsActive,
  Menu,
} from "@mui/icons-material";

const Navbar = ({ DrawerComponent }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-[70px] flex items-center justify-between px-5 bg-white border-b shadow-sm">
      <div className="flex items-center gap-3">
        <IconButton onClick={() => setOpen(true)}>
          <Menu color="primary" />
        </IconButton>

        <h1 className="text-xl font-bold text-green-700">
          Salon Booking
        </h1>
      </div>

      <IconButton>
        <Badge badgeContent={3} color="error">
          <NotificationsActive color="primary" />
        </Badge>
      </IconButton>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
      >
        {DrawerComponent && (
          <DrawerComponent toggleDrawer={setOpen} />
        )}
      </Drawer>
    </div>
  );
};

export default Navbar;