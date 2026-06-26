import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../Salon/Home/HomePage";
import ServiceTables from "../Salon/Services/ServiceTable";
import CreateServiceForm from "../Salon/Services/CreateServiceForm";
import BookingTables from "../Salon/Booking/BookingTable";
import TransactionTable from "../Salon/Transaction/TransactionTable";
import Category from "../Salon/Category/Category";
import Notification from "../Customer/Notification/Notification";
import Payment from "../Salon/Payment/Payment";
import Profile from "../Salon/Profile/Profile";

const SalonRoutes = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/services" element={<ServiceTables />} />
      <Route path="/add-service" element={<CreateServiceForm />} />
      <Route path="/booking" element={<BookingTables />} />
      <Route path="/category" element={<Category />} />
      <Route path="/transaction" element={<TransactionTable />} />
      <Route path="/notifications" element={<Notification />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/account" element={<Profile />} />
    </Routes>
  );
};

export default SalonRoutes;