import { ArrowRightAlt } from '@mui/icons-material'
import { Button, Chip } from '@mui/material'
import React from 'react'

const BookingCard = () => {
  return (
    <div className='bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 md:flex items-center justify-between gap-6'>

    
      <div className='flex items-start gap-4 w-full'>

      
        <img
          src="https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg"
          alt="salon"
          className='w-24 h-24 rounded-xl object-cover'
        />

      
        <div className='space-y-2'>

          <h1 className='text-xl font-bold text-gray-900'>
            Monika Salon
          </h1>

          
          <div className='flex flex-wrap gap-2 text-sm text-gray-600'>
            <span className='bg-gray-100 px-2 py-1 rounded-full'>Hair Cut</span>
            <span className='bg-gray-100 px-2 py-1 rounded-full'>Massage</span>
            <span className='bg-gray-100 px-2 py-1 rounded-full'>Hair Color</span>
          </div>

      
          <div className='text-sm text-gray-500 space-y-1 pt-1'>

            <p className='flex items-center gap-2'>
              <span className='font-medium text-gray-700'>Date:</span>
              <ArrowRightAlt fontSize="small" />
              2026-02-12
            </p>

            <p>
              12:00 PM - 12:45 PM
            </p>

          </div>

        </div>
      </div>

    
      <div className='flex md:flex-col items-center md:items-end justify-between gap-4 mt-4 md:mt-0'>

        
        <Chip
          label="$10"
          color="success"
          variant="outlined"
        />

    
        <Button
          variant='contained'
          color='error'
          size='small'
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600
          }}
        >
          Cancelled
        </Button>

      </div>

    </div>
  )
}

export default BookingCard