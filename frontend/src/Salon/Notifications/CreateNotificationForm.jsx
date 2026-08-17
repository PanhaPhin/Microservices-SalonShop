import React, { useState } from "react";
import {
  Campaign,
  Newspaper,
  ShoppingBag,
  NotificationsNone,
  ArrowBack,
  Send,
  AutoAwesome,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";

const BLUE = "#3978C7";
const BLUE_SOFT = "rgba(57,120,199,0.10)";

const AMBER = "#C98A16";
const AMBER_SOFT = "rgba(201,138,22,0.10)";

const TYPES = [
  {
    key: "announcement",
    label: "Announcement",
    description: "Important updates and system announcements",
    icon: Campaign,
    color: GREEN,
    soft: GREEN_SOFT,
  },
  {
    key: "news",
    label: "News",
    description: "Platform news, updates and information",
    icon: Newspaper,
    color: BLUE,
    soft: BLUE_SOFT,
  },
  {
    key: "product",
    label: "New Product",
    description: "Promote new products and collections",
    icon: ShoppingBag,
    color: AMBER,
    soft: AMBER_SOFT,
  },
];

export default function Create() {
  const navigate = useNavigate();

  const [type, setType] = useState("announcement");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedType = TYPES.find((item) => item.key === type);
  const Icon = selectedType.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      return;
    }

    setLoading(true);

    try {
      // TODO:
      // Replace this with your API call
      //
      // await axios.post("/api/notifications", {
      //   type,
      //   title,
      //   message,
      // });

      console.log({
        type,
        title,
        message,
      });

      // After successful API request
      navigate("/notification");
    } catch (error) {
      console.error("Failed to create notification:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full px-6 py-8 md:px-10 lg:px-14"
      style={{
        backgroundColor: "#F9FAFB",
        fontFamily: "'Manrope', 'Inter', sans-serif",
      }}
    >
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
        <div>
          <p
            className="text-xs uppercase tracking-[0.25em] mb-2"
            style={{ color: "#8B7A3F" }}
          >
            Platform Communication
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/notifications/create")}
              className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:bg-gray-50"
              style={{
                backgroundColor: "#fff",
                borderColor: "rgba(18,24,31,0.08)",
              }}
            >
              <ArrowBack
                sx={{
                  fontSize: 19,
                  color: "#59635D",
                }}
              />
            </button>

            <h1
              className="font-semibold text-2xl md:text-3xl"
              style={{
                fontFamily: "'Fraunces', serif",
                color: "#12181F",
              }}
            >
              Create Notification
            </h1>
          </div>

          <p
            className="text-sm mt-2 ml-12"
            style={{ color: "#8B93A0" }}
          >
            Create and publish an announcement, news update, or new product.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div
            className="rounded-2xl border p-5 md:p-7"
            style={{
              backgroundColor: "#fff",
              borderColor: "rgba(18,24,31,0.06)",
            }}
          >
            {/* TYPE */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <NotificationsNone
                  sx={{
                    fontSize: 18,
                    color: "#6B6B6B",
                  }}
                />

                <h2
                  className="text-sm font-bold"
                  style={{ color: "#12181F" }}
                >
                  Notification Type
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {TYPES.map((item) => {
                  const active = type === item.key;
                  const TypeIcon = item.icon;

                  return (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => setType(item.key)}
                      className="text-left rounded-2xl p-4 border transition-all"
                      style={{
                        backgroundColor: active
                          ? item.soft
                          : "#fff",

                        borderColor: active
                          ? item.color
                          : "rgba(18,24,31,0.08)",

                        boxShadow: active
                          ? `0 3px 12px ${item.soft}`
                          : "none",
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            backgroundColor: item.soft,
                          }}
                        >
                          <TypeIcon
                            sx={{
                              fontSize: 20,
                              color: item.color,
                            }}
                          />
                        </div>

                        {active && (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: item.color,
                            }}
                          >
                            <span
                              className="text-[10px] font-bold"
                              style={{
                                color: "#fff",
                              }}
                            >
                              ✓
                            </span>
                          </div>
                        )}
                      </div>

                      <p
                        className="text-sm font-bold mt-3"
                        style={{
                          color: "#12181F",
                        }}
                      >
                        {item.label}
                      </p>

                      <p
                        className="text-[11px] leading-4 mt-1"
                        style={{
                          color: "#8B93A0",
                        }}
                      >
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TITLE */}
            <div className="mb-6">
              <label
                className="block text-xs font-bold mb-2"
                style={{ color: "#4F5752" }}
              >
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  type === "announcement"
                    ? "e.g. Important System Announcement"
                    : type === "news"
                    ? "e.g. New Platform Update"
                    : "e.g. New Product Collection Available"
                }
                className="w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all"
                style={{
                  borderColor: "rgba(18,24,31,0.10)",
                  color: "#12181F",
                  backgroundColor: "#fff",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    selectedType.color;
                  e.currentTarget.style.boxShadow =
                    `0 0 0 3px ${selectedType.soft}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(18,24,31,0.10)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                required
              />

              <p
                className="text-[10px] mt-1.5"
                style={{ color: "#9AA19C" }}
              >
                Keep the title short and easy to understand.
              </p>
            </div>

            {/* MESSAGE */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2">
                <label
                  className="block text-xs font-bold"
                  style={{ color: "#4F5752" }}
                >
                  Message
                </label>

                <span
                  className="text-[10px]"
                  style={{ color: "#9AA19C" }}
                >
                  {message.length}/500
                </span>
              </div>

              <textarea
                value={message}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setMessage(e.target.value);
                  }
                }}
                placeholder="Write your notification message..."
                rows={7}
                className="w-full px-4 py-3 rounded-xl border outline-none text-sm leading-6 resize-none transition-all"
                style={{
                  borderColor: "rgba(18,24,31,0.10)",
                  color: "#12181F",
                  backgroundColor: "#fff",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    selectedType.color;
                  e.currentTarget.style.boxShadow =
                    `0 0 0 3px ${selectedType.soft}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(18,24,31,0.10)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                required
              />
            </div>

            {/* ACTIONS */}
            <div
              className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-5 border-t"
              style={{
                borderColor: "rgba(18,24,31,0.06)",
              }}
            >
              <button
                type="button"
                onClick={() => navigate("/notifications")}
                className="px-5 py-3 rounded-xl text-xs font-bold border transition-all hover:bg-gray-50"
                style={{
                  backgroundColor: "#fff",
                  color: "#59635D",
                  borderColor: "rgba(18,24,31,0.10)",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  loading ||
                  !title.trim() ||
                  !message.trim()
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all"
                style={{
                  backgroundColor:
                    loading ||
                    !title.trim() ||
                    !message.trim()
                      ? "#D5DBD7"
                      : GREEN,
                  color: "#fff",
                  cursor:
                    loading ||
                    !title.trim() ||
                    !message.trim()
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <Send sx={{ fontSize: 16 }} />

                {loading
                  ? "Publishing..."
                  : "Publish Notification"}
              </button>
            </div>
          </div>
        </form>

        {/* PREVIEW */}
        <div>
          <div
            className="rounded-2xl border p-5 sticky top-6"
            style={{
              backgroundColor: "#fff",
              borderColor: "rgba(18,24,31,0.06)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AutoAwesome
                sx={{
                  fontSize: 18,
                  color: GREEN,
                }}
              />

              <h2
                className="text-sm font-bold"
                style={{ color: "#12181F" }}
              >
                Preview
              </h2>
            </div>

            <p
              className="text-[10px] uppercase tracking-[0.15em] font-bold mb-3"
              style={{ color: "#9AA19C" }}
            >
              How users will see it
            </p>

            {/* NOTIFICATION PREVIEW */}
            <div
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: "#FCFEFC",
                borderColor: "rgba(21,128,61,0.14)",
              }}
            >
              <div className="flex gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: selectedType.soft,
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: 20,
                      color: selectedType.color,
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: GREEN,
                      }}
                    />

                    <h3
                      className="text-sm font-bold truncate"
                      style={{
                        color: "#12181F",
                      }}
                    >
                      {title || "Notification title"}
                    </h3>
                  </div>

                  <p
                    className="text-xs leading-5 mt-1.5"
                    style={{
                      color: "#707A73",
                    }}
                  >
                    {message ||
                      "Your notification message will appear here."}
                  </p>

                  <div className="flex items-center justify-between mt-3 gap-2">
                    <span
                      className="inline-flex items-center text-[9px] font-bold px-2 py-1 rounded-full"
                      style={{
                        backgroundColor:
                          selectedType.soft,
                        color: selectedType.color,
                      }}
                    >
                      {selectedType.label}
                    </span>

                    <span
                      className="text-[10px]"
                      style={{
                        color: "#9AA19C",
                      }}
                    >
                      Just now
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* TYPE INFO */}
            <div
              className="mt-5 rounded-xl p-4"
              style={{
                backgroundColor: selectedType.soft,
              }}
            >
              <div className="flex gap-3">
                <Icon
                  sx={{
                    fontSize: 18,
                    color: selectedType.color,
                  }}
                />

                <div>
                  <p
                    className="text-xs font-bold"
                    style={{
                      color: selectedType.color,
                    }}
                  >
                    {selectedType.label}
                  </p>

                  <p
                    className="text-[10px] leading-4 mt-1"
                    style={{
                      color: "#707A73",
                    }}
                  >
                    {selectedType.description}
                  </p>
                </div>
              </div>
            </div>

            {/* INFO */}
            <div className="mt-5">
              <p
                className="text-[10px] leading-5"
                style={{
                  color: "#9AA19C",
                }}
              >
                Once published, this notification can be displayed
                to users in the notification center.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}