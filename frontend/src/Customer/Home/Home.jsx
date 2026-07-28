import React from 'react';
import Banner from './Banner';
import HomeServiceCard from './HomeServiceCard';
import services from '../../Data/services';
import SalonList from '../Salon/SalonList';


const Home = () => {
  return (
    <div className='space-y-20'>


      <section>
        {/* <Navbar /> */}
        <Banner />
      </section>
      <section className='space-y-10 lg:space-y-0 lg:flex items-center gap-5 px-20'>
        <div className='w-full lg:w-1/2'>
          <h1 className='text-2xl font-semibold pb-3'>
            What are you looking for today?
          </h1>

          <div className='flex flex-wrap justify-center items-center gap-5'>
            {
              services.map((item) => <HomeServiceCard key={item.id} item={item} />)
            }
          </div>



        </div>
        <div className='w-full lg:w-1/2 rounded-xl p-2 grid grid-cols-2 gap-3 auto-rows-[300px]'>

          <img
            className='w-full h-full rounded-xl object-cover hover:scale-105 duration-300'
            src="https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="spa treatment"
          />

          <img
            className='w-full h-full rounded-xl object-cover hover:scale-105 duration-300'
            src="https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="hair salon styling"
          />

          <img
            className='w-full h-full rounded-xl object-cover hover:scale-105 duration-300'
            src="https://images.pexels.com/photos/374148/pexels-photo-374148.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="nail care service"
          />

          <img
            className='w-full h-full rounded-xl object-cover hover:scale-105 duration-300'
            src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="massage therapy"
          />

        </div>

      </section>

      <section className='px-20'>
        <h1 className='text-3xl font-bold pb-10'>Book your favorite salon</h1>
        <SalonList />
      </section>

    </div>
  )
}

export default Home
