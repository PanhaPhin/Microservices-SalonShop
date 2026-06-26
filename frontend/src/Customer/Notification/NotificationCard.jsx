import React from "react";
import { Card, Avatar } from "@mui/material";
import { NotificationsActive } from "@mui/icons-material";

const NotificationCard = () => {
  const services = [
    "Hair Cut",
    "Shaving",
    "Massage",
    "Hair Wash",
    "Beard Trim",
  ];

  return (
    <Card
      elevation={0}
      className="p-5 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <Avatar
          sx={{
            bgcolor: "#DCFCE7",
            color: "#15803D",
            width: 50,
            height: 50,
          }}
        >
          <NotificationsActive />
        </Avatar>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-800">
              Booking Confirmed
            </h3>

            <span className="text-xs text-gray-500">
              Just now
            </span>
          </div>

          <p className="text-sm text-gray-600 mt-1">
            Your appointment has been successfully confirmed.
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {services.map((item) => (
              <span
                key={item}
                className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotificationCard;