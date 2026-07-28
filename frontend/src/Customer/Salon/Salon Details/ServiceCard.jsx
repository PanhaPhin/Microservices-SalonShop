import { FiberManualRecord } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";

const ServiceCard = ({ item, onSelect }) => {
  return (
    <div className="w-full border rounded-lg p-3 shadow-sm">
      <div className="flex items-center justify-between gap-5">

        {/* Left content */}
        <div className="space-y-1 w-[60%]">
          <h1 className="text-2xl font-semibold">{item.name}</h1>

          <p className="text-gray-500 text-sm">
            {item.description}
          </p>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <p>${item.price}</p>

            <FiberManualRecord
              sx={{ fontSize: 8, color: "gray" }}
            />

            <p>{item.duration} mins</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-center gap-2">
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 rounded-md object-cover"
          />

          <Button
            variant="outlined"
            size="small"
            onClick={() => onSelect(item)}
          >
            Add
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ServiceCard;