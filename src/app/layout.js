import { Suspense } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import BackToTop from "@/components/common/BackToTop";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import AOSInit from "@/components/common/AOSInit";
import { getStoreSettings } from "@/services/settings";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/seo/schema";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: `${SITE_NAME} | Traditional Indian Pickles Online`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "./",
  },
  keywords: [
    "pickles in bangalore",
    "buy pickles online",
    "traditional indian pickles",
    "andhra pickles online",
    "south indian pickles",
    "non veg pickles bangalore",
    "andhra chicken pickle",
    "gongura pickle",
    "avakaya mango pickle",
    "traditional podis",
    "picklecart",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Traditional Indian Pickles Online`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740885/picklecart_assets/logo.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Fill Your Cart with Tradition`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Traditional Indian Pickles Online`,
    description: SITE_DESCRIPTION,
    images: [
      "https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740885/picklecart_assets/logo.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/newpicklecartfavicon.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/newpicklecartfavicon.png",
    apple: "/apple-icon.png",
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "hEFgALIWTd5nv4hDUeW6iSD6lwjJyspdciY_YpYFZVc",
  },
};

export default async function RootLayout({ children }) {
  const storeSettings = await getStoreSettings();
  const announcement = storeSettings?.announcement || null;

  const orgSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <AOSInit />
          <Suspense fallback={<div className="h-20 bg-white border-b" />}>
            <Navbar announcement={announcement} />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          <CartDrawer />
          <BackToTop />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
