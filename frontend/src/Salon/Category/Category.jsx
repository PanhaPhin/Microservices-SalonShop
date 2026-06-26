import { Button } from "@mui/material";
import React, { useState } from "react";
import CategoryTable from "./CategoryTable";
import CategoryForm from "../Category/CategoryForm";

const Category = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          onClick={() => handleTabClick(1)}
          variant={activeTab === 1 ? "contained" : "outlined"}
          color="success"
        >
          All Categories
        </Button>

        <Button
          onClick={() => handleTabClick(2)}
          variant={activeTab === 2 ? "contained" : "outlined"}
          color="success"
        >
          Add Category
        </Button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 1 ? <CategoryTable /> : <CategoryForm />}
      </div>
    </div>
  );
};

export default Category;