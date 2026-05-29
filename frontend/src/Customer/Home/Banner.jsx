import React from 'react'
import bannerVideo from '../../assets/missfox.mp4'

const Banner = () => {
  return (
    <div className='w-full relative h-[80vh] overflow-hidden'>

      <video
        className='w-full h-full object-cover'
        muted
        autoPlay
        loop
        playsInline
      >
        <source src={bannerVideo} type="video/mp4" />
      </video>


      <div className='textPart absolute flex flex-col items-center justify-center inset-0 text-white z-20 space-y-3 px-5' >
        <h1 className='text-5xl font-bold'>Aura & Opal</h1>
        <p className='text-slate-400 text-2xl text-center font-semibold'>Experience premium beauty, luxury wellness, and top-class relaxation at one of Cambodia’s finest salons.</p>

        <input className='border-none bg-white rounded-md py-4 w-60 md:w-132 outline-none text-black px-5' type="text" placeholder='search service...' />


      </div>

    </div>
  )
}

export default Banner