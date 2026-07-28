import './App.css'
import { ThemeProvider } from '@mui/material'
import { Routes, Route } from 'react-router-dom'

import greenTheme from './theme/greenTheme.js'

import Home from './Customer/Home/Home.jsx'
import SalonDetails from './Customer/Salon/Salon Details/SalonDetails.jsx'
import Bookings from './Customer/Booking/Bookings.jsx'
import Notification from './Customer/Notification/Notification.jsx'
import SalonDashboard from './Seller/SalonDashboard.jsx'
import Navbar from './Customer/Navbar/Navbar.js'
import CustomerRoutes from './Routes/CustomerRoutes.jsx'
import LoginForm from './Auth/LoginForm.jsx'
import Auth from './Auth/Auth.jsx'


function App() {
  return (
    <ThemeProvider theme={greenTheme}>



      <Routes>

        <Route
          path='/salon-dashboard/*'
          element={<SalonDashboard />}
        />

        <Route
          path='/register'
          element={<Auth />}
        />

        <Route
          path='/login'
          element={<Auth />}
        />

        <Route path="*" element={<CustomerRoutes />} />
      </Routes>

    </ThemeProvider>
  )
}

export default App