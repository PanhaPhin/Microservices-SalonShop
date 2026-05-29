import React from 'react'

const SalonDetail= () => {
  return (
    <div className='p-4 mb-20'>

      <section className='grid grid-cols-3 gap-3 auto-rows-[220px]'>

        {/* Large Image */}
        <div className='col-span-2 row-span-2 overflow-hidden rounded-3xl group'>
          <img
            className='w-full h-full object-cover group-hover:scale-110 duration-500'
            src="https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt=""
          />
        </div>

        {/* Top Right */}
        <div className='overflow-hidden rounded-3xl group'>
          <img
            className='w-full h-full object-cover group-hover:scale-110 duration-500'
            src="https://images.pexels.com/photos/7755651/pexels-photo-7755651.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt=""
          />
        </div>

        {/* Bottom Right */}
        <div className='overflow-hidden rounded-3xl group'>
          <img
            className='w-full h-full object-cover group-hover:scale-110 duration-500'
            src="https://images.pexels.com/photos/853427/pexels-photo-853427.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt=""
          />
        </div>

      </section>

      <section className=''>
        <h1 className='font-bold text-3xl'>
         Chan Salon
        </h1>
        <p>Sen Sok , Phnom Penh</p>
        <strong>

        </strong>
        Timing: 10:00:00 To 21:30:00

      </section>


    </div>
  )
}

export default SalonDetail