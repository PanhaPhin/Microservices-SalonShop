import React from "react";
import NotificationCard from "./NotificationCard";

const Notification = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Notifications
          </h1>

          <p className="text-gray-500 mt-1">
            Stay updated with your latest bookings and services.
          </p>
        </div>

        <div className="space-y-4">
          <NotificationCard />
          <NotificationCard />
          <NotificationCard />
        </div>
      </div>
    </div>
  );
};

export default Notification;