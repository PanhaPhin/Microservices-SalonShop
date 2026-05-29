import React from 'react'
import { Card } from '@mui/material'
import { NotificationsActive } from '@mui/icons-material'

const NotificationCard = () => {
  const services = ['hair cut', 'shaving', 'massage', 'hair wash', 'beard trim']

  return (
    <Card
      sx={{ bgcolor: '#EAF0F1' }}
      className="cursor-pointer p-5 flex items-center gap-5"
    >
      <NotificationsActive />

      <div>
        <p className="text-sm text-gray-600">
          Your booking got confirmed
        </p>

        <div className="flex flex-wrap gap-2 mt-1">
          {services.map((item, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white rounded text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default NotificationCard