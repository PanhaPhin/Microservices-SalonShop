import React from "react";
import Navbar from "../AddminSalon/Navbar";
import SalonDrawerList from "../Customer/Salon/components/SalonDrawerList";
import SalonRoutes from "../Routes/SalonRoutes";

const SalonDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar DrawerComponent={SalonDrawerList} />

      <section className="lg:flex lg:h-[90vh]">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 h-[calc(100vh-70px)] bg-white border-r">
          <SalonDrawerList />
        </aside>

        {/* Content */}
        <div className="p-10 w-full lg:w-[80%] overflow-y-auto">
          <SalonRoutes />
        </div>
      </section>
    </div>
  );
};

export default SalonDashboard;