/**
 * DUST — single source of truth for catalogue + content.
 * Extracted verbatim from https://dust-seven.vercel.app/
 * Structured so a production backend (Shopify / Supabase / CMS) can replace
 * these literals behind the same Product/Collection interfaces.
 */

import ragiHero from "@/assets/ragi-hero.png";
import ragiPouch from "@/assets/ragi-pouch.png";
import ragiPack from "@/assets/ragi-pack.png";
import ragiPoster from "@/assets/ragi-poster.png";
import ragiInfographic from "@/assets/ragi-infographic.png";
import laddooMix from "@/assets/laddooMix.png";
import paanPack from "@/assets/paan-pack.png";
import paanPouch from "@/assets/paan-pouch.jpg";
import paanDuo from "@/assets/paan-duo.jpg";
import paanPoster from "@/assets/paan-poster.jpeg";
import storyPaan from "@/assets/story-paan-dark.jpg";

export const img = {
  ragiHero,
  ragiPouch,
  ragiPack,
  ragiPoster,
  ragiInfographic,
  laddooMix,
  paanPack,
  paanPouch,
  paanDuo,
  paanPoster,
  storyRagi: ragiPouch,
  storyPaan,
};

export const companyInfo = {
  name: "Everest Edges Pvt. Ltd.",
  brand: "DUST",
  cin: "U10309PN2026PTC258739",
  dipp: "DIPP284597",
  dpiitRecognition: "DIPP284597",
  dpiitCertificatePdf: "/startup-india-certificate.pdf",
  pan: "AAJCE8999E",
  tan: "PNEE12048B",
  gstin: "27AAJCE8999E1ZX",
  fssai: "In Process",
  phone: "8600694906",
  phoneFormatted: "+91 86006 94906",
  whatsapp: "8600694906",
  whatsappLink: "https://wa.me/918600694906?text=Hi%20DUST%20Team%2C%20I%20have%20an%20enquiry",
  email: "customercare@dustofficial.com",
  businessEmail: "everestedges@gmail.com",
  domain: "dustofficial.com",
  address: "Silver Gracia, Ravet, Pune – 412101, Maharashtra, India",
  tagline: "CHOICE OF MOTHERLAND",
  coreProposition: "Indian Taste × Convenience × Ingredient Transparency × Accessible Pricing",
  purpose: "Building India’s next generation of consumer brands — from nourishing food and Wholesome Laddoo premix mixes to fruit powders and personal care.",
  vision: "Build a nationally recognized Indian consumer brand that originates in India and scales globally.",
};

export interface RitualStep {
  title: string;
  detail: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  subtitle: string;
  pitch: string;
  category: "wholesome-millets" | "pure-fruit-powders" | "heritage-wellness";
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  priceDisplay: string;
  originalPriceDisplay?: string;
  unitDisplay: string;
  savePercent?: number;
  netWeight: string;
  badges: string[];
  description: string[];
  caution?: string;
  ingredients: string;
  allergen?: string;
  storage: string;
  disclaimer?: string;
  preparation?: string;
  nutrition: { serving: string; note: string; rows: [string, string, string][] };
  claims: string[];
  ritual: RitualStep[];
  ritualLabel: string;
  heritageTitle: string;
  heritageQuote: string;
  images: { src: string; alt: string }[];
  storyImage: string;
  posterImage?: string;
  infographicImage?: string;
  accent: "amber" | "rose" | "emerald";
  stock: number;
  sku: string;
  fssai: string;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
}

export interface Collection {
  slug: "wholesome-millets" | "pure-fruit-powders" | "heritage-wellness";
  name: string;
  titleLines: [string, string];
  tagline: string;
  description: string;
  meta: { label: string; value: string }[];
  shelfTitle: string;
  shelfDescription: string;
  shelfNote: string;
  comingTitle: string;
  comingText: string;
  pillars: { title: string; text: string }[];
  crossTitle: string;
  crossText: string;
  crossCta: string;
  crossHref: string;
  heroImage: string;
}

export const products: Product[] = [
  {
    id: "ragi-laddoo-01",
    slug: "shahi-ragi-dry-fruit-laddoo-mix",
    name: "Shahi Ragi & Dry Fruit Laddoo Mix",
    shortName: "Ragi Laddoo Mix",
    subtitle: "Wholesome Laddoo Premix | Premium Nuts | Traditional Taste",
    pitch: "Wholesome Laddoo Premix & Premium Nuts — Ready to Shape",
    category: "wholesome-millets",
    categoryLabel: "Wholesome Laddoo Premix",
    price: 229,
    originalPrice: 259,
    priceDisplay: "₹229",
    originalPriceDisplay: "₹259",
    unitDisplay: "₹229 / 250g Pack",
    savePercent: 12,
    netWeight: "250g",
    badges: ["Wholesome Laddoo Premix", "Premium Dry Fruits", "No Added Sugar"],
    description: [
      "Made with nutritious Ragi and a delicious blend of dry fruits, our Ragi & Dry Fruit Laddoo Mix is a convenient way to prepare tasty, wholesome laddoos at home.",
      "Perfect for breakfast, snacking, or whenever you crave something naturally delicious.",
      "Rooted in Indian tradition and packed with natural nutrition for a healthier tomorrow.",
    ],
    disclaimer:
      "Product image shown for illustrative purposes only. Actual product, ingredients, appearance and packaging may vary. Please refer to the actual product label for complete details.",
    preparation:
      "Add ghee as per your requirement of mix. Mix knead thoroughly and shape into laddoos.enjoy it .",
    ingredients:
      "Ragi, Date Powder, Almond, Cashew, Pumpkin Seed, Sunflower Seed, Watermelon Seed, Flax Seed, Cardamom.",
    allergen:
      "Contains: Ghee, Almonds, Cashews, Pistachios & Other Tree Nuts.",
    storage:
      "Store in a cool, dry place away from sunlight, heat & moisture. Shelf life: 6 months. Consume within 20-25 days after opening.",
    nutrition: {
      serving: "Per 100g",
      note: "Pack Net Wt: 250g",
      rows: [
        ["Energy", "423.63 kcal", "21%*"],
        ["Protein", "14.66g", "27%*"],
        ["Fat", "16.75g", "25%*"],
        ["Carbohydrate", "53.56g", "19%*"],
        ["Total Sugar", "40.76g", "—"],
        ["Added Sugar", "0g", "0%*"],
      ],
    },
    claims: [
      "Energy Snack — natural, sustained fuel throughout the day",
      "Supports Bone Health — calcium and mineral rich finger millet (ragi)",
      "Keeps You Fuller For Longer — nutrient-dense seeds and wholesome dry fruits",
      "No Added Sugar — naturally sweetened with pure date powder",
      "100% Wholesome Ingredients & Premium Nuts",
    ],
    ritualLabel: "Preparation Method",
    ritual: [
      {
        title: "Measure & Add Ghee",
        detail:
          "Add ghee as per your requirement of mix into a clean mixing bowl.",
      },
      {
        title: "Knead Thoroughly",
        detail:
          "Mix and knead thoroughly until the warm ghee blends evenly with the roasted ragi and nut mix.",
      },
      {
        title: "Shape into Laddoos & Enjoy",
        detail:
          "Shape the mixture by hand into round, wholesome laddoos. Enjoy fresh, healthy nutrition anytime.",
      },
    ],
    heritageTitle: "Wholesome Laddoo premix Heritage",
    heritageQuote:
      "Natural nutrition for a healthier tomorrow. Made for those who choose better — crafted with pure finger millet (ragi), crunchy roasted nuts, and pure date powder.",
    images: [
      {
        src: ragiPouch,
        alt: "DUST Shahi Ragi & Dry Fruit Laddoo Mix 250g front pouch packaging",
      },
      {
        src: ragiPoster,
        alt: "DUST Shahi Ragi & Dry Fruit Laddoo Mix official brand poster",
      },
      {
        src: ragiInfographic,
        alt: "DUST Shahi Ragi & Dry Fruit Laddoo Mix nutritional & ingredient infographic",
      },
      {
        src: ragiPack,
        alt: "DUST Shahi Ragi & Dry Fruit Laddoo Mix back packaging with nutritional facts and preparation",
      },
      {
        src: ragiHero,
        alt: "DUST Shahi Ragi & Dry Fruit Laddoo Mix full pack display",
      },
    ],
    storyImage: ragiPouch,
    posterImage: ragiPoster,
    infographicImage: ragiInfographic,
    accent: "amber",
    stock: 50,
    sku: "DUST-RAGI-250",
    fssai: "12545678901024",
    featured: true,
    newArrival: true,
    bestSeller: true,
  },
  {
    id: "paan-digestive-shot-01",
    slug: "paan-digestive-shot",
    name: "Paan Digestive Shot",
    shortName: "Paan Digestive Shot",
    subtitle: "Heritage Wellness — Digestive Blend",
    pitch: "Experience the royal taste of Paan",
    category: "heritage-wellness",
    categoryLabel: "Heritage Wellness",
    price: 299,
    originalPrice: 350,
    priceDisplay: "₹299",
    originalPriceDisplay: "₹350",
    unitDisplay: "Box of 10 Sachets",
    savePercent: 15,
    netWeight: "Box of 10 Sachets",
    badges: ["Royal Blend", "Digestive Shot"],
    description: [
      "Crafted with real betel leaf extract, aromatic gulkand, fennel, rose and cardamom.",
      "Each box contains 10 individual digestive shot sachets (each sachet makes 2 refreshing shots — 20 shots total).",
      "DUST Paan Digestive Shot is your perfect after-meal ritual for freshness and digestion.",
      "Mix sachet in 60 ml of water and drink after your meal",
    ],
    caution:
      "Pregnant or lactating women and people with medical conditions should consult a health professional before use.",
    ingredients:
      "Cane sugar, gulkand powder, betel leaf extract, fennel powder, coconut powder, rose petal powder, cardamom powder, mint powder, inulin (prebiotic fiber), calcium citrate, citric acid, natural paan flavor.",
    storage: "Store in dry, cool conditions. Shelf life 9 months from manufacture.",
    disclaimer:
      "Product images, serving suggestions, and packaging visuals are for illustrative purposes only. Actual product appearance, packaging, and color may vary. Please refer to the physical product label for complete details.",
    nutrition: {
      serving: "Serving Size: 10g (Half Pouch)",
      note: "Per 20g Pouch",
      rows: [
        ["Energy", "70 kcal", "—"],
        ["Total Fat", "0.3g", "0.5%*"],
        ["Sodium", "25mg", "1%*"],
        ["Total Carbohydrate", "17g", "6%*"],
        ["Total Sugars", "14g", "28%*"],
        ["Dietary Fiber", "1.0g", "4%*"],
        ["Protein", "0.3g", "1%*"],
        ["Calcium", "80mg", "8%*"],
      ],
    },
    claims: [
      "Box of 10 Sachets",
      "Real Betel Leaf",
      "Aromatic Gulkand",
      "Digestive Herbs",
      "Mouth Freshener",
      "Instant Shot",
      "No Colors",
      "No Preservatives",
      "100% Vegetarian",
      "Source of Calcium",
      "Prebiotic Fiber",
    ],
    ritualLabel: "How to Enjoy",
    ritual: [
      {
        title: "Tear & Pour",
        detail: "Empty the digestive shot powder from the pouch into a glass.",
      },
      { title: "Add Water", detail: "Pour 60 ml of chilled water into the glass." },
      {
        title: "Stir Well",
        detail:
          "Stir well until the gulkand and betel leaf extracts dissolve completely.",
      },
      {
        title: "Enjoy After Meals",
        detail: "Drink after lunch or dinner as a refreshing digestive ritual.",
      },
    ],
    heritageTitle: "The Royal Paan Legacy",
    heritageQuote:
      "For centuries, royal Paan was served in silver boxes to nobility as the ultimate after-meal Digestive. Crafted with real betel leaf extract, fennel, and premium rose gulkand, every sip of DUST Paan Digestive Shot captures that exact traditional fresh Digestive ritual.",
    images: [
      { src: "/paan_image_2.jpeg", alt: "DUST Paan Digestive Shot standup pouch front and back with nutritional info" },
      { src: "/paan_image_1.jpeg", alt: "DUST Paan Digestive Shot authentic pack box and glass shot" },
      { src: "/paan_image_3.jpeg", alt: "DUST Paan Digestive Shot box back and ingredient details" },
    ],
    storyImage: "/paan_image_2.jpeg",
    accent: "rose",
    stock: 36,
    sku: "DUST-BP-20",
    fssai: "12545678901024",
    featured: true,
    newArrival: true,
    bestSeller: true,
  },
];

export const collections: Collection[] = [
  {
    slug: "wholesome-millets",
    name: "Wholesome Laddoo Premix",
    titleLines: ["Wholesome", "Millets."],
    tagline: "Ancient grains & traditional dry fruit mixes crafted for everyday nutrition.",
    description:
      "100% wholesome Ragi, date powder sweetness, and premium roasted dry fruits — pure natural fuel with zero added sugar.",
    meta: [
      { label: "Format", value: "Ready-to-Shape Mix" },
      { label: "Net Wt.", value: "250g" },
      { label: "Promise", value: "No Added Sugar" },
    ],
    shelfTitle: "The Millet Shelf",
    shelfDescription:
      "Wholesome traditional superfoods packed with calcium, protein, and energy for the modern Indian family.",
    shelfNote: "01 Creation · More Roasting",
    comingTitle: "Next superfood loading",
    comingText: "New millet blends and wholesome traditional mixes are being crafted.",
    pillars: [
      {
        title: "100% Wholesome Ragi & Nuts",
        text: "Finger millet rich in calcium and iron, blended with almonds, cashews, and healthy seeds.",
      },
      {
        title: "Zero Added Sugar",
        text: "Naturally sweetened with real date powder for pure guilt-free energy.",
      },
      {
        title: "Convenient Preparation",
        text: "Just add warm ghee, knead thoroughly, and shape into fresh nutritious laddoos in minutes.",
      },
    ],
    crossTitle: "Looking for something after meals?",
    crossText:
      "Transition from morning wholesome superfoods to our royal digestives — traditional post-meal mouth fresheners.",
    crossCta: "Explore Heritage Wellness",
    crossHref: "/collections/heritage-wellness",
    heroImage: laddooMix,
  },
  {
    slug: "heritage-wellness",
    name: "Heritage Wellness",
    titleLines: ["Heritage", "Wellness."],
    tagline: "Ancient rituals of the Indian table, distilled into modern shots.",
    description:
      "Real betel leaf, rose-petal gulkand and warming spice — the royal Digestive tradition, ready in a glass.",
    meta: [
      { label: "Format", value: "Box of 10 Sachets" },
      { label: "Servings", value: "Makes 20 Shots" },
      { label: "Promise", value: "Real Betel Leaf" },
    ],
    shelfTitle: "The Wellness Shelf",
    shelfDescription:
      "Post-meal digestives and botanical blends, formulated from recipes older than the printing press.",
    shelfNote: "01 Ritual · More Brewing",
    comingTitle: "Next ritual steeping",
    comingText: "New wellness blends are being steeped, tasted and perfected.",
    pillars: [
      {
        title: "The After-Meal Ritual",
        text: "A digestive shot to close the meal the way royal courts always have — fresh, floral, unhurried.",
      },
      {
        title: "Rooted in Royal Courts",
        text: "Paan presented in silver boxes was the final act of hospitality. We distilled it into a sachet.",
      },
      {
        title: "Ayurvedic Sensibility",
        text: "Gulkand, fennel and prebiotic inulin — time-tested botanicals, modern clean-label discipline.",
      },
    ],
    crossTitle: "Looking for wholesome nutrition?",
    crossText:
      "Cross over to our superfoods shelf — traditional Shahi Ragi & Dry Fruit Laddoo Mix for everyday bone health and sustained energy.",
    crossCta: "Explore Wholesome Laddoo Premix",
    crossHref: "/collections/wholesome-millets",
    heroImage: "/paan_image_1.jpeg",
  },
];

export interface JournalPost {
  slug: string;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  body: string[];
}

export const journalPosts: JournalPost[] = [
  {
    slug: "the-art-of-traditional-ragi-laddoos",
    tag: "Wholesome Laddoo Premix",
    date: "June 2025",
    title: "The Art of Wholesome Ragi & Dry Fruit Laddoos",
    excerpt:
      "A slow roasted millet tradition. How DUST blends pure ragi, dates, and crunchy nuts into wholesome everyday fuel.",
    body: [
      "In traditional Indian homes, mornings and festive gatherings were incomplete without the comforting aroma of roasted ragi and pure ghee.",
      "Finger millet (ragi) is celebrated across centuries for its exceptional calcium content, fiber, and bone-strengthening power. Blended with pure date powder and crunchy dry fruits, it delivers balanced energy without refined sugar spikes.",
      "Every pack of DUST Shahi Ragi & Dry Fruit Laddoo Mix honors this time-tested heritage: just add ghee, knead, and shape into wholesome laddoos that keep you energized and fuller for longer.",
    ],
  },
  {
    slug: "banaras-and-the-paan-tradition",
    tag: "Heritage",
    date: "May 2025",
    title: "The Royal Paan Tradition That Never Left",
    excerpt:
      "The fragrant aroma of gulkand and betel leaf. We trace the heritage of paan from tradition to modern wellness.",
    body: [
      "In royal Indian courts, dining was not merely sustenance; it was an elaborate ritual that concluded with the presentation of paan in silver boxes.",
      "This final mouth freshener and Digestive was a sign of hospitality, slow indulgence, and cellular care — a tradition celebrated across centuries.",
      "DUST Paan Digestive Shot revives this heritage Digestive: spray-dried betel leaf extract, premium rose petal preserve, cardamom, and prebiotic fiber inulin — royal freshness, instantly, wherever you are.",
    ],
  },
  {
    slug: "why-ragi-and-dry-fruits-are-the-ultimate-superfood",
    tag: "Ingredient Deep Dive",
    date: "April 2025",
    title: "Why Ragi and Dry Fruits are the Ultimate Daily Superfood",
    excerpt:
      "High calcium, plant protein, and healthy fats. Why ancient finger millet outshines modern processed snacks.",
    body: [
      "Ragi (finger millet) has three times more calcium than milk per 100g, making it one of the most potent natural sources of bone health and mineral density.",
      "When paired with heart-healthy almonds, cashews, sunflower, pumpkin, watermelon, and flax seeds, you get a complete macronutrient profile of protein, healthy fats, and sustained satiety.",
      "That is why DUST Shahi Ragi Laddoo Mix uses zero refined sugar and zero preservatives — pure traditional superfood nutrition as mother nature intended.",
    ],
  },
  {
    slug: "the-science-of-ayurvedic-digestion",
    tag: "Heritage",
    date: "March 2025",
    title: "The Science of Ayurvedic Digestion: Prebiotics and Herbs",
    excerpt:
      "Ancient India resolved digestive imbalances using natural prebiotic fibers. We look at the modern science of inulin and gulkand.",
    body: [
      "Long before the word prebiotic existed, the Indian table closed heavy meals with fennel, betel leaf and rose preserves — botanicals chosen for how they made the body feel after eating.",
      "Modern gut science has caught up: inulin, the prebiotic fiber in our Paan shot, feeds beneficial gut bacteria, while fennel's volatile oils ease post-meal heaviness.",
      "Gulkand — slow-cured rose petal preserve — brings its own cooling tradition. Time-tested botanicals, modern clean-label discipline.",
    ],
  },
  {
    slug: "solar-dehydration-in-food-preservation",
    tag: "Wholesome Heritage",
    date: "February 2025",
    title: "Solar Dehydration: The Cleanest Preservation Method",
    excerpt:
      "Sun-drying captures the soul of the harvest. A look at how solar energy preserves wholesome botanicals without chemicals or loss of bio-actives.",
    body: [
      "Before preservatives, there was the sun. Indian households have sun-cured grains, herbs and spices on terraces for centuries — not as a compromise, but as a craft.",
      "Gentle, low-temperature drying protects heat-sensitive vitamins and bio-actives that industrial high-heat processing destroys, and it needs no chemical assistance of any kind.",
      "Our processing and dehydration discipline follows the same principle: preserve what the harvest gave, add nothing it didn't.",
    ],
  },
  {
    slug: "fennel-and-cardamom-essential-oils",
    tag: "Ingredient Deep Dive",
    date: "January 2025",
    title: "Fennel and Cardamom: Essential Palate Cleansing Oils",
    excerpt:
      "The volatile oils in cardamom and fennel seeds have been used for centuries to clarify the palate and soothe the stomach.",
    body: [
      "Walk out of any traditional feast and you will be offered a pinch of fennel — not decoration, but technology. Its volatile oils cut through richness and reset the palate within seconds.",
      "Cardamom works differently: warm, floral, almost camphorous, it lifts aroma upward and lingers as sweetness long after the meal ends.",
      "Together they are the lungs of our Paan Digestive Shot — the reason one small glass can close an entire meal.",
    ],
  },
];

export const faqs = [
  {
    q: "What are the health benefits of this laddoo mix?",
    a: "DUST™ Ragi & Dry Fruit Laddoo Mix combines calcium-rich ragi with almonds, cashews, pumpkin seeds, watermelon seeds and sunflower seeds. It provides dietary fibre, plant-based nutrients, healthy fats and energy, making it a wholesome traditional snacking option.",
  },
  {
    q: "How many laddoos can we make out of each pack?",
    a: "One 250 g pack can make approximately 10–20 medium-sized laddoos, depending on the size you prefer.",
  },
  {
    q: "Can we make laddoos with milk?",
    a: "NO. However, adding ghee is a suitable option for binding the mixture. Follow the preparation instructions provided on the pack.",
  },
  {
    q: "Storage & Shelf Life: How should DUST™ Ragi & Dry Fruit Laddoo Mix be stored?",
    a: "DUST™️ Ragi & Dry Fruit Laddoo Mix should be stored in a cool, dry place, away from direct sunlight, heat and moisture.\n\n• Shelf Life: 6 months from the date of manufacturing, subject to validated shelf-life testing.\n• After Opening: Transfer the contents to a clean, dry, airtight container and consume within 20–25 days.\n• Refrigeration: Refrigeration may help slow down quality deterioration. Keep the product in an airtight container and protect it from moisture and condensation.\n\nAlways use a clean, dry spoon and reseal the pack properly after every use.",
  },
  {
    q: "How many days can we store the laddoos once made?",
    a: "For the best taste and freshness, prepare laddoos in small batches. Store them in a clean, airtight container. Laddoos once made can be stored up to 15–20 days in an airtight container.",
  },
  {
    q: "What is DUST made from?",
    a: "DUST powders are made from 100% real fruit and hand-selected Indian spices. We never use artificial flavours, synthetic colours, chemical preservatives, or fillers. Ever.",
  },
  {
    q: "How do I prepare a DUST sachet?",
    a: "Tear and empty one sachet into a glass. Add chilled water (60 ml for the Paan Digestive Shot, or 180-200ml for fruit blends), stir well until dissolved, and consume as directed.",
  },
  {
    q: "Do you offer free shipping?",
    a: "Yes! We offer Free Express Shipping on all prepaid orders of ₹799 and above. For Cash on Delivery (COD) orders, a delivery fee of ₹120 applies.",
  },
  {
    q: "How long does shipping take?",
    a: "All orders are processed and dispatched within 24 hours of confirmation. Delivery takes 2-4 business days for major metro cities, and 5-7 business days for regional locations.",
  },
  {
    q: "Do you ship across India?",
    a: "Yes. We deliver to over 27,000+ PIN codes across India covering all major states and union territories.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 7-day hassle-free return policy. If you receive damaged packages, missing sachets, or are not completely satisfied with your order, email us at support@dustfoods.com and we will issue a replacement or refund.",
  },
  {
    q: "How do I initiate a return?",
    a: "Reach out to our customer experience team with your order number. We will schedule a courier pickup from your address within 48 hours.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support all major payment options: Cash on Delivery (COD), UPI payments (Google Pay, Paytm, PhonePe, Bhim), and Credit/Debit Cards (Visa, Mastercard, RuPay).",
  },
  {
    q: "Is it safe to pay online?",
    a: "Yes, absolutely. Our checkout is protected by industry-standard SSL encryption and processed through PCI-DSS compliant payment gateways, ensuring that your banking data is never exposed.",
  },
  {
    q: "Are DUST products vegetarian and clean-label?",
    a: "Yes! DUST Shahi Ragi & Dry Fruit Laddoo Mix is 100% vegetarian, made with wholesome grains, dates, and nuts. Our Heritage Wellness series (like the Paan Digestive Shot) is also 100% vegetarian. Check the ingredients list on respective product pages for exact details.",
  },
  {
    q: "Do DUST products contain added sugar?",
    a: "DUST Shahi Ragi & Dry Fruit Laddoo Mix contains 0g added sugar — it is naturally sweetened with pure date powder. DUST Paan Digestive Shot contains sugars sourced entirely from natural gulkand powder. We never use high-fructose corn syrup or artificial sweeteners.",
  },
  {
    q: "What is the shelf life of the products?",
    a: "Each pack remains fresh for 9 months from the date of manufacture when stored in cool, dry conditions away from direct sunlight.",
  },
];

export const testimonials = [
  {
    quote: "The Shahi Ragi Laddoo Mix is incredible! Just added warm ghee and rolled fresh, nutritious laddoos in 5 minutes.",
    author: "Ananya R. · Pune",
  },
  {
    quote: "The Paan Digestive Shot is a game changer. It's become my favorite post-dinner ritual.",
    author: "Vikram S. · Lucknow",
  },
  {
    quote: "Pure, honest flavors. You can tell it's made from real roots and wholesome ingredients. Highly recommended.",
    author: "Meera K. · Bengaluru",
  },
  {
    quote: "Packed with energy and keeps me full for hours without any sugar crashes. The kids love it too!",
    author: "Rohan D. · Manali",
  },
  {
    quote: "My grandmother approved of the paan shot. That's the highest certification there is.",
    author: "Ishita B. · Varanasi",
  },
];

export const marqueeItems = [
  "Real Fruit & Herbs",
  "No Artificial Anything",
  "Just Add Water",
  "Rooted in Indian Tradition",
  "Hand-Roasted Desi Spices",
  "Ready in Under a Minute",
];

export const waysToEnjoy = [
  "After Meals",
  "Summer Coolers",
  "On the Go",
  "Festive Gifting",
  "Everyday Ritual",
];

export const contact = {
  email: "support@dustfoods.com",
  hello: "hello@dustfoods.com",
  phone: "+91 86006 94906",
  response: "Questions, wholesale inquiries, or feedback on our recipes—we read every message and respond within 12 hours.",
};

export const brand = {
  name: "DUST",
  tagline: "Choice of Motherland",
  mission:
    "Rooted in nature. Made for modern India. Discover nourishing food blends, fruit-powered refreshments, everyday nutrition and nature-inspired personal care.",
  newsletter: {
    title: "Join the Ritual",
    text: "Seasonal launches, folklore recipes & honest stories from the fields — direct to your inbox.",
  },
  payments: ["Visa", "MC", "UPI", "GPay", "NetBanking"],
  trustBadges: ["Free Shipping", "Easy Returns", "Secure Payments", "Customer Support"],
};

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const productsByCollection = (slug: string) =>
  products.filter((p) => p.category === slug);
export const relatedProducts = (slug: string) => products.filter((p) => p.slug !== slug);
