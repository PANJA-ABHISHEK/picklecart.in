import ContactContent from "@/components/contact/ContactContent";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/constants";

export const metadata = {
  title: "Contact Us | Customer Support & Kitchen Location | PickleCart Bangalore",
  description:
    "Get in touch with PickleCart. Located at Kodigehalli Main Road, K.R. Puram, Bangalore - 560049. Call +91 81238 08404 or WhatsApp for order enquiries, bulk gifting, and delivery status.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | PickleCart Bangalore",
    description:
      "Get in touch with PickleCart Bangalore for pickle orders, wholesale, corporate queries, and customer support.",
    url: `${SITE_URL}/contact`,
  },
};

export default function ContactPage() {
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Contact Us", url: "/contact" },
  ]);

  return (
    <>
      {breadcrumbsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
        />
      )}
      <ContactContent />
    </>
  );
}
