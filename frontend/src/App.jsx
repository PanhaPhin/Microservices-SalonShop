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

function App() {
  return (
    <ThemeProvider theme={greenTheme}>

    

      <Routes>

        <Route
          path='/salon-dashboard/*'
          element={<SalonDashboard />}
        /> 
        <Route path="*" element={<CustomerRoutes />} /> 
      </Routes>

    </ThemeProvider>
  )
}

export default App