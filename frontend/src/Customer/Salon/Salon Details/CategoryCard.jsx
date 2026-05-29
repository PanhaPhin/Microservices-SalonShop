import React from "react";

const CategoryCard = ({ handleCategoryClick, selectedCategory, item }) => {
  return (
    <div
      onClick={() => handleCategoryClick(item)}
      className={`px-3 py-2 cursor-pointer flex gap-2 items-center rounded-md transition ${
        selectedCategory === item
          ? "bg-green-500 text-white"
          : "hover:bg-gray-100"
      }`}
    >
      <img
        className="w-14 h-14 object-cover rounded-full"
        src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
        alt=""
      />
      <h1>Baba makeup</h1>
    </div>
  );
};

export default CategoryCard;