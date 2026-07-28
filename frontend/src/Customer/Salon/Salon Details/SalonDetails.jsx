import React, { useState } from "react";
import { Button, Divider } from "@mui/material";

import SalonDetail from "./SalonDetail";
import SalonServiceDetails from "./SalonServiceDetails";
import Review from "../../Review/Review";
import CreateReviewForm from "../../Review/CreateReviewForm";

const tabs = [
  { name: "All Services" },
  { name: "Reviews" },
  { name: "Create Review" },
];

const SalonDetails = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  return (
    <div className="px-5 lg:px-20">

      <SalonDetail />

      <div className="mt-6 space-y-4">

        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <Button
              key={tab.name}
              variant={
                activeTab.name === tab.name
                  ? "contained"
                  : "outlined"
              }
              onClick={() => setActiveTab(tab)}
            >
              {tab.name}
            </Button>
          ))}
        </div>

        <Divider />

        <div className="py-5">
          {activeTab.name === "All Services" && (
            <SalonServiceDetails />
          )}

          {activeTab.name === "Reviews" && (
            <Review />
          )}

          {activeTab.name === "Create Review" && (
            <CreateReviewForm />
          )}
        </div>

      </div>

    </div>
  );
};

export default SalonDetails;