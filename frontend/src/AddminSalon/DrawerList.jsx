import React from "react";
import {
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

const DrawerList = ({
  menu = [],
  menu2 = [],
  toggleDrawer,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (item) => {
    if (!item?.path) {
      console.error("Path not found:", item);
      return;
    }

    navigate(item.path);

    if (typeof toggleDrawer === "function") {
      toggleDrawer(false);
    }
  };

  const renderMenuItem = (item, index, totalItems) => {
    const isActive = location.pathname === item.path;

    return (
      <React.Fragment key={item.path || index}>
        <div
          onClick={() => handleClick(item)}
          className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-200
            ${
              isActive
                ? "bg-green-100 text-green-800"
                : "hover:bg-green-50"
            }`}
        >
          <ListItemIcon
            sx={{
              minWidth: 36,
              color: isActive ? "#15803d" : "#6b7280",
            }}
          >
            {isActive && item.activeIcon
              ? item.activeIcon
              : item.icon}
          </ListItemIcon>

          <ListItemText
            primary={item.name}
            primaryTypographyProps={{
              fontSize: "0.875rem",
              fontWeight: isActive ? 600 : 500,
              color: isActive ? "#15803d" : "#374151",
            }}
          />
        </div>

        {index < totalItems - 1 && (
          <Divider sx={{ my: 0.5 }} />
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="h-full">
      <div className="flex flex-col justify-between h-full w-64 bg-white py-5 px-3 border-r border-gray-100">
        
        {/* Main Menu */}
        <nav className="flex flex-col gap-0.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-2">
            Main
          </p>

          {menu.map((item, index) =>
            renderMenuItem(item, index, menu.length)
          )}
        </nav>

        {/* Account Menu */}
        <nav className="flex flex-col gap-0.5">
          <Divider sx={{ my: 1.5 }} />

          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-2">
            Account
          </p>

          {menu2.map((item, index) =>
            renderMenuItem(item, index, menu2.length)
          )}
        </nav>
      </div>
    </div>
  );
};

export default DrawerList;