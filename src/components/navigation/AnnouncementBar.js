"use client";

import { useState, useEffect } from "react";
import { getStoreSettings } from "@/services/settings";
import { Megaphone } from "lucide-react";

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await getStoreSettings();
      if (settings?.announcement?.enabled && settings.announcement.text) {
        setAnnouncement(settings.announcement);
      }
    };
    fetchSettings();
  }, []);

  if (!announcement) return null;

  return (
    <div className={`w-full py-2 px-4 ${announcement.bgColor || 'bg-earthy-brown'} flex items-center justify-center gap-2 z-50 relative`}>
      <Megaphone size={16} className={`${announcement.textColor || 'text-white'}`} />
      <p className={`text-xs md:text-sm font-medium ${announcement.textColor || 'text-white'} text-center`}>
        {announcement.text}
      </p>
    </div>
  );
}
