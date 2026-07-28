import React, { useEffect, useMemo, useState } from "react";
import { Divider, Button, Modal } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CategoryCard from "./CategoryCard";
import ServiceCard from "./ServiceCard";
import SelectedServiceList from "./SelectedServiceList";
import PaymentModal from "./Paymentmodal";

import { fetchServiceBySalonId } from "../../../Redux/Salon Services/action";

// Demo time slots -> converted to a real date/time when selected
const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
];

// Helpers to keep bookingData.time as a single consistent shape:
// "YYYY-MM-DDTHH:mm" (same format <input type="datetime-local"> uses)

const pad = (n) => String(n).padStart(2, "0");

const labelToIso = (label) => {
  const match = label.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i);
  if (!match) return null;

  let [, hours, minutes, meridiem] = match;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  if (meridiem.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (meridiem.toUpperCase() === "AM" && hours === 12) hours = 0;

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());

  return `${yyyy}-${mm}-${dd}T${pad(hours)}:${pad(minutes)}`;
};

const isoToLabel = (iso) => {
  if (!iso) return null;
  const [, timePart] = iso.split("T");
  if (!timePart) return null;

  let [hours, minutes] = timePart.split(":").map(Number);
  const meridiem = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${pad(hours)}:${pad(minutes)} ${meridiem}`;
};

const SalonServiceDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const service = useSelector((store) => store.service);
  const category = useSelector((store) => store.category);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false); // "time slot unavailable" modal
  const [paymentOpen, setPaymentOpen] = useState(false); // payment modal

  const [bookingData, setBookingData] = useState({
    services: [],
    time: null, // always "YYYY-MM-DDTHH:mm"
  });

  useEffect(() => {
    dispatch(
      fetchServiceBySalonId({
        salonId: id,
        jwt: localStorage.getItem("jwt"),
        categoryId: selectedCategory,
      })
    );
  }, [dispatch, id, selectedCategory]);

  // ================= Category =================

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // ================= Add Service =================

  const handleSelectService = (serviceItem) => {
    setBookingData((prev) => {
      const exists = prev.services.some((item) => item.id === serviceItem.id);
      if (exists) return prev;

      return {
        ...prev,
        services: [...prev.services, serviceItem],
      };
    });
  };

  // ================= Remove Service =================

  const handleRemoveService = (serviceId) => {
    setBookingData((prev) => ({
      ...prev,
      services: prev.services.filter((item) => item.id !== serviceId),
    }));
  };

  // ================= Select Time (quick-pick buttons) =================

  const handleSelectTime = (label) => {
    setBookingData((prev) => ({
      ...prev,
      time: labelToIso(label),
    }));
  };

  // ================= "Time slot unavailable" modal controls =================

  const handleOpenModal = () => setOpen(true);
  const handleModalClose = () => setOpen(false);

  // ================= Booking =================

  const isTimeSlotAvailable = (time) => {
    return Boolean(time);
  };

  const handleBooking = () => {
    if (!isTimeSlotAvailable(bookingData.time)) {
      handleOpenModal();

      dispatch(createBooking)


      return;
    }


    handleModalClose();
    setPaymentOpen(true);
  };

  // ================= Payment =================

  const handlePaymentConfirmed = () => {

    setPaymentOpen(false);
  };

  // ================= Total =================

  const totalPrice = useMemo(() => {
    return bookingData.services.reduce(
      (total, item) => total + Number(item.price || 0),
      0
    );
  }, [bookingData.services]);

  const displayTime = isoToLabel(bookingData.time);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
      {/* ================= Categories ================= */}

      <section className="lg:col-span-3 bg-white rounded-xl shadow-sm border p-5 h-fit">
        <h2 className="text-xl font-semibold mb-5">Categories</h2>

        <div className="space-y-3">
          {category?.categories?.map((item) => (
            <CategoryCard
              key={item.id}
              item={item}
              selectedCategory={selectedCategory}
              handleCategoryClick={() => handleCategoryClick(item.id)}
            />
          ))}
        </div>
      </section>

      {/* ================= Services ================= */}

      <section className="lg:col-span-5 bg-white rounded-xl shadow-sm border p-5 max-h-[85vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-5">Available Services</h2>

        {service?.loading && (
          <div className="py-10 text-center text-gray-500">
            Loading services...
          </div>
        )}

        {!service?.loading &&
          service?.services?.length > 0 &&
          service.services.map((item) => (
            <div key={item.id} className="mb-5">
              <ServiceCard item={item} onSelect={handleSelectService} />
              <Divider sx={{ mt: 2 }} />
            </div>
          ))}

        {!service?.loading && service?.services?.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No services available.
          </div>
        )}
      </section>

      {/* ================= Booking Summary ================= */}

      <section className="lg:col-span-4">
        <div className="sticky top-5 bg-white rounded-xl shadow-sm border p-5 space-y-6">
          {/* Header */}

          <div className="flex items-center gap-3">
            <ShoppingCart color="primary" />

            <div>
              <h2 className="text-xl font-semibold">Booking Summary</h2>

              <p className="text-sm text-gray-500">
                {bookingData.services.length} service
                {bookingData.services.length !== 1 && "s"} selected
              </p>
            </div>
          </div>

          <Divider />

          {/* Selected Services */}

          <div>
            <h3 className="font-semibold mb-3">Selected Services</h3>

            {bookingData.services.length === 0 ? (
              <div className="border border-dashed rounded-lg p-8 text-center text-gray-500">
                No services selected.
              </div>
            ) : (
              <SelectedServiceList
                selectedServices={bookingData.services}
                onRemove={handleRemoveService}
              />
            )}
          </div>

          <Divider />

          {/* Time Slot */}

          <div>
            <h3 className="font-semibold mb-3">Select Time Slot</h3>

            <div className="grid grid-cols-2 gap-2">
              {TIME_SLOTS.map((label) => (
                <Button
                  key={label}
                  variant={displayTime === label ? "contained" : "outlined"}
                  onClick={() => handleSelectTime(label)}
                  size="small"
                >
                  {label}
                </Button>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">Selected Time</p>

              <div className="mt-1 border rounded-md p-3">
                {displayTime ? (
                  <span className="font-medium">{displayTime}</span>
                ) : (
                  <span className="text-gray-400">
                    No time slot selected
                  </span>
                )}
              </div>
            </div>
          </div>

          <Divider />

          {/* Total */}

          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Price</span>

            <span className="text-xl font-bold text-green-600">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <Button
            fullWidth
            size="large"
            variant="contained"
            disabled={bookingData.services.length === 0 || !bookingData.time}
            onClick={handleBooking}
          >
            Book Now
          </Button>

          {(bookingData.services.length === 0 || !bookingData.time) && (
            <p className="text-center text-sm text-gray-500">
              Please select at least one service and a time slot.
            </p>
          )}
        </div>
      </section>

      {/* ================= Time Slot Unavailable / Reschedule Modal ================= */}

      <Modal open={open} onClose={handleModalClose}>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[600px]
          bg-white shadow-lg lg:flex gap-5 p-5 rounded-xl"
        >
          <div className="w-full lg:w-[50%] lg:border-r lg:pr-5">
            <h1 className="text-lg font-semibold mb-4">
              Time Slot Not Available
            </h1>

            <SelectedServiceList
              onRemove={handleRemoveService}
              selectedServices={bookingData.services}
            />
          </div>

          <div className="w-full lg:w-[50%] flex flex-col gap-4">
            <label className="text-sm text-gray-500">
              Pick a new date & time
            </label>

            <input
              type="datetime-local"
              className="w-full border rounded-md p-2"
              value={bookingData.time || ""}
              onChange={(e) => {
                setBookingData((prev) => ({
                  ...prev,
                  time: e.target.value,
                }));
              }}
            />

            <Button
              fullWidth
              variant="outlined"
              onClick={handleBooking}
              disabled={!bookingData.time}
            >
              Book
            </Button>
          </div>
        </div>
      </Modal>

      {/* ================= Payment Modal (KHQR) ================= */}

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        amount={totalPrice}
        onConfirmed={handlePaymentConfirmed}
    
      />
    </div>
  );
};

export default SalonServiceDetails;