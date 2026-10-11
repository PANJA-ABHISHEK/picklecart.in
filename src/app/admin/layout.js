import { Suspense } from "react";
import AdminWrapper from "@/components/admin/AdminWrapper";

export const metadata = {
  title: "Admin Dashboard | PickleCart",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      <Suspense fallback={<div className="flex-1 p-8">Loading admin...</div>}>
        <AdminWrapper>
          {children}
        </AdminWrapper>
      </Suspense>
    </div>
  );
}

