import React, { useState } from 'react'
import { Button, Divider } from '@mui/material'
import SalonDetail from './SalonDetail'
import SalonServiceDetails from './SalonServiceDetails'
import Review from '../../Review/Review'
import CreateReviewForm from '../../Review/CreateReviewForm'

const tabs = [
    { name: "All services" },
    { name: "Reviews" },
    { name: "Create Review" }
]

const SalonDetails = () => {

    const [activeTab, setActiveTab] = useState(tabs[0])

    const handleActiveTab = (tab) => () => {
        setActiveTab(tab)
    }

    return (
        <div className='px-5 lg:px-20'>

            {/* Salon header */}
            <SalonDetail />

            {/* Tabs */}
            <div className='space-y-4 mt-5'>

                <div className='flex gap-4 flex-wrap'>
                    {tabs.map((tab) => (
                        <Button
                            key={tab.name}
                            onClick={handleActiveTab(tab)}
                            variant={tab.name === activeTab.name ? "contained" : "outlined"}
                        >
                            {tab.name}
                        </Button>
                    ))}
                </div>

                <Divider />

            </div>


            <div className='py-5'>

                {activeTab.name === "Create Review" ? (

                   <CreateReviewForm/>

                ) : activeTab.name === "Reviews" ? (

                    <Review />

                ) : (

                    <SalonServiceDetails />

                )}

            </div>

        </div>
    )
}

export default SalonDetails