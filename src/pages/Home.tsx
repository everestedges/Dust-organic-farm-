import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Eye,
  Heart,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Leaf,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Zap,
  AlertCircle,
  TrendingUp,
  Package,
  Users,
  BadgeCheck,
  IndianRupee,
  FlaskConical,
  Truck,
} from "lucide-react";
import { products as defaultProducts, collections, Product, companyInfo } from "@/lib/data";
import { useCartStore } from "@/lib/cart-store";
import { useProductsStore } from "@/lib/products-store";
import dustStandeeImg from "@/assets/dust-brand-usp-standee.webp";
import ragiPoster from "@/assets/ragi-poster.webp";
import ragiInfographic from "@/assets/ragi-infographic.webp";
import aboutBannerFarmWaste from "@/assets/about-banner-farm-waste.webp";
import aboutBannerLaddoo from "@/assets/about-banner-laddoo.webp";
import almondCollage from "@/assets/almond-powder-collage.webp";
import cashewCollage from "@/assets/cashew-powder-collage.webp";
import shampooInfographic from "@/assets/shampoo-infographic.webp";
import { CustomerTestimonials } from "@/components/cinematic/CustomerTestimonials";

const homeHeroBanners = [
  {
    image: shampooInfographic,
    alt: "DUST Natural Powder Shampoo for Men - 5 Traditional Herbs",
    title: "DUST™ Natural Powder Shampoo",
    subtitle: "Designed for Men | 5 Traditional Herbs | No-Foam Mask",
    price: "₹246",
    tag: "HERBAL GROOMING",
    productIndex: 2,
  },
  {
    image: cashewCollage,
    alt: "DUST Premium Cashew Powder - Pure Cashew Goodness",
    title: "DUST™ Premium Cashew Powder",
    subtitle: "Pure Cashew Goodness | Everyday Nutrition",
    price: "₹649",
    tag: "NEW LAUNCH",
    productIndex: 1,
  },
  {
    image: aboutBannerLaddoo,
    alt: "Warm Family Laddoo Mix - DUST Wholesome Goodness",
    title: "Shahi Ragi & Dry Fruit Laddoo Mix",
    subtitle: "Wholesome Laddoo Premix | Premium Nuts",
    price: "₹229",
    tag: "BEST SELLER",
    productIndex: 3,
  },
  {
    image: almondCollage,
    alt: "DUST Almond Powder - Pure Almond Goodness",
    title: "DUST™ Almond Powder",
    subtitle: "Pure Almond Goodness | Everyday Nutrition",
    price: "₹749",
    tag: "PURE NUTRITION",
    productIndex: 0,
  },
  {
    image: aboutBannerFarmWaste,
    alt: "From Farm Waste to Nourishing Goodness - DUST",
    title: "From Farm Surplus to Superfoods",
    subtitle: "100% Real Fruit & Pure Nutrition",
    price: "₹299",
    tag: "HERITAGE WELLNESS",
    productIndex: 4,
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useProductsStore();
  const [introFinished, setIntroFinished] = useState(false);
  const [activeHeroBannerIdx, setActiveHeroBannerIdx] = useState(0);
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } =
    useCartStore();

  const handleBuyNow = (product: Product) => {
    addToCart(product, 1);
    navigate("/checkout");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroFinished(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate hero banners every 2.8 seconds
  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setActiveHeroBannerIdx((prev) => (prev + 1) % homeHeroBanners.length);
    }, 2800);
    return () => clearInterval(bannerTimer);
  }, []);

  const heroProduct: Product = products[0] ?? {
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
    description: ["Made with nutritious Ragi and a delicious blend of dry fruits."],
    ingredients: "Ragi, Date Powder, Almond, Cashew, Pumpkin Seed, Sunflower Seed, Watermelon Seed, Flax Seed, Cardamom.",
    storage: "Keep in a cool dry place.",
    nutrition: { serving: "Per 100g", note: "Pack Net Wt: 250g", rows: [] },
    claims: ["100% Wholesome Ingredients & Premium Nuts"],
    ritualLabel: "Preparation Method",
    ritual: [],
    heritageTitle: "Heritage",
    heritageQuote: "Made for those who choose better",
    images: [],
    storyImage: "/ragi_pouch.png",
    accent: "amber",
    stock: 50,
    sku: "DUST-RAGI-250",
    fssai: "12545678901024",
    featured: true,
    newArrival: true,
    bestSeller: true,
  };

  const storyRagiProduct = products.find((p) => p.id === "ragi-laddoo-01") ?? heroProduct;
  const storyPaanProduct = products.find((p) => p.id === "paan-digestive-shot-01") ?? heroProduct;

  return (
    <div className="bg-[#F6F5F0] text-[#0E382E] min-h-screen">
      {/* 1. Cinematic Film Opening Loader */}
      {!introFinished && (
        <div className="fixed inset-0 z-50 bg-[#0E382E] flex flex-col items-center justify-center transition-opacity duration-700 text-[#F6F5F0]">
          <div className="text-center space-y-4 animate-pulse flex flex-col items-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#74B487]/50 shadow-2xl flex items-center justify-center bg-[#0E382E] mb-2 shrink-0">
              <img
                src="/logo.png"
                alt="DUST Logo"
                className="w-full h-full object-cover scale-[1.38]"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-[0.3em] uppercase">
              DUST
            </h1>
            <p className="text-xs font-bold tracking-[0.25em] text-[#E67E22] uppercase">
              CHOICE OF MOTHERLAND • 100% REAL FRUIT & HERITAGE
            </p>
          </div>
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-between pt-36 pb-12 px-4 sm:px-8 md:px-12 lg:px-16 w-full overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#E67E22]/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 my-auto text-center md:text-left grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center pt-4">
          <div className="lg:col-span-6 xl:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-1.5 bg-[#0E382E] border-2 border-[#E67E22] rounded-full text-white text-xs font-extrabold uppercase tracking-wider shadow-md">
              <span className="text-[#E67E22] font-black">✦</span>
              <span className="text-white/90 font-extrabold tracking-[0.14em]">NOT MADE FOR EVERYONE</span>
              <span className="text-[#E67E22] font-black">•</span>
              <span className="text-[#E67E22] font-black tracking-[0.14em]">MADE FOR THOSE WHO CHOOSE BETTER</span>
            </div>

            <div className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4" /> DUST — CHOICE OF MOTHERLAND
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold text-[#0E382E] tracking-tight leading-[1.05]">
              ROOTED IN NATURE. <br />
              <span className="text-[#E67E22]">
                MADE FOR MODERN INDIA.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#1F684B] max-w-xl font-normal leading-relaxed">
              Discover nourishing food blends, fruit-powered refreshments, everyday nutrition and nature-inspired personal care — thoughtfully brought together for modern living.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4 justify-center md:justify-start">
              <Link
                to="/shop"
                className="px-8 py-4 btn-dust-orange text-white font-extrabold text-xs uppercase tracking-[0.2em] rounded-full transition-all flex items-center gap-3 shadow-lg hover:scale-105"
                data-cursor="SHOP"
              >
                Explore Catalogue <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/collections/wholesome-millets"
                className="px-8 py-4 bg-[#E8F1E9] hover:bg-[#74B487]/20 border border-[#74B487] text-[#0E382E] text-xs font-extrabold uppercase tracking-[0.2em] rounded-full transition-all hover:scale-105"
              >
                Wholesome Laddoo Premix
              </Link>
            </div>
          </div>

          {/* Hero Visual Spotlight: Auto-changing Banner Carousel (Expanded on Desktop) */}
          <div className="lg:col-span-6 xl:col-span-7 relative flex flex-col items-center justify-center w-full">
            <div className="relative group w-full max-w-xl xl:max-w-2xl 2xl:max-w-3xl aspect-[3/2] rounded-3xl overflow-hidden border-2 border-[#74B487]/50 bg-white shadow-2xl">
              {homeHeroBanners.map((banner, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    activeHeroBannerIdx === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={banner.image}
                    alt={banner.alt}
                    fetchPriority={idx === 0 ? "high" : "low"}
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full h-full object-contain object-center bg-white"
                  />
                </div>
              ))}

              {/* Prev / Next Controls on hover */}
              <button
                type="button"
                onClick={() =>
                  setActiveHeroBannerIdx(
                    (prev) => (prev - 1 + homeHeroBanners.length) % homeHeroBanners.length
                  )
                }
                aria-label="Previous banner"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black/60 hover:bg-[#E67E22] text-white flex items-center justify-center backdrop-blur-md border border-white/30 transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-lg"
              >
                <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveHeroBannerIdx((prev) => (prev + 1) % homeHeroBanners.length)
                }
                aria-label="Next banner"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black/60 hover:bg-[#E67E22] text-white flex items-center justify-center backdrop-blur-md border border-white/30 transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-lg"
              >
                <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
              </button>
            </div>

            {/* Slide Navigation Controls */}
            <div className="w-full max-w-xl xl:max-w-2xl 2xl:max-w-3xl pt-3 flex items-center justify-center">
              <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#74B487]/40 shadow-xs">
                {homeHeroBanners.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveHeroBannerIdx(idx)}
                    aria-label={`Switch to banner ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeHeroBannerIdx === idx ? "w-7 bg-[#E67E22]" : "w-2.5 bg-stone-300 hover:bg-stone-400"
                    }`}
                  />
                ))}
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0E382E] ml-1 pl-1.5 border-l border-stone-200">
                  0{activeHeroBannerIdx + 1} / 0{homeHeroBanners.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 flex justify-center pt-8">
          <a
            href="#catalogue"
            className="flex flex-col items-center gap-2 text-[#1F684B] hover:text-[#E67E22] transition-colors text-xs uppercase tracking-widest font-extrabold"
          >
            <span>DISCOVER CREATIONS</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#E67E22]" />
          </a>
        </div>
      </section>

      {/* Marquee Accent Strip */}
      <section className="bg-[#E67E22] text-white py-3.5 overflow-hidden shadow-inner flex border-y border-[#D35400] select-none">
        <div className="flex gap-8 whitespace-nowrap animate-marquee font-extrabold text-xs tracking-[0.25em] uppercase pr-8">
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-white" /> DUST — CHOICE OF MOTHERLAND
          </span>
          <span>•</span>
          <span className="bg-[#0E382E] text-white px-3 py-0.5 rounded-full border border-white/30">
            NOT MADE FOR EVERYONE • MADE FOR THOSE WHO CHOOSE BETTER
          </span>
          <span>•</span>
          <span>Wholesome Laddoo Premix & DRY FRUITS</span>
          <span>•</span>
          <span>ROYAL PAAN DIGESTIVE SHOT</span>
          <span>•</span>
          <span>ZERO ADDED SUGAR</span>
          <span>•</span>
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-white" /> DUST — CHOICE OF MOTHERLAND
          </span>
          <span>•</span>
          <span className="bg-[#0E382E] text-white px-3 py-0.5 rounded-full border border-white/30">
            NOT MADE FOR EVERYONE • MADE FOR THOSE WHO CHOOSE BETTER
          </span>
          <span>•</span>
          <span>Wholesome Laddoo Premix & DRY FRUITS</span>
          <span>•</span>
          <span>ZERO ADDED SUGAR</span>
          <span>•</span>
        </div>

        <div aria-hidden="true" className="flex gap-8 whitespace-nowrap animate-marquee font-extrabold text-xs tracking-[0.25em] uppercase pr-8">
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-white" /> DUST — CHOICE OF MOTHERLAND
          </span>
          <span>•</span>
          <span className="bg-[#0E382E] text-white px-3 py-0.5 rounded-full border border-white/30">
            NOT MADE FOR EVERYONE • MADE FOR THOSE WHO CHOOSE BETTER
          </span>
          <span>•</span>
          <span>Wholesome Laddoo Premix & DRY FRUITS</span>
          <span>•</span>
          <span>ROYAL PAAN DIGESTIVE SHOT</span>
          <span>•</span>
          <span>ZERO ADDED SUGAR</span>
          <span>•</span>
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-white" /> DUST — CHOICE OF MOTHERLAND
          </span>
          <span>•</span>
          <span className="bg-[#0E382E] text-white px-3 py-0.5 rounded-full border border-white/30">
            NOT MADE FOR EVERYONE • MADE FOR THOSE WHO CHOOSE BETTER
          </span>
          <span>•</span>
          <span>Wholesome Laddoo Premix & DRY FRUITS</span>
          <span>•</span>
          <span>ZERO ADDED SUGAR</span>
          <span>•</span>
        </div>
      </section>

      {/* 3. Featured Editorial Product Showcase */}
      <section id="catalogue" className="py-20 px-4 sm:px-8 md:px-12 lg:px-16 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#74B487]/40 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold">
              SIGNATURE CREATIONS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0E382E] mt-1">
              Featured Product Stories
            </h2>
          </div>
          <p className="text-sm text-[#1F684B] max-w-md mt-4 md:mt-0 font-normal">
            Every product captured verbatim from the original DUST formulation: 100% natural, instant reconstitution, and authentic Indian flavors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {products.map((product) => {
            const inWishlist = isInWishlist(product.id);
            const mainImg = product.images[0]?.src ?? product.storyImage;
            const secondaryImg = product.images[1]?.src ?? product.storyImage;

            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-3xl border border-[#74B487]/40 overflow-hidden hover:border-[#E67E22] transition-all duration-500 flex flex-col justify-between shadow-sm hover:shadow-xl"
                data-cursor="BUY"
              >
                {/* Image Container with Hover Swap */}
                <div className="relative h-[360px] sm:h-[400px] bg-white p-8 flex items-center justify-center overflow-hidden border-b border-[#74B487]/30">
                  <img
                    src={mainImg}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain transition-all duration-700 group-hover:scale-105 group-hover:opacity-0"
                  />
                  <img
                    src={secondaryImg}
                    alt={`${product.name} detail`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-contain p-8 transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                  />

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-4 right-4 p-3 rounded-full border transition-colors shadow-xs ${inWishlist
                      ? "bg-red-50 border-red-200 text-red-500"
                      : "bg-white border-[#74B487]/40 text-[#0E382E] hover:text-[#E67E22]"
                      }`}
                    aria-label="Wishlist"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>

                  {/* Offer / Category Pill */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="badge-orange text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full shadow-xs">
                      {product.categoryLabel}
                    </span>
                    {product.bestSeller && (
                      <span className="bg-[#0E382E] text-white text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full shadow-xs">
                        BEST SELLER
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-8 space-y-6">
                  <div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-[#1F684B]">
                        {product.netWeight}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-[#0E382E]">
                          {product.priceDisplay}
                        </span>
                        {product.originalPriceDisplay && (
                          <span className="text-xs line-through text-stone-400 font-semibold">
                            {product.originalPriceDisplay}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/product/${product.slug}`}
                      className="block group-hover:text-[#E67E22] transition-colors mt-2"
                    >
                      <h3 className="text-2xl font-extrabold text-[#0E382E]">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs italic text-[#E67E22] mt-1 font-semibold">
                      "{product.subtitle || product.pitch}"
                    </p>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-normal">
                    {product.description[0]}
                  </p>

                  {/* Claims List */}
                  <div className="space-y-1.5 pt-2">
                    {product.claims.slice(0, 2).map((claim, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-[#0E382E] font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
                        <span className="line-clamp-1">{claim}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex items-center gap-3">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 py-3.5 btn-dust-orange text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      data-cursor="BUY"
                      className="px-4 py-3.5 bg-[#E8F1E9] hover:bg-[#74B487]/30 text-[#0E382E] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors border border-[#74B487]/40 flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#E67E22]" /> Buy Now
                    </button>
                    <Link
                      to={`/product/${product.slug}`}
                      className="p-3.5 bg-[#F6F5F0] border border-[#74B487]/40 text-[#0E382E] hover:text-[#E67E22] hover:border-[#E67E22] rounded-xl transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3.4 SHAHI RAGI & DRY FRUIT LADDOO MIX — SUPERFOOD SHOWCASE */}
      <section className="py-24 bg-[#E8F1E9] text-[#0E382E] px-4 sm:px-8 md:px-12 lg:px-16 border-t border-[#74B487]/40 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#74B487]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E67E22]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] text-[#E67E22] font-extrabold bg-white px-4 py-1.5 rounded-full border border-[#74B487]/40 inline-block shadow-xs">
              Wholesome Laddoo Premix • 100% NATURAL NUTRITION
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0E382E] tracking-tight">
              TRADITION REIMAGINED. <br />
              <span className="text-[#E67E22]">READY IN 2 MINUTES.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#1F684B] font-normal leading-relaxed">
              Made with nutritious Ragi and a rich blend of dry fruits, our Shahi Ragi & Dry Fruit Laddoo Mix is the most convenient way to prepare fresh, wholesome laddoos at home — naturally sweetened with pure date powder and zero added sugar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Poster Graphic Display */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-md w-full bg-white p-4 sm:p-6 rounded-3xl border border-[#74B487]/50 shadow-2xl overflow-hidden">
                <img
                  src={ragiPoster}
                  alt="DUST Shahi Ragi & Dry Fruit Laddoo Mix Poster"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover rounded-2xl border border-[#74B487]/30 shadow-md group-hover:scale-102 transition-transform duration-500"
                />
                <div className="pt-4 text-center flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E67E22]">
                    SHAHI RAGI & DRY FRUIT LADDOO MIX
                  </span>
                  <Link
                    to="/product/shahi-ragi-dry-fruit-laddoo-mix"
                    className="text-xs font-extrabold text-[#0E382E] hover:text-[#E67E22] flex items-center gap-1"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>

            {/* USPs Grid & Actions */}
            <div className="lg:col-span-7 space-y-8">
              <h3 className="text-2xl font-extrabold text-[#0E382E] flex items-center gap-2 border-b border-[#74B487]/40 pb-3">
                <Award className="w-5 h-5 text-[#E67E22]" /> WHY CHOOSE DUST RAGI LADDOO MIX?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-[#74B487]/40 space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-2 text-[#E67E22] font-extrabold text-xs uppercase tracking-wider">
                    <Leaf className="w-4 h-4" /> Finger Millet (Ragi) Power
                  </div>
                  <p className="text-xs text-stone-600">
                    High in natural calcium, iron, and fiber to strengthen bone health and provide sustained vitality.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-[#74B487]/40 space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-2 text-[#E67E22] font-extrabold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" /> 5 Superfood Seeds & Nuts
                  </div>
                  <p className="text-xs text-stone-600">
                    Loaded with almonds, cashews, pumpkin seeds, sunflower seeds, and watermelon seeds.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-[#74B487]/40 space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-2 text-[#E67E22] font-extrabold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> Zero Added Sugar
                  </div>
                  <p className="text-xs text-stone-600">
                    Naturally sweetened with pure date powder. 0% added sugar, 0% artificial flavors or preservatives.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-[#74B487]/40 space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-2 text-[#E67E22] font-extrabold text-xs uppercase tracking-wider">
                    <Zap className="w-4 h-4" /> 3 Simple Steps
                  </div>
                  <p className="text-xs text-stone-600">
                    Add warm ghee as per requirement, knead thoroughly, and shape into fresh round laddoos.
                  </p>
                </div>
              </div>

              {/* Infographic Preview Callout */}
              <div className="p-5 bg-white rounded-2xl border-2 border-[#E67E22]/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E67E22] bg-[#E8F1E9] px-2.5 py-0.5 rounded-full inline-block">
                    TRANSPARENT INGREDIENTS
                  </span>
                  <h4 className="text-sm font-extrabold text-[#0E382E]">
                    See the Complete Nutritional Infographic
                  </h4>
                  <p className="text-xs text-stone-600">
                    Explore macro breakdown, serving information, and allergen clarity on the product page.
                  </p>
                </div>
                <Link
                  to="/product/shahi-ragi-dry-fruit-laddoo-mix"
                  className="px-5 py-3 btn-dust-orange text-white font-extrabold text-xs uppercase tracking-wider rounded-xl whitespace-nowrap shadow-xs hover:shadow-md transition-all flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" /> View Infographic
                </Link>
              </div>

              {/* Purchase Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => addToCart(storyRagiProduct)}
                  className="py-3.5 px-6 btn-dust-orange text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart (₹229)
                </button>
                <button
                  onClick={() => handleBuyNow(storyRagiProduct)}
                  className="py-3.5 px-6 bg-[#0E382E] hover:bg-[#1F684B] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-[#E67E22]" /> Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 OUR USP & USAGE RITUAL SECTION */}
      <section className="py-24 bg-[#0E382E] text-white px-4 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#74B487]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E67E22]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] text-[#E67E22] font-extrabold bg-[#1F684B]/60 px-4 py-1.5 rounded-full border border-[#74B487]/40 inline-block">
              ANYTIME. ANYWHERE. PURE REFRESHMENT.
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              REFRESH. DIGEST. REPEAT.
            </h2>
            <p className="text-sm sm:text-base text-[#E8F1E9] font-medium leading-relaxed">
              DUST Paan Digestive Shot is a modern take on a timeless Banaras tradition. Carefully crafted with real betel leaf extracts, rose petal gulkand, fennel, and cardamom to support digestion, freshen breath, and leave you feeling light — anytime, anywhere.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Standee Graphic Display */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-md w-full bg-[#1F684B]/80 p-4 sm:p-6 rounded-3xl border border-[#74B487]/40 shadow-2xl backdrop-blur-md overflow-hidden">
                <img
                  src={dustStandeeImg}
                  alt="DUST Brand USP & Usage Standee"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover rounded-2xl border border-[#74B487]/30 shadow-lg group-hover:scale-102 transition-transform duration-500"
                />
                <div className="pt-4 text-center">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E67E22]">
                    PROUDLY INDIAN • NATURALLY REFRESHING
                  </span>
                </div>
              </div>
            </div>

            {/* 5 USPs Grid + 4 Uses Grid */}
            <div className="lg:col-span-7 space-y-10">
              {/* USPs List */}
              <div className="space-y-4">
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2 border-b border-[#74B487]/30 pb-3">
                  <Award className="w-5 h-5 text-[#E67E22]" /> OUR USP — THE DUST ADVANTAGE
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#1F684B]/60 rounded-2xl border border-[#74B487]/30 space-y-1.5">
                    <div className="flex items-center gap-2 text-[#E67E22] font-extrabold text-xs uppercase tracking-wider">
                      <Leaf className="w-4 h-4" /> Traditional Goodness
                    </div>
                    <p className="text-xs text-[#E8F1E9]">Classic paan flavor in an instant, mess-free format.</p>
                  </div>

                  <div className="p-4 bg-[#1F684B]/60 rounded-2xl border border-[#74B487]/30 space-y-1.5">
                    <div className="flex items-center gap-2 text-[#E67E22] font-extrabold text-xs uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" /> Natural & Clean Label
                    </div>
                    <p className="text-xs text-[#E8F1E9]">100% natural ingredients you can trust, zero artificial dyes.</p>
                  </div>

                  <div className="p-4 bg-[#1F684B]/60 rounded-2xl border border-[#74B487]/30 space-y-1.5">
                    <div className="flex items-center gap-2 text-[#E67E22] font-extrabold text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" /> Supports Digestion
                    </div>
                    <p className="text-xs text-[#E8F1E9]">Helps soothe your stomach and supports post-meal digestif wellness.</p>
                  </div>

                  <div className="p-4 bg-[#1F684B]/60 rounded-2xl border border-[#74B487]/30 space-y-1.5">
                    <div className="flex items-center gap-2 text-[#E67E22] font-extrabold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" /> Freshens Breath
                    </div>
                    <p className="text-xs text-[#E8F1E9]">Keeps your mouth feeling fresh, clean, and invigorated.</p>
                  </div>
                </div>

                <div className="p-4 bg-[#1F684B]/60 rounded-2xl border border-[#74B487]/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#E67E22] font-extrabold text-xs uppercase tracking-wider">
                    <Zap className="w-4 h-4" /> On-The-Go Convenience
                  </div>
                  <p className="text-xs text-[#E8F1E9]">Easy-to-carry sachet — just add 60ml chilled water, stir & enjoy!</p>
                </div>
              </div>

              {/* 4 Occasions / Uses */}
              <div className="space-y-4">
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2 border-b border-[#74B487]/30 pb-3">
                  <Flame className="w-5 h-5 text-[#E67E22]" /> WHEN & WHERE TO ENJOY
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 bg-[#1F684B]/80 rounded-2xl border border-[#74B487]/30 text-center space-y-2">
                    <span className="text-2xl block">🍽️</span>
                    <span className="text-xs font-extrabold text-white block uppercase">AFTER MEALS</span>
                  </div>

                  <div className="p-4 bg-[#1F684B]/80 rounded-2xl border border-[#74B487]/30 text-center space-y-2">
                    <span className="text-2xl block">🧳</span>
                    <span className="text-xs font-extrabold text-white block uppercase">WHILE TRAVELLING</span>
                  </div>

                  <div className="p-4 bg-[#1F684B]/80 rounded-2xl border border-[#74B487]/30 text-center space-y-2">
                    <span className="text-2xl block">💻</span>
                    <span className="text-xs font-extrabold text-white block uppercase">AT WORK / STUDY</span>
                  </div>

                  <div className="p-4 bg-[#1F684B]/80 rounded-2xl border border-[#74B487]/30 text-center space-y-2">
                    <span className="text-2xl block">👥</span>
                    <span className="text-xs font-extrabold text-white block uppercase">ANYTIME REFRESH</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Brand Heritage & Storytelling Section */}
      <section className="py-24 bg-[#E8F1E9] border-y border-[#74B487]/40 px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold">
              OUR PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0E382E] leading-tight">
              Captured Verbatim. <br />
              Tastes Like Memory.
            </h2>
            <p className="text-[#0E382E] text-sm sm:text-base leading-relaxed font-normal">
              From wholesome traditional Ragi & Dry Fruit Laddoos to fragrant royal paan after celebratory meals, DUST brings authentic Indian nutrition and heritage rituals into modern households without compromising on quality or tradition.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-5 bg-white rounded-2xl border border-[#74B487]/40 space-y-2 shadow-xs">
                <ShieldCheck className="w-6 h-6 text-[#E67E22]" />
                <h4 className="text-sm font-extrabold text-[#0E382E]">100% Real Ingredients</h4>
                <p className="text-xs text-stone-600 font-normal">
                  Nutritious Ragi, pure date powder, crunchy almonds, and premium cashews.
                </p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-[#74B487]/40 space-y-2 shadow-xs">
                <Leaf className="w-6 h-6 text-[#E67E22]" />
                <h4 className="text-sm font-extrabold text-[#0E382E]">No Added Sugar</h4>
                <p className="text-xs text-stone-600 font-normal">
                  Naturally sweetened with wholesome dates, zero artificial colors or preservatives.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <img
              src={storyRagiProduct.storyImage}
              alt="DUST Shahi Ragi Laddoo Mix"
              loading="lazy"
              decoding="async"
              className="rounded-2xl border-2 border-[#74B487]/50 object-cover w-full h-80 shadow-md"
            />
            <img
              src={storyPaanProduct.storyImage}
              alt="DUST Paan Digestive Shot"
              loading="lazy"
              decoding="async"
              className="rounded-2xl border-2 border-[#74B487]/50 object-cover w-full h-80 shadow-md"
            />
          </div>
        </div>
      </section>

      {/* WHY DUST — Problem + Solution Trust Section */}
      <section className="py-24 bg-[#F6F5F0] px-4 sm:px-8 md:px-12 lg:px-16 border-t border-[#74B487]/30">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-[#E67E22] font-extrabold bg-[#E8F1E9] border border-[#74B487]/40 px-4 py-1.5 rounded-full inline-block">
              WHY DUST EXISTS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0E382E]">
              We Understood the Problem. <br />
              <span className="text-[#E67E22]">Then We Built the Solution.</span>
            </h2>
            <p className="text-sm text-[#1F684B] leading-relaxed">
              Most natural products are either too expensive, too inconvenient, or full of hidden additives. DUST was built to fix exactly that.
            </p>
          </div>

          {/* Problem vs Solution Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Problems */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-stone-400" /> The Problem
              </h3>
              {[
                {
                  icon: <Package className="w-5 h-5" />,
                  text: "Natural products are hard to find and require significant preparation time.",
                },
                {
                  icon: <IndianRupee className="w-5 h-5" />,
                  text: "Affordable and natural rarely go together — most clean-label products charge a premium.",
                },
                {
                  icon: <FlaskConical className="w-5 h-5" />,
                  text: "Supermarket options are loaded with artificial additives, preservatives and synthetic chemicals.",
                },
                {
                  icon: <TrendingUp className="w-5 h-5" />,
                  text: "Busy lifestyles leave no time for healthy home preparation from scratch.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-stone-200 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-400 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed font-medium">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Solutions */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#E67E22] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E67E22]" /> The DUST Solution
              </h3>
              {[
                {
                  icon: <Leaf className="w-5 h-5" />,
                  title: "Clean-Label Formulations",
                  text: "Every DUST product is formulated with natural ingredients — zero artificial dyes, zero synthetic preservatives.",
                },
                {
                  icon: <IndianRupee className="w-5 h-5" />,
                  title: "Affordable Wellness",
                  text: "High-quality natural products priced fairly, so every Indian household can access wholesome nutrition daily.",
                },
                {
                  icon: <Zap className="w-5 h-5" />,
                  title: "Instant Convenience",
                  text: "Ready-to-mix and easy-to-prepare formats designed for modern on-the-go lifestyles.",
                },
                {
                  icon: <FlaskConical className="w-5 h-5" />,
                  title: "Proprietary Formulations",
                  text: "Unique, developed in-house recipes that larger mass-market brands struggle to adapt or replicate.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-5 bg-[#E8F1E9] rounded-2xl border border-[#74B487]/40 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-[#E67E22] text-white flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#0E382E] uppercase tracking-wide mb-0.5">{item.title}</h4>
                    <p className="text-xs text-[#1F684B] leading-relaxed font-medium">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE DUST — Competitive Advantage Badge Strip */}
      <section className="py-20 bg-[#0E382E] text-white px-4 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM3NEI0ODciIG9wYWNpdHk9IjAuMDUiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-[0.3em] text-[#E67E22] font-extrabold bg-[#1F684B]/60 px-4 py-1.5 rounded-full border border-[#74B487]/40 inline-block">
              THE DUST ADVANTAGE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
              Why Thousands Choose DUST
            </h2>
            <p className="text-sm text-[#E8F1E9] max-w-xl mx-auto leading-relaxed">
              We don't just make products — we build trust through every ingredient, every pack, every delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                icon: <FlaskConical className="w-6 h-6" />,
                title: "Proprietary\nFormulations",
                desc: "Unique in-house recipes — hard to copy, built to last.",
              },
              {
                icon: <BadgeCheck className="w-6 h-6" />,
                title: "Clean-Label\nPositioning",
                desc: "Minimal ingredients. Full transparency. Zero hidden chemicals.",
              },
              {
                icon: <IndianRupee className="w-6 h-6" />,
                title: "Affordable\nWellness",
                desc: "Natural quality at a price that reaches every Indian household.",
              },
              {
                icon: <Truck className="w-6 h-6" />,
                title: "Direct-to-\nConsumer",
                desc: "Order direct. Better pricing. Faster support. Real relationship.",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Community\nFirst",
                desc: "Built with feedback from real health-conscious Indian families.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#1F684B]/50 hover:bg-[#1F684B] border border-[#74B487]/30 rounded-2xl text-center space-y-3 transition-colors duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E67E22] text-white flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h4 className="text-sm font-extrabold text-white whitespace-pre-line leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#E8F1E9] leading-relaxed font-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Feedback & Video Testimonials Section */}
      <CustomerTestimonials
        title="Real Stories & Verified Experiences"
        subtitle="Discover why thousands of Indian households have made DUST their daily tradition for nutrition and digestive wellness."
      />

      {/* 5. Collections Banner Grid */}
      <section className="py-24 px-4 sm:px-8 md:px-12 lg:px-16 w-full">        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold">
            CURATED COLLECTIONS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0E382E]">
            Explore Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col) => (
            <div
              key={col.slug}
              className="relative group h-[460px] sm:h-[520px] rounded-3xl overflow-hidden border border-[#74B487]/40 bg-[#0E382E] p-8 flex flex-col justify-between shadow-xl"
            >
              <img
                src={col.heroImage}
                alt={col.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              <div className="relative z-10 flex justify-between items-start">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#F6F5F0] bg-[#E67E22] px-3 py-1 rounded-full shadow-xs">
                  {col.meta[0]?.value ?? "Collection"}
                </span>
              </div>

              <div className="relative z-10 space-y-3 text-white">
                <h3 className="text-3xl font-extrabold text-white">
                  {col.name}
                </h3>
                <p className="text-xs text-[#E8F1E9] max-w-md line-clamp-2">
                  {col.description}
                </p>

                <Link
                  to={`/collections/${col.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#E67E22] hover:text-white pt-2 transition-colors"
                >
                  Explore Collection <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
