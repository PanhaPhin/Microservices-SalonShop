import React from 'react'
import SalonCard from './SalonCard'

const SalonList = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
      {[1,1,1,1,1,1,1].map((item, index) => (
        <SalonCard key={index} />
      ))}
    </div>
  )
}

export default SalonList