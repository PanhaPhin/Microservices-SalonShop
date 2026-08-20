import React from "react";
import StarIcon from "@mui/icons-material/Star";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import { useNavigate } from "react-router-dom";

const SalonCard = ({ item, onSelect, onRemove }) => {
  const navigate = useNavigate();

  return (
    <div className="w-56 md:w-80 rounded-2xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 duration-300 overflow-hidden border border-gray-100">
      {/* Card Click */}
      <div
        onClick={() => navigate(`/salon/${item.id}`)}
        className="cursor-pointer group"
      >
        <div className="relative w-full h-52 md:h-60 overflow-hidden bg-gray-100">
          {item.images?.[0] ? (
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={item.images[0]}
              alt={item.name}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ImageNotSupportedOutlinedIcon sx={{ fontSize: 36 }} />
            </div>
          )}

          {/* Rating badge overlaid on image */}
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-2.5 py-1 text-sm font-semibold text-gray-800 shadow">
            <StarIcon sx={{ fontSize: 16 }} className="text-amber-500" />
            4.5
          </div>
        </div>

        <div className="p-4 space-y-1.5">
          <h1 className="font-bold text-lg text-gray-900 truncate">
            {item.name}
          </h1>

          <p className="text-sm text-gray-500 line-clamp-2">
            Professional haircut, styling &amp; grooming services.
          </p>

          {item.address && (
            <p className="flex items-center gap-1 text-sm text-gray-400 pt-1 truncate">
              <LocationOnOutlinedIcon
                sx={{ fontSize: 16 }}
                className="shrink-0"
              />
              <span className="truncate">{item.address}</span>
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 p-4 pt-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(item);
          }}
          className="flex-1 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Select
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.(item.id);
          }}
          className="flex-1 px-4 py-2 text-sm font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default SalonCard;