import React from 'react'
import NotificationCard from './NotificationCard'

const Notification = () => {
  return (
    <div className="px-5 flex flex-col items-center mt-10 min-h-screen">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold py-5">
          Notifications
        </h1>

        <div className="space-y-4">
          <NotificationCard />
        
        </div>
      </div>
    </div>
  )
}

export default Notification