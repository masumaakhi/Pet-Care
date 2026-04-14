import React, { useEffect, useState, useRef } from "react";
import { FaBell } from "react-icons/fa";
import rescueService from "../utils/rescueService";
import { useSocket } from "../context/SocketContext";

/**
 * In-app notifications (GET /api/notifications). Opening the panel marks all as read
 * so the badge clears; new notifications (e.g. socket) bring the count back.
 */
export default function NavNotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const wrapRef = useRef(null);
  const socket = useSocket();
  const prevOpenRef = useRef(false);

  const load = async () => {
    try {
      const res = await rescueService.getNotifications();
      if (res.data.success) setItems(res.data.data || []);
    } catch (_) {}
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onNew = () => load();
    socket.on("notification:new", onNew);
    return () => socket.off("notification:new", onNew);
  }, [socket]);

  /** When user opens the dropdown: mark all read server-side, then refresh (badge → 0). */
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      prevOpenRef.current = true;
      (async () => {
        try {
          await rescueService.markAllNotificationsRead();
        } catch (_) {}
        await load();
      })();
    }
    if (!open) {
      prevOpenRef.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const unread = items.filter((n) => !n.isRead).length;

  const markOne = async (nid) => {
    try {
      await rescueService.markNotificationAsRead(nid);
      setItems((prev) =>
        prev.map((x) => (x.id === nid ? { ...x, isRead: true } : x))
      );
    } catch (_) {}
  };

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-white/70 text-primary shadow-sm hover:bg-white transition"
        aria-label="Notifications"
      >
        <FaBell className="text-lg" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-white/50 bg-white/90 backdrop-blur-xl shadow-xl z-[80] py-2"
        >
          <div className="px-3 py-2 border-b border-black/5 text-sm font-semibold text-primary">
            Alerts
          </div>
          {items.length === 0 ? (
            <p className="px-3 py-6 text-sm text-black/60 text-center">No notifications yet</p>
          ) : (
            items.slice(0, 12).map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => !n.isRead && markOne(n.id)}
                className={`w-full text-left px-3 py-2.5 text-sm border-b border-black/5 hover:bg-white/80 ${
                  n.isRead ? "text-black/60" : "text-black font-medium bg-emerald-50/50"
                }`}
              >
                <div className="font-semibold line-clamp-1">{n.title}</div>
                <div className="text-xs mt-0.5 line-clamp-2 opacity-90">{n.message}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
