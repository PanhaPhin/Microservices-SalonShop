import { Dashboard } from '@mui/icons-material'
import React from 'react'


const menu=[
    {
        name:"Dashboard",
        path:"/salon-dashboard",
        icon: <Dashboard className='text-primary-color' />,
        activeIcon:<Dashboard className='text-secondary-color' />

    },

    {
        name:"Booking",
        path:"/salon-dashboard/bookings",
        icon: <Dashboard className='text-primary-color' />,
        activeIcon:<Dashboard className='text-secondary-color' />

    },
    {
        name:"Dashboard",
        path:"/salon-dashboard",
        icon: <Dashboard className='text-primary-color' />,
        activeIcon:<Dashboard className='text-secondary-color' />

    },
    {
        name:"",
        path:"",
        icon: "",
        activeIcon:""

    },
    {
        name:"Dashboard",
        path:"/salon-dashboard",
        icon: <Dashboard className='text-primary-color' />,
        activeIcon:<Dashboard className='text-secondary-color' />

    }
]


const SalonDrawerList = () => {
  return (
    <div>
      SalonDrawerList
    </div>
  )
}

export default SalonDrawerList
