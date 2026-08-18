import React from "react";
import DrawerList from "../../../AddminSalon/DrawerList";

import {
  AccountBox,
  Dashboard,
  Inventory,
  NotificationsNone,
  Receipt,
  ShoppingBag,
  Add,
  Category,
  Notifications,
  Payments,
  Settings,
} from "@mui/icons-material";

const menu = [
  {
    name: "Dashboard",
    path: "/salon-dashboard",
    icon: <Dashboard />,
    activeIcon: <Dashboard color="primary" />,
  },
  {
    name: "Bookings",
    path: "/salon-dashboard/booking",
    icon: <ShoppingBag />,
    activeIcon: <ShoppingBag color="primary" />,
  },
  {
    name: "Services",
    path: "/salon-dashboard/services",
    icon: <Inventory />,
    activeIcon: <Inventory color="primary" />,
  },
  {
    name: "Add Service",
    path: "/salon-dashboard/add-service",
    icon: <Add />,
    activeIcon: <Add color="primary" />,
  },
  {
    name: "Payment",
    path: "/salon-dashboard/payment",
    icon: <Payments />,
    activeIcon: <Payments color="primary" />,
  },
  {
    name: "Transactions",
    path: "/salon-dashboard/transaction",
    icon: <Receipt />,
    activeIcon: <Receipt color="primary" />,
  },
  {
    name: "Category",
    path: "/salon-dashboard/category",
    icon: <Category />,
    activeIcon: <Category color="primary" />,
  },
  {
    name: "Notifications",
    path: "/salon-dashboard/notifications",
    icon: <NotificationsNone />,
    activeIcon: <Notifications color="primary" />,
  },
];

const menu2 = [
  {
    name: "Account",
    path: "/salon-dashboard/account",
    icon: <AccountBox />,
    activeIcon: <AccountBox color="primary" />,
  },

   {
    name: "Settings",
    path: "/salon-dashboard/setting",
    icon: <Settings />,
    activeIcon: <Settings color="primary" />,
  },
  {
    name: "Logout",
    path: "/",
    icon: <Receipt />,
    activeIcon: <Receipt />,
  },
];

const SalonDrawerList = ({ toggleDrawer }) => {
  return (
    <DrawerList
      menu={menu}
      menu2={menu2}
      toggleDrawer={toggleDrawer}
    />
  );
};

export default SalonDrawerList;