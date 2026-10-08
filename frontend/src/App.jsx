import './App.css'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ThemeProvider } from '@mui/material'
import { Routes, Route } from 'react-router-dom'

import greenTheme from './theme/greenTheme.js'

import Home from './Customer/Home/Home.jsx'
import SalonDetails from './Customer/Salon/Salon Details/SalonDetails.jsx'
import Bookings from './Customer/Booking/Bookings.jsx'
import Notification from './Customer/Notification/Notification.jsx'
import SalonDashboard from './Seller/SalonDashboard.jsx'
import CustomerRoutes from './Routes/CustomerRoutes.jsx'
import Auth from './Auth/Auth.jsx'
import BecomePartner from './Salon/BecomePartner/BecomePartner.jsx'
import ProtectedRoute from './Routes/ProtectedRoute.jsx'

import { getUser } from './Redux/Auth/action'

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    if (jwt) {
      dispatch(getUser(jwt));
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={greenTheme}>
      <Routes>

        <Route path="/register" element={<Auth />} />

        <Route path="/login" element={<Auth />} />

        <Route path="/become-partner" element={<BecomePartner />} />

        <Route
          path="/salon-dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["SALON_OWNER", "ADMIN"]}>
              <SalonDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<CustomerRoutes />} />

      </Routes>
    </ThemeProvider>
  );
}

export default App;