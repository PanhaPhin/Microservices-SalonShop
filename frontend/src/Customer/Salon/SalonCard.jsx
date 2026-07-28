import React from "react";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";

const SalonCard = ({ item, onSelect, onRemove }) => {
    const navigate = useNavigate();

    return (
        <div className="w-56 md:w-80 rounded-md bg-slate-100 shadow-md hover:shadow-xl duration-300">
            {/* Card Click */}
            <div
                onClick={() => navigate(`/salon/${item.id}`)}
                className="cursor-pointer"
            >
                <img
                    className="w-full h-60 object-cover rounded-t-md"
                    src={item.images?.[0]}
                    alt={item.name}
                />

                <div className="p-5 space-y-2">
                    <h1 className="font-bold text-lg">{item.name}</h1>

                    <div className="text-white text-sm p-1 bg-green-700 rounded-full w-14 flex items-center justify-center gap-1">
                        4.5
                        <StarIcon sx={{ fontSize: 16 }} />
                    </div>

                    <p className="text-gray-500">
                        Professional haircut...
                    </p>

                    <p className="text-gray-500">{item.address}</p>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between p-4 border-t">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect?.(item);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Select
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove?.(item.id);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default SalonCard;