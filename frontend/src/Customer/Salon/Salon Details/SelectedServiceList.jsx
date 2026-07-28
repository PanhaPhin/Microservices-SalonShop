import React from "react";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

const SelectedServiceList = ({
  selectedServices,
  onRemove,
}) => {
  return (
    <div className="space-y-3">
      {selectedServices.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center bg-slate-100 rounded-md p-3"
        >
          <div>
            <h3 className="font-medium">{item.name}</h3>

            {item.price && (
              <p className="text-sm text-gray-500">
                ${item.price}
              </p>
            )}
          </div>

          <IconButton
            color="error"
            onClick={() => onRemove(item.id)}
          >
            <Close />
          </IconButton>
        </div>
      ))}
    </div>
  );
};

export default SelectedServiceList;