import { FiberManualRecord } from '@mui/icons-material'
import { Button } from '@mui/material'
import React from 'react'

const ServiceCard = () => {
  return (
    <div className='w-full border rounded-lg p-3 shadow-sm'>
      <div className='flex items-center justify-between gap-5'>

        {/* Left content */}
        <div className='space-y-1 w-[60%]'>
          <h1 className='text-2xl font-semibold'>Man Beard</h1>
          <p className='text-gray-500 text-sm'>stylish man beard</p>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <p>10$</p>
            <FiberManualRecord sx={{ fontSize: "8px", color: 'gray' }} />
            <p>45 mins</p>
          </div>
        </div>

        {/* Right content */}
        <div className='flex flex-col items-center gap-2'>
          <img
            src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
            alt="service"
            className="w-20 h-20 rounded-md object-cover"
          />

          <Button variant="outlined" size="small">
            Add
          </Button>
        </div>

      </div>
    </div>
  )
}

export default ServiceCard