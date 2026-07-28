import React from "react";

const CategoryCard = ({ handleCategoryClick, selectedCategory, item }) => {
  return (
    <div
      onClick={handleCategoryClick}
      className={`px-3 py-2 cursor-pointer flex gap-2 items-center rounded-md transition ${
        selectedCategory === item.id ? "bg-green-500 text-white" : "hover:bg-gray-100"
      }`}
    >
      <img
        className="w-14 h-14 object-cover rounded-full"
        src={item.image}
        alt=""
      />
      <h1>{item.name}</h1>
    </div>
  );
};

export default CategoryCard;