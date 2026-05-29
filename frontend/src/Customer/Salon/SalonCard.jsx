import React from 'react'
import StartIcon from '@mui/icons-material/Star'
import { useNavigate } from 'react-router-dom'

const SalonCard = () => {
    const navigate=useNavigate();
  return (
    <div onClick={()=>navigate("/salon/2") } className='cursor-pointer'>
        <div className='w-56 md:w-80 rounded-md bg-slate=100'>
            <img className='w-full h-60 object-cover rounded-t-md' src="https://images.pexels.com/photos/3993323/pexels-photo-3993323.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
            <div className='p-5 space-y-2'>
                <h1>Dara salon</h1>
                <div className='text-white text-sm p-1 bg-green-700 rounded-full w-14 flex items-center justify-center gap-1'>
                    4.5<StartIcon sx={{fontSize:"16px"}}/>
                </div>
                <p>Professional haircut and ...</p>
                <p>sen sok, Phnom Penh</p>

            </div>
            

        </div>
     
    </div>
  )
}

export default SalonCard
