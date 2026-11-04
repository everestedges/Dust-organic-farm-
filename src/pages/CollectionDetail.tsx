import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowUpRight, ShoppingBag, Eye, Heart, Zap } from "lucide-react";
import { collections, products, Collection, Product } from "@/lib/data";
import { useCartStore } from "@/lib/cart-store";

export const CollectionDetail: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const defaultCollection = collections[0] as Collection;
  const collection: Collection = collections.find((c) => c.slug === slug) ?? defaultCollection;

  const collectionProducts = products.filter(
    (p) => p.category === collection.slug
  );

  const { addToCart, toggleWishlist, isInWishlist } =
    useCartStore();

  const handleBuyNow = (product: Product) => {
    addToCart(product, 1);
    navigate("/checkout");
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 md:px-12 lg:px-16 w-full min-h-screen bg-[#F6F5F0] text-[#0E382E]">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#74B487]/40 bg-stone-900 p-6 sm:p-12 mb-16 shadow-xl min-h-[500px] sm:min-h-[600px] lg:min-h-[680px] flex flex-col justify-end">
        <img
          src={collection.heroImage}
          alt={collection.name}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-4 text-white">
          <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold">
            COLLECTION SHOWCASE
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white">
            {collection.name}
          </h1>
          <p className="text-sm text-[#E8F1E9] font-normal leading-relaxed">
            {collection.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            {collection.meta.map((item, idx) => (
              <div
                key={idx}
                className="px-4 py-2 bg-[#0E382E]/80 border border-[#74B487]/40 rounded-xl text-xs font-bold backdrop-blur-xs"
              >
                <span className="text-[#E8F1E9]">{item.label}: </span>
                <span className="text-[#E67E22] font-extrabold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pillars Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {collection.pillars.map((pillar, idx) => (
          <div
            key={idx}
            className="p-6 bg-white rounded-2xl border border-[#74B487]/40 space-y-2 shadow-xs"
          >
            <h4 className="text-sm font-extrabold text-[#0E382E]">
              {pillar.title}
            </h4>
            <p className="text-xs text-stone-600 font-normal leading-relaxed">
              {pillar.text}
            </p>
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <div className="space-y-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0E382E]">
          Products in this Collection
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collectionProducts.map((product) => {
            const inWishlist = isInWishlist(product.id);
            const mainImg = product.images[0]?.src ?? product.storyImage;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-3xl border border-[#74B487]/40 overflow-hidden hover:border-[#E67E22] transition-all flex flex-col justify-between shadow-xs hover:shadow-xl"
              >
                <div className="relative h-72 bg-white p-6 flex items-center justify-center overflow-hidden border-b border-[#74B487]/30">
                  <img
                    src={mainImg}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur border transition-colors shadow-xs ${
                      inWishlist
                        ? "bg-red-50 border-red-200 text-red-500"
                        : "bg-white border-[#74B487]/40 text-[#0E382E] hover:text-[#E67E22]"
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#E67E22]">
                      {product.categoryLabel}
                    </span>
                    <Link
                      to={`/product/${product.slug}`}
                      className="block hover:text-[#E67E22] transition-colors mt-1"
                    >
                      <h3 className="text-xl font-extrabold text-[#0E382E]">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#1F684B] italic mt-0.5 font-semibold">
                      "{product.subtitle || product.pitch}"
                    </p>
                  </div>

                  <div className="flex justify-between items-baseline pt-2">
                    <span className="text-xs text-stone-500 font-medium">
                      {product.netWeight}
                    </span>
                    <span className="text-xl font-extrabold text-[#0E382E]">
                      {product.priceDisplay}
                    </span>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 py-2.5 btn-dust-orange text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Add
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      data-cursor="BUY"
                      className="px-3.5 py-2.5 bg-[#0E382E] hover:bg-[#1F684B] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#E67E22]" /> Buy Now
                    </button>
                    <Link
                      to={`/product/${product.slug}`}
                      className="p-2.5 bg-[#F6F5F0] border border-[#74B487]/40 text-[#0E382E] hover:text-[#E67E22] hover:border-[#E67E22] rounded-xl transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Collection Visuals */}
      {collection.slug === "wholesome-millets" && (
        <section className="mt-20 pt-16 border-t border-[#74B487]/40 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#E67E22] font-extrabold bg-[#E8F1E9] border border-[#74B487]/40 px-3 py-1 rounded-full inline-block">
              FEATURED VISUAL SPOTLIGHT
            </span>
            <h2 className="text-3xl font-extrabold text-[#0E382E]">
              The Ragi Laddoo Mix Story
            </h2>
            <p className="text-xs sm:text-sm text-[#1F684B]">
              Discover why traditional finger millet is the superfood grain of tomorrow. 100% transparent ingredients and traditional goodness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl border border-[#74B487]/40 p-4 sm:p-6 shadow-sm flex flex-col items-center group hover:border-[#E67E22] transition-colors">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E67E22] mb-3">
                OFFICIAL BRAND POSTER
              </span>
              <img
                src="/ragi-poster.png"
                alt="Ragi & Dry Fruit Laddoo Mix Poster"
                className="w-full h-auto max-h-[460px] object-contain rounded-2xl border border-[#74B487]/20"
              />
              <p className="text-[11px] text-stone-500 mt-3 font-medium text-center">
                Not Made For Everyone • Made For Those Who Choose Better
              </p>
            </div>
            <div className="bg-white rounded-3xl border border-[#74B487]/40 p-4 sm:p-6 shadow-sm flex flex-col items-center group hover:border-[#E67E22] transition-colors">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E67E22] mb-3">
                NUTRITION & INGREDIENT INFOGRAPHIC
              </span>
              <img
                src="/ragi-infographic.png"
                alt="Ragi Dry Fruit Laddoo Mix Infographic"
                className="w-full h-auto max-h-[460px] object-contain rounded-2xl border border-[#74B487]/20"
              />
              <p className="text-[11px] text-stone-500 mt-3 font-medium text-center">
                Complete breakdown of finger millet, roasted nuts, seeds, and preparation ritual.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
