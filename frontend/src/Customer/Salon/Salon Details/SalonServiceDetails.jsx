import React, { useState } from 'react'
import CategoryCard from './CategoryCard'
import ServiceCard from './ServiceCard'
import SelectedServiceList from './SelectedServiceList'

import { Divider, Button } from '@mui/material'
import { ShoppingCart } from '@mui/icons-material'

const SalonServiceDetails = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const handleCategoryClick = (category) => {
    return () => {
      setSelectedCategory(category)
    }
  }

  const categories = [1, 1, 1, 1, 1]

  return (
    <div className='lg:flex gap-5 h-[90vh] mt-10'>

      {/* LEFT SIDE - CATEGORY */}
      <section className='space-y-5 border-r lg:w-[25%] pr-5'>
        {categories.map((item, index) => (
          <CategoryCard
            key={index}
            item={index}
            selectedCategory={selectedCategory}
            handleCategoryClick={handleCategoryClick(index)}
          />
        ))}
      </section>

      {/* MIDDLE - SERVICES */}
      <section className='space-y-2 lg:w-[50%] px-5 lg:px-20 overflow-y-auto'>
        {[1, 1, 1, 1, 1, 1, 1, 1].map((item, index) => (
          <div key={index}>
            <ServiceCard />
            <Divider />
          </div>
        ))}
      </section>

   
      <section className='lg:w-[25%]'>

        <div className='border rounded-md p-5 space-y-4'>

      
          <div className='flex items-center gap-2'>
            <ShoppingCart />
            <h1 className='font-thin text-sm'>
              Selected Service
            </h1>
          </div>

       
          <SelectedServiceList />

     
          <Button
            fullWidth
            variant="contained"
            sx={{ py: ".7rem" }}
          >
            Book Now
          </Button>

        </div>

      </section>

    </div>
  )
}

export default SalonServiceDetails