import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    NotificationsNone,
    Campaign,
    Newspaper,
    ShoppingBag,
    CheckCircle,
    DoneAll,
    ChevronRight,
    AutoAwesome,
    Add,
} from "@mui/icons-material";

const GREEN = "#15803d";
const GREEN_SOFT = "rgba(21,128,61,0.10)";

const BLUE = "#3978C7";
const BLUE_SOFT = "rgba(57,120,199,0.10)";

const AMBER = "#C98A16";
const AMBER_SOFT = "rgba(201,138,22,0.10)";

const initialNotifications = [
    {
        id: 1,
        type: "announcement",
        title: "Important Announcement",
        message:
            "Our platform will receive a scheduled maintenance update tonight from 11:00 PM to 12:00 AM.",
        time: "10 minutes ago",
        date: "Today",
        read: false,
    },
    {
        id: 2,
        type: "product",
        title: "New Product Available",
        message:
            "Check out our latest beauty products. New items are now available for salon owners.",
        time: "1 hour ago",
        date: "Today",
        read: false,
    },
    {
        id: 3,
        type: "news",
        title: "Platform News",
        message:
            "We have improved the booking experience to make managing your appointments easier.",
        time: "3 hours ago",
        date: "Today",
        read: false,
    },
    {
        id: 4,
        type: "announcement",
        title: "System Update",
        message:
            "A new version of the application is now available. Please update your application to enjoy the latest improvements.",
        time: "Yesterday",
        date: "Yesterday",
        read: true,
    },
    {
        id: 5,
        type: "product",
        title: "Special Product Collection",
        message:
            "Discover our new professional hair care collection designed for salon professionals.",
        time: "Yesterday",
        date: "Yesterday",
        read: true,
    },
    {
        id: 6,
        type: "news",
        title: "New Features",
        message:
            "You can now manage your services, products and customer bookings from one place.",
        time: "2 days ago",
        date: "2 days ago",
        read: true,
    },
    {
        id: 7,
        type: "announcement",
        title: "Welcome to the Platform",
        message:
            "Thank you for joining us. We are excited to help you grow your salon business.",
        time: "5 days ago",
        date: "5 days ago",
        read: true,
    },
];

const FILTERS = [
    {
        key: "all",
        label: "All",
    },
    {
        key: "announcement",
        label: "Announcements",
    },
    {
        key: "news",
        label: "News",
    },
    {
        key: "product",
        label: "Products",
    },
];

const getTypeMeta = (type) => {
    switch (type) {
        case "announcement":
            return {
                label: "Announcement",
                icon: Campaign,
                color: GREEN,
                soft: GREEN_SOFT,
            };

        case "news":
            return {
                label: "News",
                icon: Newspaper,
                color: BLUE,
                soft: BLUE_SOFT,
            };

        case "product":
            return {
                label: "New Product",
                icon: ShoppingBag,
                color: AMBER,
                soft: AMBER_SOFT,
            };

        default:
            return {
                label: "Notification",
                icon: NotificationsNone,
                color: GREEN,
                soft: GREEN_SOFT,
            };
    }
};

export default function Notification() {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState(
        initialNotifications
    );

    const [filter, setFilter] = useState("all");

    const unreadCount = useMemo(
        () => notifications.filter((item) => !item.read).length,
        [notifications]
    );

    const filteredNotifications = useMemo(() => {
        if (filter === "all") {
            return notifications;
        }

        return notifications.filter(
            (item) => item.type === filter
        );
    }, [notifications, filter]);

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        read: true,
                    }
                    : item
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((item) => ({
                ...item,
                read: true,
            }))
        );
    };

    const getFilterCount = (key) => {
        if (key === "all") {
            return notifications.length;
        }

        return notifications.filter(
            (item) => item.type === key
        ).length;
    };

    return (
        <div
            className="min-h-screen w-full px-6 py-8 md:px-10 lg:px-14"
            style={{
                backgroundColor: "#F9FAFB",
                fontFamily: "'Manrope', 'Inter', sans-serif",
            }}
        >
            {/* =====================================================
          HEADER
      ===================================================== */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-7">
                <div>
                    <p
                        className="text-xs uppercase tracking-[0.25em] mb-2"
                        style={{ color: "#8B7A3F" }}
                    >
                        Platform Communication
                    </p>

                    <div className="flex items-center gap-3">
                        <h1
                            className="font-semibold text-2xl md:text-3xl"
                            style={{
                                fontFamily: "'Fraunces', serif",
                                color: "#12181F",
                            }}
                        >
                            Notifications
                        </h1>

                        {unreadCount > 0 && (
                            <span
                                className="min-w-6 h-6 px-2 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{
                                    backgroundColor: GREEN,
                                    color: "#fff",
                                }}
                            >
                                {unreadCount}
                            </span>
                        )}
                    </div>

                    <p
                        className="text-sm mt-1"
                        style={{ color: "#8B93A0" }}
                    >
                        Announcements, news and new products.
                    </p>
                </div>

                {/* =====================================================
            HEADER ACTIONS
        ===================================================== */}
                <div className="flex flex-col sm:flex-row gap-2">
                    {/* CREATE NOTIFICATION */}
                    <button
                        type="button"
                        onClick={() => navigate("/create-notification")}
                        className="inline-flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                        style={{
                            backgroundColor: GREEN,
                            color: "#fff",
                            boxShadow: "0 4px 12px rgba(21,128,61,0.16)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#166534";
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow =
                                "0 6px 16px rgba(21,128,61,0.20)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = GREEN;
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                                "0 4px 12px rgba(21,128,61,0.16)";
                        }}
                    >
                        <Add sx={{ fontSize: 18 }} />
                        Create Notification
                    </button>

                    {/* MARK ALL READ */}
                    <button
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                        className="inline-flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border transition-all"
                        style={{
                            backgroundColor:
                                unreadCount > 0 ? GREEN_SOFT : "#F1F3F2",

                            color:
                                unreadCount > 0 ? GREEN : "#9AA19C",

                            borderColor:
                                unreadCount > 0
                                    ? "rgba(21,128,61,0.15)"
                                    : "rgba(18,24,31,0.06)",

                            cursor:
                                unreadCount === 0
                                    ? "not-allowed"
                                    : "pointer",
                        }}
                    >
                        <DoneAll sx={{ fontSize: 17 }} />
                        Mark all as read
                    </button>
                </div>
            </div>

            {/* =====================================================
          SUMMARY CARD
      ===================================================== */}
            <div
                className="rounded-2xl p-5 mb-6 border flex items-center gap-4"
                style={{
                    backgroundColor: "#fff",
                    borderColor: "rgba(18,24,31,0.06)",
                }}
            >
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                        backgroundColor: GREEN_SOFT,
                    }}
                >
                    <AutoAwesome
                        sx={{
                            fontSize: 21,
                            color: GREEN,
                        }}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <p
                        className="text-sm font-semibold"
                        style={{ color: "#12181F" }}
                    >
                        Stay up to date
                    </p>

                    <p
                        className="text-xs mt-1"
                        style={{ color: "#8B93A0" }}
                    >
                        {unreadCount > 0
                            ? `You have ${unreadCount} unread ${unreadCount === 1
                                ? "notification"
                                : "notifications"
                            }.`
                            : "You're all caught up. You have no unread notifications."}
                    </p>
                </div>

                <div
                    className="hidden sm:flex items-center gap-2 text-xs font-medium"
                    style={{ color: "#8B93A0" }}
                >
                    <NotificationsNone sx={{ fontSize: 17 }} />
                    {notifications.length} total
                </div>
            </div>

            {/* =====================================================
          FILTER TABS
      ===================================================== */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
                {FILTERS.map((item) => {
                    const active = filter === item.key;

                    return (
                        <button
                            key={item.key}
                            onClick={() => setFilter(item.key)}
                            className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-full transition-all"
                            style={{
                                backgroundColor: active ? GREEN : "#fff",
                                color: active ? "#fff" : "#6B6B6B",
                                border: `1px solid ${active
                                        ? GREEN
                                        : "rgba(18,24,31,0.10)"
                                    }`,
                            }}
                        >
                            {item.label}

                            <span
                                className="min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] font-bold"
                                style={{
                                    backgroundColor: active
                                        ? "rgba(255,255,255,0.18)"
                                        : "#F1F3F2",

                                    color: active
                                        ? "#fff"
                                        : "#7B847E",
                                }}
                            >
                                {getFilterCount(item.key)}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* =====================================================
          SECTION HEADER
      ===================================================== */}
            <div className="flex items-center gap-3 mb-3">
                <p
                    className="text-xs font-bold uppercase tracking-[0.12em]"
                    style={{ color: "#6B6B6B" }}
                >
                    Recent notifications
                </p>

                <div
                    className="flex-1 h-px"
                    style={{
                        backgroundColor:
                            "rgba(18,24,31,0.07)",
                    }}
                />
            </div>

            {/* =====================================================
          NOTIFICATION LIST
      ===================================================== */}
            <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                    <div
                        className="rounded-2xl p-12 text-center border"
                        style={{
                            backgroundColor: "#fff",
                            borderColor: "rgba(18,24,31,0.06)",
                        }}
                    >
                        <div
                            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4"
                            style={{
                                backgroundColor: GREEN_SOFT,
                            }}
                        >
                            <NotificationsNone
                                sx={{
                                    fontSize: 28,
                                    color: GREEN,
                                }}
                            />
                        </div>

                        <h3
                            className="text-base font-semibold"
                            style={{ color: "#12181F" }}
                        >
                            No notifications
                        </h3>

                        <p
                            className="text-xs mt-1 max-w-sm mx-auto"
                            style={{ color: "#8B93A0" }}
                        >
                            There are no notifications in this
                            category yet.
                        </p>
                    </div>
                ) : (
                    filteredNotifications.map((item) => {
                        const meta = getTypeMeta(item.type);
                        const Icon = meta.icon;

                        return (
                            <button
                                key={item.id}
                                onClick={() => markAsRead(item.id)}
                                className="w-full text-left rounded-2xl border p-4 md:p-5 transition-all"
                                style={{
                                    backgroundColor: item.read
                                        ? "#fff"
                                        : "#FCFEFC",

                                    borderColor: item.read
                                        ? "rgba(18,24,31,0.06)"
                                        : "rgba(21,128,61,0.18)",

                                    boxShadow: item.read
                                        ? "none"
                                        : "0 2px 8px rgba(21,128,61,0.04)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(-1px)";

                                    e.currentTarget.style.boxShadow =
                                        "0 5px 18px rgba(18,24,31,0.06)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(0)";

                                    e.currentTarget.style.boxShadow =
                                        item.read
                                            ? "none"
                                            : "0 2px 8px rgba(21,128,61,0.04)";
                                }}
                            >
                                <div className="flex gap-4">
                                    {/* ICON */}
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                        style={{
                                            backgroundColor: meta.soft,
                                        }}
                                    >
                                        <Icon
                                            sx={{
                                                fontSize: 21,
                                                color: meta.color,
                                            }}
                                        />
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-2 min-w-0">
                                                {!item.read && (
                                                    <span
                                                        className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                                                        style={{
                                                            backgroundColor: GREEN,
                                                        }}
                                                    />
                                                )}

                                                <h3
                                                    className={`text-sm ${item.read
                                                            ? "font-semibold"
                                                            : "font-bold"
                                                        }`}
                                                    style={{
                                                        color: "#12181F",
                                                    }}
                                                >
                                                    {item.title}
                                                </h3>
                                            </div>

                                            <ChevronRight
                                                sx={{
                                                    fontSize: 19,
                                                    color: "#A5ADA7",
                                                    flexShrink: 0,
                                                }}
                                            />
                                        </div>

                                        <p
                                            className="text-xs leading-5 mt-1.5"
                                            style={{
                                                color: "#707A73",
                                            }}
                                        >
                                            {item.message}
                                        </p>

                                        <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                                            <span
                                                className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        meta.soft,
                                                    color: meta.color,
                                                }}
                                            >
                                                {meta.label}
                                            </span>

                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="text-[10px]"
                                                    style={{
                                                        color: "#9AA19C",
                                                    }}
                                                >
                                                    {item.time}
                                                </span>

                                                {item.read && (
                                                    <CheckCircle
                                                        sx={{
                                                            fontSize: 14,
                                                            color: "#9AA19C",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>

            {/* =====================================================
          FOOTER
      ===================================================== */}
            {filteredNotifications.length > 0 && (
                <div className="flex items-center justify-center gap-2 py-7">
                    <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                            backgroundColor: GREEN_SOFT,
                        }}
                    >
                        <CheckCircle
                            sx={{
                                fontSize: 15,
                                color: GREEN,
                            }}
                        />
                    </div>

                    <span
                        className="text-xs font-medium"
                        style={{
                            color: "#8B93A0",
                        }}
                    >
                        You're all caught up
                    </span>
                </div>
            )}
        </div>
    );
}