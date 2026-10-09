"use client";

import { MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/constants";

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    "Hi! I'd like to know more about PickleCart products."
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-4 z-40 w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
    >
      <MessageCircle size={24} fill="white" />
    </a>
  );
}
