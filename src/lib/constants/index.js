/* ── Site-wide Constants ── */

export const SITE_NAME = "PickleCart";
export const SITE_TAGLINE = "Fill Your Cart with Tradition";
export const SITE_DOMAIN = "picklecart.in";
export const SITE_URL = "https://picklecart.in";
export const SITE_DESCRIPTION =
  "Authentic Indian pickles, podis, snacks & traditional food products. Handcrafted with traditional recipes from Andhra, Telangana, Karnataka & Tamil Nadu.";

export const CONTACT = {
  phone: "+91 81238 08404",
  whatsapp: "+918123808404",
  email: "picklecartblr@gmail.com",
  address: "Kodigehalli Main Road, K.R. Puram, Bangalore - 560049",
  businessHours: "11:00 AM – 9:00 PM",
  instagram: "https://www.instagram.com/picklecartblr?vrfl=bWpnem5iZ2tzazZq&utm_source=qr",
  facebook: "https://www.facebook.com/people/picklecartblr/61594937865483/?mibextid=wwXIfr&rdid=UbFZHnMzFkFCSouJ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F14tc8bBzU9C%2F%3Fmibextid%3DwwXIfr",
  googleMapsEmbed:
    "https://maps.google.com/maps?q=13.004570007324219,77.7180404663086&t=&z=17&ie=UTF8&iwloc=&output=embed",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  {
    label: "South Indian Style",
    href: "/south-indian",
    children: [
      { label: "Andhra Delights", href: "/south-indian/andhra-delights" },
      { label: "Telangana Delights", href: "/south-indian/telangana-delights" },
      { label: "Karnataka Specials", href: "/south-indian/karnataka-specials" },
      { label: "Tamil Nadu Specials", href: "/south-indian/tamil-nadu-specials" },
    ],
  },
  { label: "North Indian Style", href: "/north-indian" },
  { label: "Corporate / Bulk Orders", href: "/corporate-bulk-orders" },
  { label: "Track Order", href: "/track" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export const REGIONS = [
  {
    id: "andhra-delights",
    name: "Andhra Delights",
    slug: "andhra-delights",
    shortDescription: "Bold, spicy, and fiery flavours from the heartland of Andhra Pradesh.",
    description:
      "Andhra Pradesh is renowned for its bold, fiery cuisine. Our Andhra Delights collection brings you authentic avakaya, gongura pickles, and spice-packed podis made the traditional way.",
    image: "/picklecartimg4.png",
    cardImage: "/AndhraPradeshregionhome.png",
    parentRoute: "/south-indian",
  },
  {
    id: "telangana-delights",
    name: "Telangana Delights",
    slug: "telangana-delights",
    shortDescription: "Rich, rustic, and deeply rooted in Telangana's food heritage.",
    description:
      "Telangana's cuisine is rich with rustic flavours and traditional recipes passed down through generations. Discover authentic pickles and podis from the Deccan heartland.",
    image: "/picklecartimg2.png",
    cardImage: "/Telanganaregionhome.png",
    parentRoute: "/south-indian",
  },
  {
    id: "karnataka-specials",
    name: "Karnataka Specials",
    slug: "karnataka-specials",
    shortDescription: "Unique flavours from Karnataka's diverse culinary traditions.",
    description:
      "Karnataka offers a diverse palette of flavours, from tangy mango thokku to aromatic curry leaf podis. Explore our carefully curated selection of Karnataka's finest.",
    image: "/picklecartimg1.png",
    cardImage: "/karnatakaregionhome.png",
    parentRoute: "/south-indian",
  },
  {
    id: "tamil-nadu-specials",
    name: "Tamil Nadu Specials",
    slug: "tamil-nadu-specials",
    shortDescription: "Time-honoured recipes from Tamil Nadu's rich culinary legacy.",
    description:
      "Tamil Nadu's culinary traditions are steeped in history and flavour. From classic vadu mangai to aromatic milagai podi, experience the taste of authentic Tamil Nadu.",
    image: "/picklecartimg5.png",
    cardImage: "/Tamilnaduregionhome.png",
    parentRoute: "/south-indian",
  },
  {
    id: "north-indian",
    name: "North Indian Style",
    slug: "north-indian",
    shortDescription: "Hearty, aromatic pickles from North India's vibrant food culture.",
    description:
      "North Indian pickles are known for their bold mustard oil base and aromatic spice blends. Discover our selection of classic aam ka achaar, mixed pickle, and more.",
    image: "/images/regions/north-india.jpg",
    cardImage: "/NorthIndia.png",
    parentRoute: null,
  },
];

export const CATEGORIES = [
  {
    id: "veg-pickles",
    name: "Veg Pickles",
    slug: "veg-pickles",
    description: "Traditional vegetarian pickles made with fresh produce and authentic spices.",
    image: "/images/categories/veg-pickles.jpg",
  },
  {
    id: "non-veg-pickles",
    name: "Non-Veg Pickles",
    slug: "non-veg-pickles",
    description: "Succulent non-vegetarian pickles with bold flavours and traditional preparation.",
    image: "/images/categories/non-veg-pickles.jpg",
  },
  {
    id: "podi-powders",
    name: "Podi & Powders",
    slug: "podi-powders",
    description: "Aromatic podis and spice powders to elevate every meal.",
    image: "/images/categories/podi-powders.jpg",
  },
  {
    id: "snacks",
    name: "Snacks",
    slug: "snacks",
    description: "Crunchy traditional snacks perfect for tea time and gatherings.",
    image: "/images/categories/snacks.jpg",
  },
  {
    id: "oils",
    name: "Oils",
    slug: "oils",
    description: "Cold-pressed and traditional oils for authentic cooking.",
    image: "/images/categories/oils.jpg",
  },
  {
    id: "groceries-millets",
    name: "Groceries & Millets",
    slug: "groceries-millets",
    description: "Premium quality groceries, millets, and traditional staples.",
    image: "/images/categories/groceries.jpg",
  },
  {
    id: "other-items",
    name: "Other Items",
    slug: "other-items",
    description: "Unique traditional items and seasonal specialties.",
    image: "/images/categories/other.jpg",
  },
];

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "popular", label: "Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export const REQUIREMENT_TYPES = [
  "Corporate Orders",
  "Bulk Orders",
  "Wholesale Orders",
  "Event Orders",
  "Return Gifts",
  "Custom Requirements",
  "Other",
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh",
  "Chandigarh", "Puducherry", "Andaman & Nicobar Islands",
];
