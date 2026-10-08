import React, { useEffect, useMemo, useState } from "react";
import { Divider, Button, Modal } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CategoryCard from "./CategoryCard";
import ServiceCard from "./ServiceCard";
import SelectedServiceList from "./SelectedServiceList";
import PaymentModal from "./Paymentmodal";

import { fetchServiceBySalonId } from "../../../Redux/Salon Services/action";
// Adjust this path to wherever your booking action actually lives
import { createBooking } from "../../../Redux/Booking/action";

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

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

// ================= Helpers to keep bookingData.time as a single consistent shape:
// "YYYY-MM-DDTHH:mm" (same format <input type="datetime-local"> uses)

const pad = (n) => String(n).padStart(2, "0");

// Takes the selected calendar date, instead of silently assuming "today"
const labelToIso = (label, date) => {
  const match = label.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i);
  if (!match || !date) return null;

  let [, hours, minutes, meridiem] = match;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  if (meridiem.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (meridiem.toUpperCase() === "AM" && hours === 12) hours = 0;

  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());

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

const isoToDate = (iso) => {
  if (!iso) return null;
  const [datePart] = iso.split("T");
  if (!datePart) return null;
  const [yyyy, mm, dd] = datePart.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
};

const isSameDate = (a, b) => {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const buildCalendarGrid = (year, month) => {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, currentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, currentMonth: true });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - (startWeekday + daysInMonth) + 1, currentMonth: false });
  }
  return cells;
};

const SalonServiceDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const service = useSelector((store) => store.service);
  const category = useSelector((store) => store.category);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false); // "time slot unavailable / reschedule" modal
  const [paymentOpen, setPaymentOpen] = useState(false); // payment modal

  const [bookingData, setBookingData] = useState({
    services: [],
    time: null, // always "YYYY-MM-DDTHH:mm"
  });

  // ================= Calendar state =================
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);
  const [yearPickerOpen, setYearPickerOpen] = useState(false);

  const cells = useMemo(() => buildCalendarGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  const yearOptions = useMemo(() => {
    const base = today.getFullYear();
    const arr = [];
    for (let y = base; y <= base + 5; y++) arr.push(y);
    return arr;
  }, [today]);

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

  // ================= Calendar navigation =================

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Picking a new day keeps whatever time was already chosen, just moves it to the new date
  const handleSelectDay = (cell) => {
    if (!cell.currentMonth) return;
    const newDate = new Date(viewYear, viewMonth, cell.day);
    setSelectedDate(newDate);

    setBookingData((prev) => {
      if (!prev.time) return prev;
      const existingLabel = isoToLabel(prev.time);
      return { ...prev, time: labelToIso(existingLabel, newDate) };
    });
  };

  // ================= Select Time (quick-pick buttons) =================

  const handleSelectTime = (label) => {
    setBookingData((prev) => ({
      ...prev,
      time: labelToIso(label, selectedDate),
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
    // Booking fires when a slot IS chosen; the modal is for when it's NOT.
    if (!isTimeSlotAvailable(bookingData.time)) {
      handleOpenModal();
      return;
    }

    dispatch(
      createBooking({
        salonId: id,
        services: bookingData.services.map((s) => s.id),
        time: bookingData.time,
        jwt: localStorage.getItem("jwt"),
      })
    );

    handleModalClose();
    setPaymentOpen(true);
  };

  const handlePaymentConfirmed = () => {
    setPaymentOpen(false);
  };

  const totalPrice = useMemo(() => {
    return bookingData.services.reduce(
      (total, item) => total + Number(item.price || 0),
      0
    );
  }, [bookingData.services]);

  const displayTime = isoToLabel(bookingData.time);
  const displayDate = isoToDate(bookingData.time) || selectedDate;

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

          {/* ================= Date & Time picker ================= */}

          <div>
            {/* Calendar header */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={goToPrevMonth}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setYearPickerOpen((v) => !v)}
                  className="font-semibold text-sm px-2 py-1 rounded-md hover:bg-gray-100"
                >
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </button>

                {yearPickerOpen && (
                  <div className="absolute z-10 mt-1 left-1/2 -translate-x-1/2 w-28 max-h-40 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-md">
                    {yearOptions.map((y) => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => {
                          setViewYear(y);
                          setYearPickerOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 ${
                          y === viewYear ? "font-semibold text-blue-600" : "text-gray-700"
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={goToNextMonth}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 mb-1">
              {WEEKDAY_LABELS.map((label, i) => (
                <div key={i} className="text-center text-xs font-medium text-gray-400 py-1">
                  {label}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((cell, i) => {
                const cellDate = cell.currentMonth ? new Date(viewYear, viewMonth, cell.day) : null;
                const isSelected = cell.currentMonth && isSameDate(cellDate, selectedDate);
                const isToday = cell.currentMonth && isSameDate(cellDate, today);
                const isPast =
                  cell.currentMonth &&
                  cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!cell.currentMonth || isPast}
                    onClick={() => handleSelectDay(cell)}
                    className={[
                      "aspect-square rounded-md text-sm flex items-center justify-center transition-colors",
                      !cell.currentMonth ? "text-gray-300 cursor-default" : "",
                      isPast ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100",
                      isSelected ? "bg-blue-600 text-white hover:bg-blue-600" : "",
                      isToday && !isSelected ? "ring-1 ring-blue-400" : "",
                    ].join(" ")}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>

            {/* Time slot picker */}
            <div className="mt-5">
              <h3 className="font-semibold mb-3 text-sm">Select Time Slot</h3>

              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleSelectTime(label)}
                    className={[
                      "text-sm px-3 py-1.5 rounded-md border transition-colors",
                      displayTime === label
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">Selected Date & Time</p>
                <div className="mt-1 border rounded-md p-3">
                  {bookingData.time ? (
                    <span className="font-medium">
                      {displayDate.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      &middot; {displayTime}
                    </span>
                  ) : (
                    <span className="text-gray-400">No time slot selected</span>
                  )}
                </div>
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