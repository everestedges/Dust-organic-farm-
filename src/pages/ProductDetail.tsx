import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  X,
  CheckCircle2,
  ArrowUpRight,
  Activity,
  Zap,
  Clock,
  Truck,
} from "lucide-react";
import { products, Product } from "@/lib/data";
import { useCartStore } from "@/lib/cart-store";
import laddooMix from "@/assets/laddooMix.png";
import ragiPouch from "@/assets/ragi-pouch.png";
import paanPouchStick from "@/assets/paan-pouch-stick.png";
import paanPouchBack from "@/assets/paan-pouch-back.png";
import { CustomerTestimonials } from "@/components/cinematic/CustomerTestimonials";

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const defaultProduct = products[0] as Product;
  const product: Product =
    products.find((p) => p.slug === slug || p.id === slug || (slug?.includes("paan") && p.slug.includes("paan"))) ??
    defaultProduct;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const { addToCart, toggleWishlist, isInWishlist } = useCartStore();
  const inWishlist = isInWishlist(product.id);

  const images = product.images.length > 0
    ? product.images
    : [{ src: product.storyImage, alt: product.name }];

  const activeImage = images[activeImageIndex] ?? images[0] ?? { src: product.storyImage, alt: product.name };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const allCombos = [
    {
      id: "laddoo-twin-pack-500g",
      name: "Shahi Ragi Laddoo Mix Twin Pack (500g)",
      desc: "2× 250g value twin pack. Pure millet & nut laddoo premix (zero added sugar). Yields 20–24 nutritious home-made laddoos.",
      badge: "SUPER SAVER TWIN PACK",
      save: "SAVE ₹60",
      price: 458,
      mrp: 518,
      link: "/combos",
      features: [
        "2× 250g Pure Millet & Nut Laddoo Mix (500g Total)",
        "Yields 20–24 Fresh Wholesome Laddoos",
        "Free Express Shipping Pan-India",
      ],
      type: "laddoo-twin",
      priority: product.id.includes("laddoo") || product.slug.includes("laddoo") ? 1 : 2,
    },
    {
      id: "royal-heritage-superfood-pack",
      name: "The Royal Heritage & Superfood Pack",
      desc: "2× Shahi Ragi Laddoo Mix (500g Total) + 20 Paan Digestive Shot Sachets (Makes 40 Fresh Shots). Wholesome nutrition meets royal after-meal digestive freshness.",
      badge: "BEST SELLER COMBO",
      save: "SAVE ₹160",
      price: 1058,
      mrp: 1218,
      link: "/combos",
      features: [
        "2 Packets Laddoo Mix (250g + 250g = 500g Total)",
        "20 Royal Paan Digestive Sachets (40 Shots)",
        "Free Express Shipping Pan-India",
      ],
      type: "heritage-duo",
      priority: 1,
    },
    {
      id: "paan-30-shots-monthly-combo",
      name: "30 Shots Monthly Combo (Paan Multipack)",
      desc: "3 full boxes of authentic Banarasi betel leaf and gulkand digestive shots for daily post-dinner wellness rituals.",
      badge: "MONTHLY RITUAL PACK",
      save: "SAVE ₹101",
      price: 799,
      mrp: 900,
      link: "/combos",
      features: [
        "3 Full Boxes (30 Sachets = 60 Fresh Shots)",
        "Real Banarasi Betel Leaf & Prebiotic Inulin",
        "Free Express Shipping Pan-India",
      ],
      type: "paan-trio",
      priority: product.id.includes("paan") || product.slug.includes("paan") ? 1 : 3,
    },
  ];

  const suggestedCombos = [...allCombos]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 2);

  const almondHealthBenefits = [
    {
      title: "Naturally Occurring Healthy Fats",
      description:
        "Almonds contain unsaturated fats, which can be part of a balanced diet.",
      icon: Heart,
      highlight: "Heart & Energy",
    },
    {
      title: "Plant-Based Protein",
      description:
        "A convenient ingredient to add some plant-based protein to everyday meals.",
      icon: Activity,
      highlight: "Muscle & Vitality",
    },
    {
      title: "Source of Dietary Fibre",
      description:
        "Almonds naturally contain dietary fibre, which contributes to a balanced diet.",
      icon: ShieldCheck,
      highlight: "Digestive Wellness",
    },
    {
      title: "Vitamin E",
      description:
        "Almonds naturally contain vitamin E, an antioxidant nutrient that helps protect cells from oxidative stress.",
      icon: Sparkles,
      highlight: "Antioxidant Defense",
    },
    {
      title: "Essential Minerals",
      description:
        "Almonds provide naturally occurring minerals such as magnesium, calcium and phosphorus.",
      icon: Zap,
      highlight: "Vital Minerals",
    },
    {
      title: "Everyday Nutritional Variety",
      description:
        "An easy way to include almonds in breakfast, snacks and homemade recipes.",
      icon: CheckCircle2,
      highlight: "Everyday Wellness",
    },
  ];

  const cashewHealthBenefits = [
    {
      title: "Natural Cashew Goodness",
      description:
        "Enjoy the rich taste, natural sweetness and pure goodness of cashews in convenient powder form.",
      icon: Sparkles,
      highlight: "Pure Cashew",
    },
    {
      title: "Source of Plant Protein",
      description:
        "Cashews provide plant-based protein to complement your everyday diet and maintain active wellness.",
      icon: Activity,
      highlight: "Plant Protein",
    },
    {
      title: "Rich in Healthy Fats",
      description:
        "Contains naturally occurring unsaturated healthy fats that support heart health and balanced nutrition.",
      icon: Heart,
      highlight: "Heart Healthy",
    },
    {
      title: "Essential Mineral Content",
      description:
        "Cashews naturally provide vital minerals such as magnesium, copper, zinc and iron for vitality.",
      icon: Zap,
      highlight: "Vital Minerals",
    },
    {
      title: "Rich, Creamy Culinary Texture",
      description:
        "Adds delicious richness, body and natural creaminess to smoothies, desserts and savoury gravies.",
      icon: ShieldCheck,
      highlight: "Creamy Texture",
    },
    {
      title: "Versatile & Easy to Use",
      description:
        "Convenient to measure, blend and cook into everyday recipes without grinding or mess.",
      icon: CheckCircle2,
      highlight: "Convenient Daily Use",
    },
  ];

  const shampooHealthBenefits = [
    {
      title: "Specially Designed for Men",
      description:
        "Men's grooming deserves a natural alternative. Easy-to-use herbal hair care for men who prefer plant-based ingredients.",
      icon: Sparkles,
      highlight: "Men's Grooming",
    },
    {
      title: "Goodness of 5 Traditional Herbs",
      description:
        "Carefully selected synergy of Amla (shine), Ritha (cleansing), Shikakai (gentle wash), Hibiscus (conditioning), and Bhringraj (root care).",
      icon: ShieldCheck,
      highlight: "5 Ayurvedic Herbs",
    },
    {
      title: "No-Foam Herbal Hair Mask",
      description:
        "Forget harsh foaming chemicals. Mix powder with water to create a smooth, deeply nourishing herbal paste.",
      icon: Activity,
      highlight: "Zero Harsh Foam",
    },
    {
      title: "A Simpler Hair-Care Routine",
      description:
        "Prepare herbal paste, apply to hair and scalp, allow it to sit for 5–10 minutes, and rinse thoroughly.",
      icon: CheckCircle2,
      highlight: "5-10 Min Mask",
    },
    {
      title: "100% Plant-Based & Clean Label",
      description:
        "Zero sulfates, parabens, silicones, synthetic fragrances, or harsh preservatives. Pure botanical hair therapy.",
      icon: Heart,
      highlight: "Clean & Sulfate-Free",
    },
    {
      title: "Care for Naturally Healthy Hair",
      description:
        "Helps maintain clean, soft and manageable hair while strengthening roots and balancing scalp moisture.",
      icon: Zap,
      highlight: "Stronger Roots",
    },
  ];

  const laddooHealthBenefits = [
    {
      title: "Naturally Rich in Calcium",
      description:
        "Ragi is a natural source of calcium, which contributes to the maintenance of normal bones and teeth.",
      icon: ShieldCheck,
      highlight: "Bones & Teeth",
    },
    {
      title: "Source of Dietary Fibre",
      description:
        "Ragi and seeds provide dietary fibre that supports normal digestive function.",
      icon: Activity,
      highlight: "Digestive Wellness",
    },
    {
      title: "Nutrient-Rich Ingredients",
      description:
        "Almonds, cashews, pumpkin seeds, watermelon seeds and sunflower seeds contribute plant-based protein, healthy fats and essential minerals.",
      icon: Sparkles,
      highlight: "Protein & Healthy Fats",
    },
    {
      title: "Provides Everyday Energy",
      description:
        "Ragi and jaggery provide carbohydrates, while nuts and seeds contribute energy from fats.",
      icon: Zap,
      highlight: "Sustained Energy",
    },
    {
      title: "Goodness of Nuts and Seeds",
      description:
        "Includes ingredients that naturally provide vitamin E, magnesium and zinc.",
      icon: Heart,
      highlight: "Essential Minerals",
    },
    {
      title: "Traditional Ingredients, Wholesome Nutrition",
      description:
        "Made with ragi, nuts, seeds, jaggery, dry ginger and cardamom for a delicious traditional snacking experience.",
      icon: CheckCircle2,
      highlight: "Authentic Recipe",
    },
  ];

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 md:px-12 lg:px-16 w-full min-h-screen text-[#0E382E] bg-[#F6F5F0]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#1F684B] mb-8 font-semibold">
        <Link to="/" className="hover:text-[#E67E22] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#E67E22] transition-colors">
          Shop
        </Link>
        <span>/</span>
        <span className="text-[#0E382E] font-extrabold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual Frame */}
          <div className="relative aspect-[4/3] bg-white border border-[#74B487]/40 rounded-3xl overflow-hidden p-8 flex items-center justify-center shadow-sm">
            <img
              src={activeImage.src}
              alt={activeImage.alt || product.name}
              className="max-h-full max-w-full object-contain transition-all duration-500 hover:scale-105"
            />
            {product.savePercent && (
              <span className="absolute top-4 left-4 bg-[#E67E22] text-white font-extrabold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                SAVE {product.savePercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex items-center gap-4">
            {images.map((imgItem, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-24 h-24 bg-white rounded-2xl border p-2 overflow-hidden transition-all ${
                  activeImageIndex === idx
                    ? "border-[#E67E22] ring-2 ring-[#E67E22]/30"
                    : "border-[#74B487]/40 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={imgItem.src}
                  alt={imgItem.alt}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>

          {/* Image Disclaimer Caption */}
          <p className="text-[11px] text-stone-500 italic text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5 pt-1">
            <span className="text-[#E67E22] font-black">*</span> Product images, packaging, and serving presentations are shown for illustrative purposes only.
          </p>

          {/* Product Story Photography Banner */}
          <div className="relative rounded-3xl overflow-hidden border border-[#74B487]/40 bg-stone-900 mt-8 shadow-xl">
            <img
              src={product.storyImage}
              alt={`${product.name} story`}
              className="w-full h-80 object-cover opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-8 flex flex-col justify-end text-white">
              <span className="text-xs uppercase tracking-[0.2em] text-[#f1efee] font-extrabold">
                HERITAGE STORY
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                {product.heritageTitle}
              </h3>
              <p className="text-xs text-[#E8F1E9] italic max-w-md mt-2 leading-relaxed font-normal">
                "{product.heritageQuote}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Sticky Purchase Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-8 sticky top-28">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#E67E22] bg-[#E8F1E9] border border-[#74B487]/40 px-3 py-1 rounded-full">
                {product.categoryLabel}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0E382E] leading-tight">
              {product.name}
            </h1>
            <p className="text-sm text-[#E67E22] italic mt-1 font-semibold">
              "{product.pitch}"
            </p>

            {/* Brand Quote Authenticity Seal */}
            <div className="mt-4 p-3 bg-[#0E382E] border-2 border-[#E67E22] rounded-2xl flex items-center gap-2.5 text-white shadow-xs">
              <span className="text-[#E67E22] text-xs font-black">✦</span>
              <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.16em]">
                <span className="text-stone-200">NOT MADE FOR EVERYONE</span>
                <span className="text-[#E67E22] mx-2">•</span>
                <span className="text-[#E67E22]">MADE FOR THOSE WHO CHOOSE BETTER</span>
              </div>
            </div>

            <div className="flex items-baseline gap-4 mt-6 pt-4 border-t border-[#74B487]/30">
              <span className="text-3xl font-extrabold text-[#0E382E]">
                {product.priceDisplay}
              </span>
              {product.originalPriceDisplay && (
                <span className="text-base line-through text-stone-400 font-semibold">
                  {product.originalPriceDisplay}
                </span>
              )}
              {product.unitDisplay && (
                <span className="text-xs text-[#1F684B] font-bold border-l border-[#74B487]/40 pl-3">
                  {product.unitDisplay}
                </span>
              )}
            </div>
          </div>

          {/* Description Paragraphs */}
          <div className="space-y-3 text-xs text-stone-700 leading-relaxed font-normal">
            {product.description.map((desc, idx) => (
              <p key={idx}>{desc}</p>
            ))}
          </div>

          {/* Quantity and Purchase CTA */}
          <div className="space-y-4 pt-4 border-t border-[#74B487]/30">
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase text-[#0E382E] font-extrabold">
                Quantity
              </span>
              <div className="flex items-center border border-[#74B487]/40 rounded-xl bg-[#E8F1E9]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2.5 text-[#0E382E] hover:text-[#E67E22] font-bold"
                >
                  -
                </button>
                <span className="px-4 text-sm font-extrabold text-[#0E382E]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2.5 text-[#0E382E] hover:text-[#E67E22] font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition-colors ${
                  inWishlist
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "border-[#74B487]/40 text-[#0E382E] hover:bg-[#E8F1E9]"
                }`}
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 px-6 rounded-xl font-extrabold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md ${
                  added
                    ? "bg-[#0E382E] text-white"
                    : "btn-dust-orange text-white"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart (₹
                    {product.price * quantity})
                  </>
                )}
              </button>

              <Link
                to="/checkout"
                onClick={() => addToCart(product, quantity)}
                className="w-full py-4 px-6 bg-[#0E382E] hover:bg-[#1F684B] text-[#F6F5F0] font-extrabold text-xs uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Buy Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Fresh Packing & Delivery Guarantee */}
            <div className="p-3 bg-[#E8F1E9]/80 border border-[#74B487]/40 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0E382E] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Clock className="w-4 h-4 text-[#E67E22]" />
              </div>
              <div className="text-[11px] leading-tight">
                <span className="font-extrabold text-[#0E382E] block">Fresh Batch Guarantee</span>
                <span className="text-stone-700 font-medium">Order packing time: 24 to 48 hrs of fresh packing and delivery</span>
              </div>
            </div>

            <div className="text-[11px] text-[#1F684B] text-center pt-1 flex items-center justify-center gap-2 font-bold flex-wrap">
              <ShieldCheck className="w-4 h-4 text-[#E67E22]" />
              <span>In Stock • 24 to 48 hrs of fresh packing and delivery • FSSAI Certified</span>
            </div>
          </div>

          {/* Claims & Highlights (Bold Premium Card) */}
          <div className="bg-gradient-to-br from-[#E8F1E9] via-[#F6F5F0] to-[#E8F1E9]/80 p-5 sm:p-6 rounded-3xl border-2 border-[#74B487]/50 shadow-sm space-y-4">
            {/* Header with Title and Trust Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-[#74B487]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E67E22] text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#0E382E]">
                    Product Highlights
                  </h4>
                  <p className="text-[10px] text-[#1F684B] font-bold">
                    Purity & Quality Promises
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-white bg-[#0E382E] px-2.5 py-1 rounded-full border border-[#74B487]/40 shadow-xs">
                ✦ 100% PURE
              </span>
            </div>

            {/* 2-Column Responsive Grid with Bold Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.claims.map((claim, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 px-3 py-2.5 bg-white/95 hover:bg-white rounded-xl border border-[#74B487]/40 shadow-xs hover:border-[#E67E22] hover:shadow-sm transition-all duration-200 group"
                >
                  <div className="w-5 h-5 rounded-md bg-[#E8F1E9] group-hover:bg-[#E67E22] text-[#0E382E] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs font-extrabold text-[#0E382E] tracking-tight group-hover:text-[#E67E22] transition-colors leading-tight">
                    {claim}
                  </span>
                </div>
              ))}
            </div>

            {/* Micro-footer Guarantee */}
            <div className="pt-2 text-center border-t border-[#74B487]/25">
              <span className="text-[10px] uppercase tracking-widest text-[#1F684B] font-black">
                Zero Preservatives • Clean Label • Wholesome Taste
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* What are the Health Benefits? (For Laddoo Mix, Almond Powder, Cashew Powder & Shampoo) */}
      {(product.id.includes("laddoo") || product.slug.includes("laddoo") || product.slug.includes("almond") || product.slug.includes("cashew") || product.slug.includes("shampoo")) && (
        <section className="mt-20 pt-16 border-t border-[#74B487]/40 space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />{" "}
              {product.slug.includes("shampoo")
                ? "AYURVEDIC HERBAL CARE & BENEFITS"
                : product.slug.includes("almond") || product.slug.includes("cashew")
                ? "HEALTH & NUTRITIONAL BENEFITS"
                : "WHOLESOME TRADITIONAL NUTRITION"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E382E]">
              {product.slug.includes("shampoo")
                ? "Why Choose DUST™ Natural Powder Shampoo?"
                : "What are the Health Benefits?"}
            </h2>
            <p className="text-sm sm:text-base text-[#1F684B] font-medium leading-relaxed">
              {product.slug.includes("shampoo")
                ? "DUST™ brings together 5 time-tested Ayurvedic herbs (Amla, Ritha, Shikakai, Hibiscus, Bhringraj) in a simple powder-to-paste hair mask specially designed for men."
                : product.slug.includes("cashew")
                ? "DUST™ Premium Cashew Powder brings the rich, velvety taste and pure goodness of cashews into your everyday recipes."
                : product.slug.includes("almond")
                ? "DUST™ Almond Powder brings the pure goodness of skin-on almonds into your everyday meals for natural nourishment."
                : "DUST™ Ragi & Dry Fruit Laddoo Mix brings together the goodness of ragi, premium nuts and seeds for a wholesome traditional snack."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(product.slug.includes("shampoo")
              ? shampooHealthBenefits
              : product.slug.includes("cashew")
              ? cashewHealthBenefits
              : product.slug.includes("almond")
              ? almondHealthBenefits
              : laddooHealthBenefits
            ).map((benefit, idx) => {
              const IconComp = benefit.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-[#74B487]/40 p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#E67E22]/60 transition-all duration-300 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-[#E8F1E9] text-[#0E382E] group-hover:bg-[#E67E22] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#E67E22] bg-[#E8F1E9]/60 px-2.5 py-1 rounded-full border border-[#74B487]/30">
                        {benefit.highlight}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-[#0E382E] group-hover:text-[#E67E22] transition-colors leading-snug">
                      {benefit.title}
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed font-normal">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Ritual & Nutrition Specs */}
      <section className="mt-24 pt-16 border-t border-[#74B487]/40 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Ritual Steps */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs uppercase tracking-[0.2em] text-[#E67E22] font-extrabold">
            {product.ritualLabel}
          </span>
          <h2 className="text-3xl font-extrabold text-[#0E382E]">
            {product.slug.includes("shampoo")
              ? "How to Use — Herbal Hair Mask"
              : product.slug.includes("almond") || product.slug.includes("cashew")
              ? "Delicious Ways to Use"
              : "Preparation Ritual"}
          </h2>

          <div className="space-y-6">
            {product.ritual.map((step, idx) => (
              <div
                key={idx}
                className="flex gap-4 p-5 bg-white rounded-2xl border border-[#74B487]/40 shadow-xs"
              >
                <div className="w-8 h-8 rounded-full bg-[#E67E22] text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#0E382E]">
                    {step.title}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 font-normal">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Liquid Shampoo vs DUST Comparison (for Shampoo) */}
          {product.slug.includes("shampoo") && (
            <div className="p-6 bg-white rounded-3xl border border-[#74B487]/40 shadow-xs space-y-4 mt-6">
              <div className="flex items-center justify-between border-b border-[#74B487]/30 pb-3">
                <div>
                  <h4 className="text-sm font-extrabold text-[#0E382E]">
                    Ordinary Liquid Shampoo vs. DUST™ Powder Shampoo
                  </h4>
                  <p className="text-[11px] text-[#1F684B]">
                    Format and botanical ingredient comparison
                  </p>
                </div>
                <span className="text-[10px] font-black uppercase text-[#E67E22] bg-[#E8F1E9] px-2.5 py-1 rounded-full border border-[#74B487]/30">
                  Herbal Alternative
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-stone-700">
                  <thead>
                    <tr className="border-b border-[#74B487]/20 text-[#0E382E] font-extrabold text-left bg-[#F6F5F0]">
                      <th className="py-2.5 px-3 rounded-l-xl">Feature</th>
                      <th className="py-2.5 px-3 text-stone-500">Ordinary Liquid Shampoo</th>
                      <th className="py-2.5 px-3 text-right text-[#0E382E] font-black bg-[#E8F1E9]/60 rounded-r-xl">
                        DUST™ Powder Shampoo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8F1E9] font-medium">
                    <tr>
                      <td className="py-3 px-3 text-[#0E382E] font-bold">Product Format</td>
                      <td className="py-3 px-3 text-stone-500">Ready-to-use liquid format</td>
                      <td className="py-3 px-3 text-right font-extrabold text-[#E67E22]">Mix powder with water into paste</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-[#0E382E] font-bold">Washing Experience</td>
                      <td className="py-3 px-3 text-stone-500">Chemical foaming lather</td>
                      <td className="py-3 px-3 text-right font-extrabold text-[#0E382E]">No-foam herbal hair mask</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-[#0E382E] font-bold">Key Ingredients</td>
                      <td className="py-3 px-3 text-stone-500">Varies (chemical surfactants)</td>
                      <td className="py-3 px-3 text-right font-extrabold text-[#E67E22]">5 Traditional Ayurvedic herbs</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-[#0E382E] font-bold">Fragrance & Additives</td>
                      <td className="py-3 px-3 text-stone-500">Synthetic perfumes & parabens</td>
                      <td className="py-3 px-3 text-right font-extrabold text-[#0E382E]">100% Botanical formulation</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-[#0E382E] font-bold">Scalp Benefit</td>
                      <td className="py-3 px-3 text-stone-500">Can strip natural scalp oils</td>
                      <td className="py-3 px-3 text-right font-extrabold text-[#25D366]">Nourishes roots & balances scalp</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-stone-500 italic pt-1">
                *This is a format and ingredient comparison, not a claim that all liquid shampoos contain the same ingredients.
              </p>
            </div>
          )}

          {/* Suggested Quantity Guide (for Cashew Powder) */}
          {product.slug.includes("cashew") && (
            <div className="p-5 bg-white rounded-2xl border border-[#74B487]/40 shadow-xs space-y-3 mt-6">
              <div className="flex items-center justify-between border-b border-[#74B487]/30 pb-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#0E382E]">
                  Suggested Quantity Guide
                </h4>
                <span className="text-[10px] text-[#E67E22] font-extrabold bg-[#E8F1E9] px-2.5 py-0.5 rounded-full border border-[#74B487]/30">
                  How to Use
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-stone-700">
                  <thead>
                    <tr className="border-b border-[#74B487]/20 text-[#0E382E] font-extrabold text-left">
                      <th className="py-2">Recipe / Preparation</th>
                      <th className="py-2 text-right">Suggested Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8F1E9] font-medium">
                    <tr>
                      <td className="py-2.5 text-[#0E382E] font-bold">Smoothies & Shakes</td>
                      <td className="py-2.5 text-right text-[#E67E22] font-extrabold">1–2 tbsp</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-[#0E382E] font-bold">Warm / Cold Milk</td>
                      <td className="py-2.5 text-right text-[#E67E22] font-extrabold">1 tbsp</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-[#0E382E] font-bold">Kheer & Pudding</td>
                      <td className="py-2.5 text-right text-[#E67E22] font-extrabold">1–2 tbsp</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-[#0E382E] font-bold">Gravies & Curries (Korma, Paneer)</td>
                      <td className="py-2.5 text-right text-[#E67E22] font-extrabold">1–2 tbsp</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-[#0E382E] font-bold">Cakes & Cookies</td>
                      <td className="py-2.5 text-right text-stone-600 italic">As per recipe</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-[#0E382E] font-bold">Traditional Sweets (Barfi, Halwa)</td>
                      <td className="py-2.5 text-right text-stone-600 italic">As per recipe</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[10.5px] text-stone-500 italic pt-1 border-t border-[#74B487]/20">
                *Adjust quantities according to your taste and recipe requirements.
              </p>
            </div>
          )}
        </div>

        {/* Nutritional & Botanical Information */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs uppercase tracking-[0.2em] text-[#E67E22] font-extrabold">
            {product.slug.includes("shampoo") ? "HERBAL INGREDIENTS & COMPOSITION" : "INGREDIENTS & NUTRITION"}
          </span>
          <h2 className="text-3xl font-extrabold text-[#0E382E]">
            {product.slug.includes("shampoo")
              ? "Botanical Actives & Composition"
              : "Nutritional Facts (Approx. values)"}
          </h2>

          <div className="bg-white p-6 rounded-3xl border border-[#74B487]/40 space-y-4 shadow-xs">
            <div className="text-xs text-[#0E382E] border-b border-[#74B487]/30 pb-3 flex justify-between font-extrabold">
              <span>{product.nutrition.serving}</span>
              <span className="text-[#E67E22]">{product.nutrition.note}</span>
            </div>

            <table className="w-full text-xs text-stone-700">
              <thead>
                <tr className="border-b border-[#74B487]/30 text-[#0E382E] font-extrabold">
                  <th className="text-left py-2">
                    {product.slug.includes("shampoo") ? "Botanical Herb" : "Nutrient"}
                  </th>
                  <th className="text-right py-2">
                    {product.slug.includes("shampoo") ? "Active Function" : "Amount"}
                  </th>
                  <th className="text-right py-2">
                    {product.slug.includes("shampoo") ? "Category" : "% RDA*"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8F1E9] font-medium">
                {product.nutrition.rows.map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 font-extrabold text-[#0E382E]">{row[0]}</td>
                    <td className="py-2.5 text-right text-stone-700">{row[1]}</td>
                    <td className="py-2.5 text-right text-[#E67E22] font-extrabold">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pt-4 border-t border-[#74B487]/30 space-y-2 text-[11px] text-stone-700">
              <p>
                <strong className="text-[#0E382E]">Ingredients:</strong>{" "}
                {product.ingredients}
              </p>
              {product.allergen && (
                <p>
                  <strong className="text-[#0E382E]">{product.slug.includes("shampoo") ? "Suitability & Safety:" : "Allergen Info:"}</strong>{" "}
                  {product.allergen}
                </p>
              )}
              <p>
                <strong className="text-[#0E382E]">Storage:</strong> {product.storage}
              </p>
              <p>
                <strong className="text-[#0E382E]">Order Packing Time:</strong> 24 to 48 hrs of fresh packing and delivery
              </p>
              {!product.slug.includes("shampoo") && (
                <p className="text-[10.5px] text-stone-600 italic leading-relaxed pt-1">
                  *% RDA (Recommended dietary allowance) is calculated on the basis of 2000 calories a day. Your daily values may be higher or lower depending on your calorie needs.
                </p>
              )}
              {product.disclaimer && (
                <div className="pt-2.5 mt-2 border-t border-[#74B487]/30 flex items-start gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#E67E22] shrink-0">
                    Disclaimer:
                  </span>
                  <p className="text-[10px] text-stone-600 leading-relaxed italic">
                    {product.disclaimer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Visual Infographic & Brand Poster Showcase */}
      {(product.infographicImage || product.posterImage) && (
        <section className="mt-20 pt-16 border-t border-[#74B487]/40 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold bg-[#E8F1E9] border border-[#74B487]/40 px-3 py-1 rounded-full inline-block">
              VISUAL GUIDE & AUTHENTICITY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E382E]">
              Ingredients, Nutrition & Craft
            </h2>
            <p className="text-xs sm:text-sm text-[#1F684B]">
              100% ingredient transparency and traditional heritage. Click any image to view in high resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
            {product.infographicImage && (
              <div className="bg-white rounded-3xl border border-[#74B487]/40 p-6 sm:p-8 shadow-sm flex flex-col justify-between group hover:border-[#E67E22] transition-all">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="badge-orange text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full shadow-xs">
                      INFOGRAPHIC
                    </span>
                    <span className="text-xs font-bold text-[#1F684B]">Nutritional Breakdown</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0E382E]">
                    {product.shortName} Infographic
                  </h3>
                </div>

                <div
                  onClick={() => setZoomImage(product.infographicImage || null)}
                  className="relative rounded-2xl overflow-hidden border border-[#74B487]/30 bg-stone-50 cursor-pointer group/img flex items-center justify-center p-2 min-h-[380px]"
                >
                  <img
                    src={product.infographicImage}
                    alt={`${product.name} Infographic`}
                    className="w-full h-auto max-h-[500px] object-contain group-hover/img:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-extrabold uppercase tracking-widest gap-2 backdrop-blur-xs">
                    <Eye className="w-4 h-4" /> Click to Zoom
                  </div>
                </div>

                <p className="text-[11px] text-stone-500 mt-4 text-center font-medium">
                  Detailed illustration of finger millet, nuts, seeds, and preparation ritual.
                </p>
              </div>
            )}

            {product.posterImage && (
              <div className="bg-white rounded-3xl border border-[#74B487]/40 p-6 sm:p-8 shadow-sm flex flex-col justify-between group hover:border-[#E67E22] transition-all">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#0E382E] text-white text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full shadow-xs">
                      OFFICIAL POSTER
                    </span>
                    <span className="text-xs font-bold text-[#E67E22]">Choice of Motherland</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0E382E]">
                    {product.name} Poster
                  </h3>
                </div>

                <div
                  onClick={() => setZoomImage(product.posterImage || null)}
                  className="relative rounded-2xl overflow-hidden border border-[#74B487]/30 bg-stone-50 cursor-pointer group/img flex items-center justify-center p-2 min-h-[380px]"
                >
                  <img
                    src={product.posterImage}
                    alt={`${product.name} Poster`}
                    className="w-full h-auto max-h-[500px] object-contain group-hover/img:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-extrabold uppercase tracking-widest gap-2 backdrop-blur-xs">
                    <Eye className="w-4 h-4" /> Click to Zoom
                  </div>
                </div>

                <p className="text-[11px] text-stone-500 mt-4 text-center font-medium">
                  "NOT MADE FOR EVERYONE • MADE FOR THOSE WHO CHOOSE BETTER"
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Lightbox Zoom Modal */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl p-4 sm:p-6 overflow-hidden shadow-2xl flex flex-col items-center"
          >
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-[#0E382E] text-white hover:bg-[#E67E22] transition-colors"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomImage}
              alt="Zoomed Detail"
              className="max-h-[82vh] w-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* Customer Feedback & Video Testimonials Section */}
      <CustomerTestimonials
        currentProductSlug={product.slug}
        title={`Customer Reviews & Stories for ${product.name}`}
        subtitle={`See what verified customers across India are saying about ${product.name}.`}
        className="mt-20 pt-16 border-t border-[#74B487]/40 px-0"
      />

      {/* You May Also Like — Always Suggest Combo Packets */}
      <section className="mt-24 pt-16 border-t border-[#74B487]/40 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#E67E22] font-extrabold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> RECOMMENDED
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0E382E] mt-1">
              You May Also Like
            </h2>
            <p className="text-xs text-[#1F684B] font-medium mt-1">
              Bundle & save more with our curated family packs and combo variety boxes.
            </p>
          </div>
          <Link
            to="/combos"
            className="text-xs uppercase tracking-widest text-[#E67E22] font-extrabold hover:text-[#D35400] transition-colors inline-flex items-center gap-1"
          >
            Explore All Combos →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {suggestedCombos.map((combo) => (
            <div
              key={combo.id}
              className="bg-white rounded-3xl border border-[#74B487]/40 p-6 sm:p-7 flex flex-col justify-between shadow-md space-y-6 hover:shadow-xl hover:border-[#E67E22]/60 transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Visual Frame */}
                <div className="relative w-full h-52 sm:h-60 rounded-2xl bg-gradient-to-br from-[#E8F1E9]/70 via-[#F6F5F0] to-[#E8F1E9]/40 border border-[#74B487]/30 overflow-hidden flex items-center justify-center p-4">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="badge-orange text-[9px] sm:text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-1 rounded-full shadow-xs">
                      {combo.badge}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 z-10">
                    <span className="text-xs font-black text-[#E67E22] bg-white border border-[#E67E22]/30 px-3 py-1 rounded-full shadow-xs">
                      {combo.save}
                    </span>
                  </div>

                  {/* Combo Mockups */}
                  {combo.type === "laddoo-twin" && (
                    <div className="flex items-center justify-center gap-2 sm:gap-4 w-full h-full pt-4 relative group-hover:scale-105 transition-all duration-300">
                      <img
                        src={ragiPouch}
                        alt="Shahi Ragi Laddoo Mix Pack 1"
                        className="h-24 sm:h-32 md:h-36 w-auto object-contain drop-shadow-xl -rotate-6 -translate-x-2 sm:-translate-x-3 transition-all rounded-xl border border-[#74B487]/30 shadow-md"
                      />
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0E382E] text-[#E67E22] font-black text-xs flex items-center justify-center shadow-md shrink-0 z-20">
                        +
                      </span>
                      <img
                        src={ragiPouch}
                        alt="Shahi Ragi Laddoo Mix Pack 2"
                        className="h-24 sm:h-32 md:h-36 w-auto object-contain drop-shadow-xl rotate-6 translate-x-2 sm:translate-x-3 transition-all rounded-xl border border-[#74B487]/30 shadow-md"
                      />
                    </div>
                  )}

                  {combo.type === "heritage-duo" && (
                    <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-full h-full pt-4 max-w-full">
                      <img
                        src={laddooMix}
                        alt="Shahi Ragi Laddoo Mix"
                        className="h-24 sm:h-32 md:h-36 w-auto max-w-[50%] object-contain drop-shadow-xl -rotate-2 group-hover:rotate-0 transition-all shrink-0"
                      />
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0E382E] text-[#E67E22] font-black text-xs flex items-center justify-center shadow-md shrink-0 z-10">
                        +
                      </span>
                      <div className="relative flex items-center justify-center h-28 sm:h-36 shrink-0 group-hover:scale-105 transition-all">
                        <img
                          src={paanPouchBack}
                          alt="Paan Back"
                          className="h-22 sm:h-28 w-auto object-contain drop-shadow-md rotate-6 translate-x-2 opacity-75"
                        />
                        <img
                          src={paanPouchStick}
                          alt="Paan Sachet"
                          className="h-26 sm:h-34 w-auto object-contain drop-shadow-xl -rotate-3 z-10"
                        />
                      </div>
                    </div>
                  )}

                  {combo.type === "paan-trio" && (
                    <div className="flex items-center justify-center w-full h-full pt-4 relative group-hover:scale-105 transition-all duration-300">
                      <img
                        src={paanPouchStick}
                        alt="Paan Left"
                        className="h-22 sm:h-30 w-auto object-contain drop-shadow-lg -rotate-12 -translate-x-5 sm:-translate-x-8 translate-y-1 opacity-90 transition-all"
                      />
                      <img
                        src={paanPouchStick}
                        alt="Paan Hero"
                        className="h-26 sm:h-36 w-auto object-contain drop-shadow-2xl z-10"
                      />
                      <img
                        src={paanPouchBack}
                        alt="Paan Right"
                        className="h-22 sm:h-30 w-auto object-contain drop-shadow-lg rotate-12 translate-x-5 sm:translate-x-8 translate-y-1 opacity-90 transition-all"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-extrabold text-[#0E382E] leading-tight">
                    {combo.name}
                  </h3>
                  <p className="text-xs text-[#1F684B] leading-relaxed">
                    {combo.desc}
                  </p>
                </div>

                <ul className="space-y-1.5 text-xs text-[#0E382E] font-semibold pt-1">
                  {combo.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#74B487]/30 flex items-center justify-between">
                <div>
                  <span className="text-xs line-through text-stone-400 font-bold block">
                    ₹{combo.mrp}
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#0E382E]">
                    ₹{combo.price}
                  </span>
                </div>

                <Link
                  to={combo.link}
                  className="btn-dust-orange px-5 py-2.5 text-white font-extrabold text-xs uppercase tracking-wider rounded-full inline-flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
                >
                  Order Combo <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
