import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Eye, Heart, Search, ArrowUpRight, Zap } from "lucide-react";
import { products, Product } from "@/lib/data";
import { useCartStore } from "@/lib/cart-store";

export const Shop: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { addToCart, toggleWishlist, isInWishlist } =
    useCartStore();

  const handleBuyNow = (product: Product) => {
    addToCart(product, 1);
    navigate("/checkout");
  };

  const filtered = products
    .filter((p) => {
      if (selectedCategory !== "all" && p.category !== selectedCategory) {
        return false;
      }
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.pitch.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 md:px-12 lg:px-16 w-full min-h-screen bg-[#F6F5F0] text-[#0E382E]">
      {/* Header */}
      <div className="mb-10 space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#E67E22]">
          DUST CATALOGUE
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0E382E]">
          Shop All Creations
        </h1>
        <p className="text-[#1F684B] text-sm max-w-xl font-normal">
          Explore our range of Wholesome Laddoo Premix, nutritious laddoo mixes, and heritage wellness creations — Choice of Motherland.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[#E8F1E9] p-4 rounded-2xl border border-[#74B487]/40 mb-10 shadow-xs">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors ${
              selectedCategory === "all"
                ? "bg-[#E67E22] text-white shadow-xs"
                : "bg-white text-[#0E382E] hover:bg-[#74B487]/20 border border-[#74B487]/40"
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => setSelectedCategory("wholesome-millets")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors ${
              selectedCategory === "wholesome-millets"
                ? "bg-[#E67E22] text-white shadow-xs"
                : "bg-white text-[#0E382E] hover:bg-[#74B487]/20 border border-[#74B487]/40"
            }`}
          >
            Wholesome Laddoo Premix
          </button>
          <button
            onClick={() => setSelectedCategory("heritage-wellness")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors ${
              selectedCategory === "heritage-wellness"
                ? "bg-[#E67E22] text-white shadow-xs"
                : "bg-white text-[#0E382E] hover:bg-[#74B487]/20 border border-[#74B487]/40"
            }`}
          >
            Heritage Wellness
          </button>
          <button
            onClick={() => setSelectedCategory("pure-nut-powders")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors ${
              selectedCategory === "pure-nut-powders"
                ? "bg-[#E67E22] text-white shadow-xs"
                : "bg-white text-[#0E382E] hover:bg-[#74B487]/20 border border-[#74B487]/40"
            }`}
          >
            Pure Nut Powders
          </button>
          <button
            onClick={() => setSelectedCategory("herbal-haircare")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors ${
              selectedCategory === "herbal-haircare"
                ? "bg-[#E67E22] text-white shadow-xs"
                : "bg-white text-[#0E382E] hover:bg-[#74B487]/20 border border-[#74B487]/40"
            }`}
          >
            Herbal Hair Care
          </button>
        </div>

        {/* Right Search & Sort */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E67E22]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-white text-xs text-[#0E382E] pl-9 pr-3 py-2 rounded-xl border border-[#74B487]/40 focus:border-[#E67E22] outline-none font-medium"
            />
          </div>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white text-xs text-[#0E382E] px-3 py-2 rounded-xl border border-[#74B487]/40 outline-none focus:border-[#E67E22] font-bold"
          >
            <option value="featured">Featured Sort</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((product) => {
          const inWishlist = isInWishlist(product.id);
          const mainImg = product.images[0]?.src || product.storyImage;

          return (
            <div
              key={product.id}
              className="group bg-white rounded-3xl border border-[#74B487]/40 overflow-hidden hover:border-[#E67E22] transition-all flex flex-col justify-between shadow-xs hover:shadow-xl"
            >
              {/* Product Visual */}
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

              {/* Details */}
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
                    "{product.pitch}"
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
  );
};
