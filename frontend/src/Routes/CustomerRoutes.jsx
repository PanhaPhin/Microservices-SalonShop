import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Navbar from '../Customer/Navbar/Navbar'
import Home from '../Customer/Home/Home'
import Notification from '../Customer/Notification/Notification'
import Bookings from '../Customer/Booking/Bookings'
import SalonDetails from '../Customer/Salon/Salon Details/SalonDetails'
import SalonDashboard from '../Seller/SalonDashboard'
import NotFound from '../Customer/NotFound/NotFound'

const CustomerRoutes = () => {
  return (
    <div>

      <Navbar />

      <Routes>

        <Route
          path='/'
          element={<Home />}
        />

        <Route
          path='/notifications'
          element={<Notification />}
        />

        <Route
          path='/bookings'
          element={<Bookings />}
        />

        <Route
          path='/salon/:id'
          element={<SalonDetails />}
        />

        <Route
          path='*'
          element={<NotFound />}
        />

      </Routes>

    </div>
  )
}

export default CustomerRoutes