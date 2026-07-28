import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalonById } from "../../../Redux/Salon/action";
import { getCategoriesBySalon } from "../../../Redux/Category/action";
import CategoryCard from "../../../Customer/Salon/Salon Details/CategoryCard"

const SalonDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();


  const { salon, category } = useSelector((store) => store);

  useEffect(() => {
    if (id) {
      dispatch(fetchSalonById(id));
      dispatch(
        getCategoriesBySalon({
          jwt: localStorage.getItem("jwt"),
          salonId: id,
        })
      );
    }
  }, [id]);

  return (
    <div className="p-4 mb-20">
      {/* Images */}
      <section className="grid grid-cols-3 gap-3 auto-rows-[220px]">
        {/* Large Image */}
        <div className="col-span-2 row-span-2 overflow-hidden rounded-3xl group">
          <img
            className="w-full h-full object-cover group-hover:scale-110 duration-500"
            src={salon.salon?.images?.[0]}
            alt={salon.salon?.name}
          />
        </div>

        {/* Top Right */}
        <div className="overflow-hidden rounded-3xl group">
          <img
            className="w-full h-full object-cover group-hover:scale-110 duration-500"
            src={salon.salon?.images?.[1]}
            alt={salon.salon?.name}
          />
        </div>

        {/* Bottom Right */}
        <div className="overflow-hidden rounded-3xl group">
          <img
            className="w-full h-full object-cover group-hover:scale-110 duration-500"
            src={salon.salon?.images?.[2]}
            alt={salon.salon?.name}
          />
        </div>
      </section>

      {/* Salon Info */}
      <section className="mt-6 space-y-2">
        <h1 className="text-3xl font-bold">{salon.salon?.name}</h1>

        <p className="text-gray-600">{salon.salon?.address}</p>

        <p>
          <strong>Timing:</strong> {salon.salon?.openTime} -{" "}
          {salon.salon?.closeTime}
        </p>
      </section>

      {/* Categories */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Categories</h2>

        {category.loading && <p className="text-gray-400">Loading categories...</p>}

        {category.error && (
          <p className="text-red-500">
            {typeof category.error === "string"
              ? category.error
              : "Failed to load categories"}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          {category.categories && category.categories.length > 0 ? (
            category.categories.map((item) => (
              <CategoryCard key={item.id} item={item} />
            ))
          ) : (
            !category.loading && (
              <p className="text-gray-400">No categories found.</p>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default SalonDetail;