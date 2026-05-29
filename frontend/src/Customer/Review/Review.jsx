import React from 'react'
import ReviewCard from './ReviewCard'
import { Divider } from '@mui/material'
import RatingCard from './RatingCard'

const Review = () => {
  return (
    <div className='pt-10'>

      <div className='pb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Customer Reviews
        </h1>

        <p className='text-gray-500 mt-1'>
          See what customers say about this salon
        </p>
      </div>


      <div className='flex flex-col lg:flex-row gap-8'>

     
        <section className='w-full lg:w-[35%]'>
          <div className='sticky top-24'>
            <RatingCard />
          </div>
        </section>

       
        <section className='w-full lg:w-[65%]'>

          <div className='bg-white border rounded-2xl p-5 shadow-sm'>

            <div className='flex items-center justify-between pb-5'>
              <h2 className='font-semibold text-lg'>
                All Reviews
              </h2>

              <p className='text-sm text-gray-500'>
                324 Reviews
              </p>
            </div>

            <div className='space-y-5'>
              {[1,1,1,1,1,1,1].map((item, index) => (
                <div key={index} className='space-y-4'>
                  <ReviewCard />
                  {index !== 6 && <Divider />}
                </div>
              ))}
            </div>

          </div>

        </section>

      </div>

    </div>
  )
}

export default Review