import React from 'react'
import { IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'

function SelectedServiceList() {
  return (
    <div className='py-5 space-y-3'>

      {[1, 1, 1, 1, 1, 1].map((item, index) => (
        <div
          key={index}
          className='py-3 px-4 rounded-md bg-slate-100 flex justify-between items-center'
        >

          {/* LEFT SIDE */}
          <div>
            <h1 className='font-medium'>
              Man Beard
            </h1>

            <p className='text-sm text-gray-500'>
              45 mins
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className='flex items-center gap-2'>

            <p className='font-semibold text-sm'>
              100000KHR
            </p>

            <IconButton size='small'>
              <Close fontSize='small' />
            </IconButton>

          </div>

        </div>
      ))}

    </div>
  )
}

export default SelectedServiceList