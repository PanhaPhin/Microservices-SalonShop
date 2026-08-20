import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Clock, ImageOff } from "lucide-react";
import { fetchSalonById } from "../../../Redux/Salon/action";
import { getCategoriesBySalon } from "../../../Redux/Category/action";
import CategoryCard from "../../../Customer/Salon/Salon Details/CategoryCard";

const ImageSlot = ({ src, alt, className = "" }) => (
  <div
    className={`relative overflow-hidden rounded-3xl bg-gray-100 group ${className}`}
  >
    {src ? (
      <img
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        src={src}
        alt={alt || "Salon image"}
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-300">
        <ImageOff size={32} />
      </div>
    )}
  </div>
);

const getOpenStatus = (openTime, closeTime) => {
  if (!openTime || !closeTime) return null;
  try {
    const now = new Date();
    const toDate = (t) => {
      const [time, meridiem] = t.split(" ");
      let [h, m] = time.split(":").map(Number);
      if (meridiem?.toUpperCase() === "PM" && h !== 12) h += 12;
      if (meridiem?.toUpperCase() === "AM" && h === 12) h = 0;
      const d = new Date();
      d.setHours(h, m || 0, 0, 0);
      return d;
    };
    const open = toDate(openTime);
    const close = toDate(closeTime);
    return now >= open && now <= close;
  } catch {
    return null;
  }
};

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

  const isOpen = useMemo(
    () => getOpenStatus(salon.salon?.openTime, salon.salon?.closeTime),
    [salon.salon?.openTime, salon.salon?.closeTime]
  );

  const isSalonLoading = salon.loading;

  return (
    <div className="max-w-6xl mx-auto p-4 pb-24">
      {/* Images */}
      {isSalonLoading ? (
        <section className="grid grid-cols-3 gap-3 auto-rows-[220px] animate-pulse">
          <div className="col-span-2 row-span-2 rounded-3xl bg-gray-200" />
          <div className="rounded-3xl bg-gray-200" />
          <div className="rounded-3xl bg-gray-200" />
        </section>
      ) : (
        <section className="grid grid-cols-3 gap-3 auto-rows-[160px] sm:auto-rows-[220px]">
          <ImageSlot
            src={salon.salon?.images?.[0]}
            alt={salon.salon?.name}
            className="col-span-2 row-span-2"
          />
          <ImageSlot src={salon.salon?.images?.[1]} alt={salon.salon?.name} />
          <ImageSlot src={salon.salon?.images?.[2]} alt={salon.salon?.name} />
        </section>
      )}

      {/* Salon Info */}
      <section className="mt-6 space-y-3">
        {isSalonLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-8 w-2/3 bg-gray-200 rounded-lg" />
            <div className="h-4 w-1/2 bg-gray-200 rounded-lg" />
            <div className="h-4 w-1/3 bg-gray-200 rounded-lg" />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {salon.salon?.name}
              </h1>

              {isOpen !== null && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    isOpen
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isOpen ? "bg-green-600" : "bg-red-500"
                    }`}
                  />
                  {isOpen ? "Open now" : "Closed"}
                </span>
              )}
            </div>

            {salon.salon?.address && (
              <p className="flex items-center gap-1.5 text-gray-500">
                <MapPin size={16} className="shrink-0" />
                {salon.salon.address}
              </p>
            )}

            {(salon.salon?.openTime || salon.salon?.closeTime) && (
              <p className="flex items-center gap-1.5 text-gray-700">
                <Clock size={16} className="shrink-0" />
                <span className="font-medium">
                  {salon.salon?.openTime} - {salon.salon?.closeTime}
                </span>
              </p>
            )}
          </>
        )}
      </section>

      <hr className="my-6 border-gray-100" />

      {/* Categories */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Categories
        </h2>

        {category.loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-gray-200" />
            ))}
          </div>
        )}

        {category.error && !category.loading && (
          <p className="text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {typeof category.error === "string"
              ? category.error
              : "Failed to load categories"}
          </p>
        )}

        {!category.loading && !category.error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {category.categories && category.categories.length > 0 ? (
              category.categories.map((item) => (
                <CategoryCard key={item.id} item={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400">
                <p>No categories found for this salon.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default SalonDetail;