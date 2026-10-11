"use client";

import { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";
import { resolveAnnouncementBg } from "@/lib/constants";

export default function AnnouncementBar({ initialAnnouncement }) {
  const [announcement, setAnnouncement] = useState(
    initialAnnouncement ?? {
      enabled: true,
      text: "🚚 Free delivery above ₹1,500 — India delivery addresses only",
      bgColor: "bg-[#B84A32]",
      textColor: "text-white"
    }
  );

  useEffect(() => {
    if (initialAnnouncement) {
      setAnnouncement(initialAnnouncement);
    }
  }, [initialAnnouncement]);

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          const settings = data?.settings;
          if (isMounted && settings?.announcement) {
            if (settings.announcement.enabled === false) {
              setAnnouncement(null);
            } else if (settings.announcement.text) {
              setAnnouncement(settings.announcement);
            }
          }
        }
      } catch (err) {
        console.error("Announcement fetch error", err);
      }
    };
    if (!initialAnnouncement) {
      fetchSettings();
    }
    return () => { isMounted = false; };
  }, [initialAnnouncement]);

  if (!announcement || !announcement.enabled) return null;

  const resolvedBg = resolveAnnouncementBg(announcement.bgColor);

  return (
    <div 
      style={resolvedBg.hex ? { backgroundColor: resolvedBg.hex } : {}}
      className={`w-full py-2 px-4 ${resolvedBg.className || ''} flex items-center justify-center gap-2 z-50 relative transition-colors duration-300`}
    >
      <p className={`text-xs md:text-sm font-medium ${announcement.textColor || 'text-white'} text-center flex items-center justify-center gap-2`}>
        {announcement.text}
      </p>
    </div>
  );
}
