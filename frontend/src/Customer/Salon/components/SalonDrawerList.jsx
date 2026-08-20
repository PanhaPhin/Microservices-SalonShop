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
  Business,
  Logout,
  CalendarMonth,
  EventAvailable,
  Group,
  AccessTime,
  People,
  Reviews,
  LocalOffer,
  Assessment,
  Inventory2,
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
    name: "Calendar",
    path: "/salon-dashboard/calendar",
    icon: <CalendarMonth />,
    activeIcon: <CalendarMonth color="primary" />,
  },
  {
    name: "Booking Requests",
    path: "/salon-dashboard/booking-requests",
    icon: <EventAvailable />,
    activeIcon: <EventAvailable color="primary" />,
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
    name: "Category",
    path: "/salon-dashboard/category",
    icon: <Category />,
    activeIcon: <Category color="primary" />,
  },
  {
    name: "Packages",
    path: "/salon-dashboard/packages",
    icon: <Inventory2 />,
    activeIcon: <Inventory2 color="primary" />,
  },


  {
    name: "Branches",
    path: "/salon-dashboard/branch",
    icon: <Business />,
    activeIcon: <Business color="primary" />,
  },
  {
    name: "Staff",
    path: "/salon-dashboard/staff",
    icon: <Group />,
    activeIcon: <Group color="primary" />,
  },
  {
    name: "Working Hours",
    path: "/salon-dashboard/working-hours",
    icon: <AccessTime />,
    activeIcon: <AccessTime color="primary" />,
  },

  {
    name: "Customers",
    path: "/salon-dashboard/customers",
    icon: <People />,
    activeIcon: <People color="primary" />,
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
    name: "Reports",
    path: "/salon-dashboard/reports",
    icon: <Assessment />,
    activeIcon: <Assessment color="primary" />,
  },


  {
    name: "Reviews",
    path: "/salon-dashboard/reviews",
    icon: <Reviews />,
    activeIcon: <Reviews color="primary" />,
  },
  {
    name: "Offers",
    path: "/salon-dashboard/offers",
    icon: <LocalOffer />,
    activeIcon: <LocalOffer color="primary" />,
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
    icon: <Logout />,
    activeIcon: <Logout />,
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