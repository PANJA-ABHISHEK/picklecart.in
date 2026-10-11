import Image from "next/image";
import { Leaf, Award, HandHeart, MapPin, ShieldCheck, Flame } from "lucide-react";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/constants";

export const metadata = {
  title: "About Us | Traditional Indian Pickles & Heritage | PickleCart Bangalore",
  description:
    "Learn about PickleCart's story, heritage, and traditional small-batch pickle craft. Handcrafted in Bangalore using authentic recipes, cold-pressed oils, and sun-dried spices.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Traditional Indian Pickles & Heritage | PickleCart Bangalore",
    description:
      "Learn about PickleCart's story, heritage, and traditional small-batch pickle craft in Bangalore.",
    url: `${SITE_URL}/about`,
  },
};

const values = [
  { icon: Leaf, title: "Authentic Ingredients", desc: "Sourced from trusted local farmers across India." },
  { icon: HandHeart, title: "Generational Recipes", desc: "Preserved traditions from ancient South Indian kitchens." },
  { icon: Flame, title: "Handcrafted Preparation", desc: "Small-batch, hand-mixed with absolute care and attention." },
  { icon: MapPin, title: "Regional Identity", desc: "Honouring every region's unique culinary personality." },
  { icon: ShieldCheck, title: "No Preservatives", desc: "Pure, natural ingredients — nothing artificial ever." },
  { icon: Award, title: "Quality Assured", desc: "Every product tested before it reaches your table." },
];

export default function AboutPage() {
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
  ]);

  return (
    <div className="bg-cream">
      {breadcrumbsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
        />
      )}
      {/* Hero Section */}
      <div className="relative min-h-[290px] sm:min-h-[320px] md:h-[360px] lg:h-[380px] overflow-hidden flex items-center justify-center py-10 md:py-0">
        {/* Using the original about us background image */}
        <Image 
          src="https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740861/picklecart_assets/aboutuspagebackground.png" 
          alt="About PickleCart Background" 
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-charcoal/40" />
        
        <div className="relative z-10 container-main flex flex-col items-center justify-center text-center px-4 pt-4 pb-8 md:py-0" data-aos="fade-up">
          <span className="text-xs md:text-sm font-body font-bold tracking-[0.25em] uppercase text-turmeric-gold mb-2 md:mb-3 block drop-shadow-md">
            Our Story
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-warm-white drop-shadow-lg mb-3 md:mb-4">
            The Soul of <span className="text-turmeric-gold">PickleCart</span>
          </h1>
          <p className="font-body text-warm-white/95 text-sm sm:text-base md:text-xl max-w-2xl mx-auto drop-shadow-md leading-relaxed font-medium">
            Discover the heritage, traditional recipes, and the undeniable passion that goes into every single jar we craft.
          </p>
        </div>

        {/* Elegant Wavy Bottom Divider - Colored to match bg-cream (#FDF6EC) */}
        <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 md:h-12 lg:h-16 relative block">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z" className="fill-[#FDF6EC]" />
          </svg>
        </div>
      </div>

      {/* The Journey Begins - Shop Photo */}
      {/* Inherits bg-cream to match the website theme perfectly */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="container-main">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14">
            <div className="w-full lg:w-4/12 flex lg:justify-end justify-center" data-aos="fade-right">
              {/* Increased size slightly and used lg:justify-end to push the image closer to the text, closing the empty space */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-cream inline-block w-full max-w-[280px] md:max-w-[320px] group bg-white">
                <Image 
                  src="https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740805/picklecart_assets/shopPhoto.jpg" 
                  alt="The PickleCart Storefront" 
                  width={600}
                  height={800}
                  loading="lazy"
                  className="w-full h-auto object-contain group-hover:scale-[1.03] transition-transform duration-1000 block"
                />
              </div>
            </div>
            
            <div className="w-full lg:w-7/12" data-aos="fade-left">
              <div className="text-center lg:text-left">
                <span className="text-sm font-body font-bold tracking-[0.2em] uppercase text-earthy-brown mb-4 block">Our Humble Beginnings</span>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-6 leading-tight text-balance">
                  From a Local Passion to Your Dining Table
                </h2>
              </div>
              <div className="space-y-5 font-body text-charcoal-light text-lg leading-relaxed text-center lg:text-left">
                <p>
                  PickleCart wasn't born in a boardroom; it blossomed in the heart of a bustling traditional market. What started as a small, beloved local shop with a handful of family recipes quickly grew into a mission to share the authentic taste of Indian heritage with the world.
                </p>
                <p>
                  We believe that the best flavours are the ones that remind you of home. Every spice blend we create and every jar we pack is a tribute to the grandmothers and artisan makers who perfected these recipes over centuries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Andhra Heritage */}
      {/* Uses bg-white to contrast with the cream sections above and below */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-turmeric-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="container-main relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
            <div className="w-full lg:w-1/2" data-aos="fade-right">
              <div className="text-center lg:text-left">
                <span className="text-sm font-body font-bold tracking-[0.2em] uppercase text-heritage-green mb-4 block">Preserving Generations</span>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-6 leading-tight text-balance">
                  The Authentic Andhra Tradition
                </h2>
              </div>
              <div className="space-y-4 font-body text-charcoal-light text-lg leading-relaxed mb-8 text-center lg:text-left">
                <p>
                  Andhra cuisine is legendary for its bold, fiery, and deeply aromatic profile. At PickleCart, we refuse to take shortcuts. We sun-dry our ingredients, hand-grind our spices, and use traditional cold-pressed oils.
                </p>
                <p>
                  It's not just about mixing ingredients; it's about respecting the ancient methods—the rhythm of the mortar and pestle, the patience of marination, and the instinct of the maker. This dedication is what locks in that unmistakable, mouth-watering Andhra flavour.
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  "Sun-dried to perfection for intense flavor.",
                  "Hand-mixed in small, artisanal batches.",
                  "Authentic Guntur chillies and cold-pressed oils."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-charcoal font-medium font-body text-lg">
                    <div className="w-7 h-7 rounded-full bg-heritage-green/10 flex items-center justify-center text-heritage-green flex-shrink-0 mt-0.5">
                      <ShieldCheck size={14} />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="w-full lg:w-1/2" data-aos="fade-left">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white w-full bg-white group">
                <Image 
                  src="https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740869/picklecart_assets/PickleCart_Andhra_Traditions.png" 
                  alt="Traditional Andhra Pickle Making Collage" 
                  width={1000}
                  height={1000}
                  loading="lazy"
                  className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700 block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crafting Perfection (Traditional Display) */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="container-main">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16 relative">
            
            <div className="w-full lg:w-5/12 lg:sticky lg:top-24" data-aos="fade-up-right">
              {/* Used sticky positioning and a strong aspect ratio so it stays perfectly aligned as you read the long text on the right */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-cream w-full aspect-[4/5] group bg-charcoal/5">
                <Image 
                  src="https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740867/picklecart_assets/Traditional_Pickle_Jar_Display.png" 
                  alt="Traditional Pickle Jars" 
                  fill
                  loading="lazy"
                  className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-1000 block"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-charcoal/95 via-charcoal/50 to-transparent pointer-events-none">
                  <p className="text-warm-white font-display text-3xl font-bold mb-2">The Classic Bharani</p>
                  <p className="text-warm-white/90 font-body text-base">Where time transforms ingredients into magic.</p>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-7/12" data-aos="fade-up-left">
              <div className="text-center mb-10">
                <span className="text-sm font-body font-bold tracking-[0.2em] uppercase text-earthy-brown mb-4 block">What We Stand For</span>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal leading-tight text-balance">
                  Our Quality Promise
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
                {values.map((v, idx) => {
                  const Icon = v.icon;
                  return (
                    <div key={idx} className="flex gap-4 group cursor-default">
                      <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-earthy-brown group-hover:bg-earthy-brown group-hover:text-white transition-all duration-300 flex-shrink-0 shadow-sm border border-black/5">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-charcoal mb-3">{v.title}</h3>
                        <p className="font-body text-charcoal-light leading-relaxed">{v.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A Jar for Every Palate (Display Shelf) */}
      {/* Uses bg-white for distinct separation before the dark footer */}
      <section className="py-16 md:py-24 lg:pb-32 relative bg-white border-t border-black/5">
        <div className="relative z-10 container-main flex flex-col items-center text-center max-w-6xl mx-auto" data-aos="fade-up">
           <span className="text-sm font-body font-bold tracking-[0.2em] uppercase text-earthy-brown mb-4 block">Explore The Range</span>
           <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-6 leading-tight text-balance">
             A Jar for Every <span className="text-turmeric-gold">Palate</span>
           </h2>
           <p className="font-body text-charcoal-light text-lg md:text-xl leading-relaxed mb-12 max-w-3xl">
             From fiery mango pickles that awaken your senses to the comforting tang of lemon, our collection represents the vibrant diversity of India's culinary landscape. We bring you an exquisite variety tailored for every meal.
           </p>
           
           {/* Used a sleek panoramic aspect ratio instead of a towering box, making it highly attractive and responsive */}
           <div className="w-full relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white bg-white aspect-video md:aspect-[21/9] group">
             <Image 
               src="https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740870/picklecart_assets/Picklecart_Jar_Display_Shelf.png" 
               alt="PickleCart Jar Display Shelf" 
               fill
               loading="lazy"
               className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-1000 block"
             />
           </div>
        </div>
      </section>
    </div>
  );
}
