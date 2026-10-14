import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/services/products";
import { products as fallbackProducts } from "@/lib/data/products";
import ProductCard from "@/components/products/ProductCard";
import Button from "@/components/ui/Button";
import { CONTACT, SITE_URL } from "@/lib/constants";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/seo/schema";
import { 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Package, 
  HeartHandshake 
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pickles in Bangalore | Buy Traditional Andhra & South Indian Pickles | PickleCart",
  description:
    "Looking for authentic pickles in Bangalore? Handcrafted traditional Andhra avakaya, gongura, chicken pickles, mutton pickles & podis dispatched locally from K.R. Puram across Bangalore. Free delivery above ₹1500.",
  alternates: {
    canonical: "/pickles-in-bangalore",
  },
  openGraph: {
    title: "Pickles in Bangalore | Buy Traditional Andhra & South Indian Pickles | PickleCart",
    description:
      "Looking for authentic pickles in Bangalore? Handcrafted traditional Andhra avakaya, gongura, chicken pickles & podis dispatched locally from K.R. Puram across Bangalore.",
    url: `${SITE_URL}/pickles-in-bangalore`,
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740847/picklecart_assets/picklecartimg4.png",
        width: 1200,
        height: 630,
        alt: "PickleCart - Authentic Pickles in Bangalore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pickles in Bangalore | Buy Traditional Andhra & South Indian Pickles | PickleCart",
    description:
      "Handcrafted traditional Andhra avakaya, gongura, chicken pickles & podis dispatched locally across Bangalore.",
  },
};

const BANGALORE_FAQS = [
  {
    question: "Where in Bangalore is PickleCart located?",
    answer: "PickleCart operates from Kodigehalli Main Road, K.R. Puram, Bangalore - 560036. Orders are prepared and dispatched directly from our Bangalore hub to ensure maximum freshness.",
  },
  {
    question: "How fast is pickle delivery within Bangalore?",
    answer: "Orders in Bangalore are typically processed and handed over to logistics within 24 to 48 hours. Standard courier delivery across Bangalore usually takes 2 to 3 business days.",
  },
  {
    question: "Do you offer authentic Andhra and non-veg pickles in Bangalore?",
    answer: "Yes! Our Bangalore kitchen catalogue includes traditional Andhra Avakaya, tangy Gongura pachadi, boneless Andhra Chicken pickle, Mutton pickle, and Prawns pickle crafted with cold-pressed sesame oil and authentic Guntur spices.",
  },
  {
    question: "What are the shipping charges for Bangalore deliveries?",
    answer: "We provide FREE delivery on all orders above ₹1,500. For orders below this threshold, a flat delivery fee of ₹99 applies across all Bangalore pincodes.",
  },
  {
    question: "Can I order bulk pickles or return gift hampers for corporate events or weddings in Bangalore?",
    answer: "Yes, we cater to corporate gifting, IT park bulk orders, wedding return gifts, and special celebrations across Bangalore. You can submit an enquiry via our Corporate & Bulk Orders page.",
  },
];

const BANGALORE_AREAS = [
  "K.R. Puram & Whitefield",
  "Indiranagar & Domlur",
  "Koramangala & HSR Layout",
  "Marathahalli & Bellandur",
  "Electronic City & Sarjapur",
  "Jayanagar & JP Nagar",
  "Malleshwaram & Rajajinagar",
  "Hebbal & Yelahanka",
  "Banashankari & BTM Layout",
  "Kalyan Nagar & Kammanahalli",
];

export default async function PicklesInBangalorePage() {
  let allProducts = [];
  try {
    const live = await getProducts();
    allProducts = Array.isArray(live) && live.length > 0 ? live : fallbackProducts;
  } catch (e) {
    allProducts = fallbackProducts;
  }

  // Filter top Bangalore favourites (Avakaya, Gongura, Chicken, Thokku, Podis)
  const bangaloreHighlights = allProducts.slice(0, 8);

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Pickles in Bangalore", url: "/pickles-in-bangalore" },
  ]);

  const faqSchema = generateFAQSchema(BANGALORE_FAQS);

  return (
    <div className="bg-warm-white min-h-screen">
      {breadcrumbsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hero Banner */}
      <section className="relative bg-[#1A1612] text-warm-white py-14 sm:py-20 overflow-hidden border-b border-[#2C241E]">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image
            src="https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740866/picklecart_assets/southindianpagebackground.png"
            alt="Traditional Pickle Jars Background"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="container-main relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-body text-warm-white/70 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-warm-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-turmeric-gold font-medium">Pickles in Bangalore</span>
          </nav>

          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-turmeric-gold/20 text-turmeric-gold text-xs font-semibold uppercase tracking-wider mb-4 border border-turmeric-gold/30">
            <MapPin size={14} /> Dispatched from K.R. Puram, Bangalore
          </span>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
            Authentic Pickles in Bangalore, <br className="hidden sm:inline" />
            <span className="text-turmeric-gold">Full of Regional Tradition</span>
          </h1>

          <p className="font-body text-warm-white/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Craving nostalgic, fiery homemade-style pickles? PickleCart brings authentic Andhra avakaya, tangy gongura, non-veg chicken pickles, and traditional podis right to your doorstep across Bangalore.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="#products" size="lg" className="shadow-lg">
              Explore Bangalore Favourites
            </Button>
            <Button href="/corporate-bulk-orders" variant="outline-light" size="lg">
              Bulk & Corporate Orders
            </Button>
          </div>
        </div>
      </section>

      {/* Trust & Coverage Highlights */}
      <section className="bg-cream py-8 border-b border-border-light">
        <div className="container-main px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-xs border border-black/5">
              <div className="w-10 h-10 rounded-full bg-heritage-green/10 flex items-center justify-center text-heritage-green shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-charcoal">Bangalore-Wide Delivery</p>
                <p className="font-body text-xs text-charcoal-muted">All pincodes covered</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-xs border border-black/5">
              <div className="w-10 h-10 rounded-full bg-pickle-red/10 flex items-center justify-center text-pickle-red shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-charcoal">Cold-Pressed Oils</p>
                <p className="font-body text-xs text-charcoal-muted">Sesame & mustard base</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-xs border border-black/5">
              <div className="w-10 h-10 rounded-full bg-turmeric-gold/15 flex items-center justify-center text-turmeric-gold shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-charcoal">Free Shipping &gt; ₹1,500</p>
                <p className="font-body text-xs text-charcoal-muted">Or flat ₹99 across India</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-xs border border-black/5">
              <div className="w-10 h-10 rounded-full bg-charcoal/10 flex items-center justify-center text-charcoal shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-charcoal">Local Bangalore Hub</p>
                <p className="font-body text-xs text-charcoal-muted">{CONTACT.address.split(',')[0]}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Content: Authentic Regional Pickle Experience in Bangalore */}
      <section className="py-12 sm:py-16">
        <div className="container-main px-4 max-w-4xl mx-auto">
          <div className="prose prose-stone max-w-none">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-4">
              Why Bangalore Chooses PickleCart for Authentic Pickles
            </h2>
            <p className="font-body text-charcoal-muted leading-relaxed text-sm sm:text-base mb-6">
              Bangalore is a vibrant home for diverse communities from Andhra Pradesh, Telangana, Tamil Nadu, and North India who cherish genuine culinary traditions. However, finding authentic regional pickles made without artificial preservatives or commercial chemical vinegars can be challenging in everyday supermarkets.
            </p>
            <p className="font-body text-charcoal-muted leading-relaxed text-sm sm:text-base mb-6">
              At <strong>PickleCart</strong>, our recipes originate directly from traditional family practices. From hand-chopped raw mangoes sun-dried with Guntur red chillies to authentic spicy chicken and mutton pickles marinated in wood-pressed sesame oil, each jar captures the comforting warmth of homemade culinary craft.
            </p>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-charcoal mt-8 mb-3">
              Popular Pickle Varieties Loved in Bangalore
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-6">
              <div className="bg-cream/40 p-4 rounded-xl border border-border-light">
                <h4 className="font-display font-bold text-charcoal text-base mb-1">Andhra Veg Pickles</h4>
                <p className="font-body text-xs text-charcoal-muted">
                  Fiery raw mango Avakaya, traditional Gongura pachadi, tangy Tomato pickle, and Amla achaar made with cold-pressed sesame oil.
                </p>
                <Link href="/south-indian/andhra-delights" className="inline-flex items-center gap-1 text-xs font-semibold text-heritage-green mt-2 hover:underline">
                  View Andhra Pickles <ChevronRight size={12} />
                </Link>
              </div>

              <div className="bg-cream/40 p-4 rounded-xl border border-border-light">
                <h4 className="font-display font-bold text-charcoal text-base mb-1">Spicy Non-Veg Pickles</h4>
                <p className="font-body text-xs text-charcoal-muted">
                  Succulent boneless Chicken pickle, rich Mutton pickle, and coastal coastal Prawns pickle slow-simmered in aromatic spices.
                </p>
                <Link href="/south-indian" className="inline-flex items-center gap-1 text-xs font-semibold text-heritage-green mt-2 hover:underline">
                  View Non-Veg Pickles <ChevronRight size={12} />
                </Link>
              </div>

              <div className="bg-cream/40 p-4 rounded-xl border border-border-light">
                <h4 className="font-display font-bold text-charcoal text-base mb-1">Karnataka & Tamil Nadu Thokkus</h4>
                <p className="font-body text-xs text-charcoal-muted">
                  Smooth grated Mango Thokku, classic Vadu Mangai style, and aromatic curry leaf preparations popular in Bangalore households.
                </p>
                <Link href="/south-indian/karnataka-specials" className="inline-flex items-center gap-1 text-xs font-semibold text-heritage-green mt-2 hover:underline">
                  View Karnataka Specials <ChevronRight size={12} />
                </Link>
              </div>

              <div className="bg-cream/40 p-4 rounded-xl border border-border-light">
                <h4 className="font-display font-bold text-charcoal text-base mb-1">Traditional Podis & Gunpowder</h4>
                <p className="font-body text-xs text-charcoal-muted">
                  Aromatic Idli Milagai Podi, Kandi Podi, Karivepaku Podi, and Nalla Karam to elevate daily breakfasts and busy weeknights.
                </p>
                <Link href="/south-indian" className="inline-flex items-center gap-1 text-xs font-semibold text-heritage-green mt-2 hover:underline">
                  Explore Podis <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section id="products" className="py-12 bg-white border-t border-border-light">
        <div className="container-main px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal mb-3">
              Order Online for Bangalore Delivery
            </h2>
            <p className="font-body text-charcoal-muted text-sm sm:text-base">
              Choose your preferred pack size (250g, 500g, or 1kg) and receive fresh jars directly at home.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bangaloreHighlights.map((product) => (
              <ProductCard key={product.id || product.slug} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Button href="/south-indian" size="lg" variant="outline">
              Browse All Regional Collections
            </Button>
          </div>
        </div>
      </section>

      {/* Bangalore Delivery Areas List */}
      <section className="py-12 bg-cream/50 border-t border-border-light">
        <div className="container-main px-4 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-charcoal mb-2">
              Doorstep Courier Delivery Across Bangalore Localities
            </h2>
            <p className="font-body text-sm text-charcoal-muted">
              We dispatch via trusted courier partners to residential and office addresses across all major Bangalore zones:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {BANGALORE_AREAS.map((area, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-black/5 text-center shadow-xs">
                <span className="font-body text-xs font-medium text-charcoal block">
                  {area}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white p-6 rounded-2xl border border-border-light shadow-xs text-center">
            <h3 className="font-display text-lg font-bold text-charcoal mb-2">
              Corporate Gifting & Bulk Orders in Bangalore Tech Parks
            </h3>
            <p className="font-body text-sm text-charcoal-muted max-w-2xl mx-auto mb-4">
              Planning Diwali gifts, festive food hampers, or wedding return gifts for friends and colleagues in Bangalore? PickleCart provides tailored custom packaging and volume delivery.
            </p>
            <Button href="/corporate-bulk-orders" size="sm">
              Enquire for Bulk Orders
            </Button>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-14 sm:py-16 bg-white border-t border-border-light">
        <div className="container-main px-4 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-2">
              Frequently Asked Questions About Bangalore Orders
            </h2>
            <p className="font-body text-sm text-charcoal-muted">
              Everything you need to know about purchasing and receiving PickleCart pickles in Bangalore.
            </p>
          </div>

          <div className="space-y-4">
            {BANGALORE_FAQS.map((faq, index) => (
              <div key={index} className="bg-cream/40 rounded-xl p-5 border border-border-light">
                <h3 className="font-display font-bold text-base sm:text-lg text-charcoal mb-2">
                  {faq.question}
                </h3>
                <p className="font-body text-sm text-charcoal-muted leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
