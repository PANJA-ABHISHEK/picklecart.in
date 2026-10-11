import { SITE_NAME, SITE_TAGLINE, SITE_URL, CONTACT } from "@/lib/constants";
import { resolveImage } from "@/services/images";

/**
 * Generate Organization / OnlineStore JSON-LD schema using verified business data.
 */
export function generateOrganizationSchema() {
  const logoUrl = "https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740885/picklecart_assets/logo.png";

  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
      width: 512,
      height: 512,
    },
    image: logoUrl,
    description: "Authentic Indian pickles, podis, powders, and traditional pantry staples crafted with time-honoured South and North Indian recipes, dispatched from Bangalore.",
    slogan: SITE_TAGLINE,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kodigehalli Main Road, K.R. Puram",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      postalCode: "560049",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 13.00457,
      longitude: 77.71804,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "11:00",
        closes: "21:00",
      },
    ],
    sameAs: [
      CONTACT.instagram,
      CONTACT.facebook,
    ].filter(Boolean),
    priceRange: "₹₹",
  };
}

/**
 * Generate WebSite JSON-LD schema with potential SearchAction.
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: "Fill Your Cart with Tradition — Buy Authentic Indian Pickles & Podis Online",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD schema.
 * @param {Array<{ name: string, url: string }>} items
 */
export function generateBreadcrumbSchema(items = []) {
  if (!items || items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate Product JSON-LD schema from actual product catalog data.
 * Adheres strictly to Google Merchant & Search standards without fabricating ratings.
 * @param {object} product
 */
export function generateProductSchema(product) {
  if (!product) return null;

  const productUrl = `${SITE_URL}/product/${product.id || product.slug}`;
  const rawImage = product.image || (Array.isArray(product.images) && product.images[0]) || null;
  const imageUrl = rawImage ? resolveImage(rawImage, { width: 800, height: 800, text: product.name }) : null;

  // Pricing & Variants
  const variants = product.pricing || product.variants || [];
  const minPrice = variants.length > 0 
    ? Math.min(...variants.map(v => Number(v.price) || 0))
    : Number(product.price) || 0;

  const isInStock = product.inStock !== false;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    url: productUrl,
    description: product.description || product.shortDescription || `${product.name} crafted with traditional recipes by PickleCart.`,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    category: Array.isArray(product.categoryIds) ? product.categoryIds.join(", ") : product.categoryId || "Food & Beverages > Pickles",
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: minPrice,
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      itemCondition: "https://schema.org/NewCondition",
      availability: isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: minPrice >= 1500 ? 0 : 99,
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 6,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };

  if (imageUrl) {
    schema.image = [imageUrl];
  }

  if (product.id || product.slug) {
    schema.sku = product.id || product.slug;
  }

  return schema;
}

/**
 * Generate FAQPage JSON-LD schema from questions & answers.
 * @param {Array<{ question: string, answer: string }>} faqs
 */
export function generateFAQSchema(faqs = []) {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
