import { Suspense } from "react";
import TrackOrderContent from "@/components/orders/TrackOrderContent";

export const metadata = {
  title: "Track Your Order | Real-Time Courier Dispatch Status | PickleCart",
  description:
    "Track your PickleCart shipment in real-time. Enter your Order ID or registered 10-digit mobile number to view live carrier updates and delivery timelines.",
  alternates: {
    canonical: "/track",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-[75vh] flex items-center justify-center">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
