import CorporateBulkOrdersContent from "@/components/sections/CorporateBulkOrdersContent";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/constants";

export const metadata = {
  title: "Corporate & Bulk Pickle Orders | Wholesale Gifting | PickleCart Bangalore",
  description:
    "Order authentic Indian pickles in bulk for corporate gifting, wedding return gifts, Diwali hampers, and events. Handcrafted in Bangalore with custom packaging & pan-India delivery.",
  alternates: {
    canonical: "/corporate-bulk-orders",
  },
  openGraph: {
    title: "Corporate & Bulk Pickle Orders | Wholesale Gifting | PickleCart Bangalore",
    description:
      "Order authentic Indian pickles in bulk for corporate gifting, wedding return gifts, Diwali hampers, and events.",
    url: `${SITE_URL}/corporate-bulk-orders`,
  },
};

export default function CorporateBulkOrdersPage() {
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Corporate & Bulk Orders", url: "/corporate-bulk-orders" },
  ]);

  return (
    <>
      {breadcrumbsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
        />
      )}
      <CorporateBulkOrdersContent />
    </>
  );
}
