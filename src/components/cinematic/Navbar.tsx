import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Heart, Menu, X, Sparkles, Phone, User } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const {
    getTotalItems,
    toggleCart,
    toggleSearch,
    wishlist,
  } = useCartStore();

  const totalCartCount = getTotalItems();
  const wishlistCount = wishlist.length;

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !scrolled && !mobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 print:hidden">
        {/* Top Announcement Bar / Display Line */}
        <div
          className={`transition-colors duration-300 py-1.5 sm:py-2 px-4 text-center text-xs tracking-wider flex items-center justify-center gap-2 sm:gap-3 ${
            isTransparent
              ? "bg-black/35 backdrop-blur-xs text-[#F6F5F0] border-b border-white/10"
              : "bg-[#0E382E] text-[#F6F5F0] border-b border-[#E67E22]/30 shadow-xs"
          }`}
        >
          <span className="text-[#E67E22] text-xs font-black">✦</span>
          <span className="font-extrabold uppercase tracking-[0.16em] text-stone-200 text-[11px] sm:text-xs">
            NOT MADE FOR EVERYONE
          </span>
          <span className="text-[#E67E22] font-black text-xs">•</span>
          <span className="font-black uppercase tracking-[0.16em] text-[#E67E22] text-[11px] sm:text-xs">
            MADE FOR THOSE WHO CHOOSE BETTER
          </span>
          <span className="text-[#E67E22] text-xs font-black">✦</span>
        </div>

        {/* Main Header / Navbar */}
        <header
          className={`w-full transition-all duration-300 ${
            isTransparent
              ? "bg-transparent border-b border-white/15 py-3 sm:py-3.5"
              : scrolled
              ? "bg-[#F6F5F0]/95 backdrop-blur-md py-2.5 shadow-md border-b border-[#74B487]/30"
              : "bg-[#F6F5F0]/95 backdrop-blur-md py-3.5 border-b border-[#74B487]/30"
          }`}
        >
          <div className="relative w-full px-3 sm:px-6 md:px-12 lg:px-16 flex items-center justify-between">
            {/* Mobile Hamburger Toggle (Left on mobile, hidden on md+) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 md:hidden transition-colors rounded-full shrink-0 z-10 ${
                isTransparent
                  ? "text-white hover:text-[#fab683] hover:bg-white/10"
                  : "text-[#0E382E] hover:text-[#E67E22] hover:bg-[#E8F1E9]"
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo (Centered on mobile, left on md+) */}
            <div className="flex md:static absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 items-center">
              <Link
                to="/"
                className="group flex items-center gap-2 sm:gap-3 transition-opacity hover:opacity-90 shrink-0"
                data-cursor="HOME"
              >
                <div
                  className={`relative h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden border shadow-xs flex items-center justify-center bg-[#0E382E] shrink-0 group-hover:scale-105 transition-transform ${
                    isTransparent ? "border-white/50" : "border-[#74B487]/50"
                  }`}
                >
                  <img
                    src="/logo.png"
                    alt="DUST — Choice of Motherland"
                    className="w-full h-full object-cover scale-[1.38]"
                  />
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-extrabold transition-colors font-sans text-xl leading-none tracking-widest ${
                      isTransparent
                        ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] group-hover:text-[#fab683]"
                        : "text-[#0E382E] group-hover:text-[#E67E22]"
                    }`}
                  >
                    DUST
                  </span>
                  <span
                    className={`text-[9px] tracking-[0.2em] font-sans font-extrabold uppercase hidden sm:inline mt-0.5 ${
                      isTransparent ? "text-[#fab683] drop-shadow-xs" : "text-[#E67E22]"
                    }`}
                  >
                    CHOICE OF MOTHERLAND
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden xl:flex items-center gap-6 font-sans">
              {[
                { to: "/shop", label: "Shop All" },
                { to: "/combos", label: "Combos" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/faq", label: "FAQ" },
              ].map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`text-xs uppercase tracking-[0.15em] font-bold transition-all ${
                      isTransparent
                        ? isActive
                          ? "text-[#fab683] border-b-2 border-[#fab683] pb-0.5 drop-shadow-sm"
                          : "text-white/95 hover:text-[#fab683] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                        : isActive
                        ? "text-[#E67E22] border-b-2 border-[#E67E22] pb-0.5"
                        : "text-[#0E382E] hover:text-[#E67E22]"
                    }`}
                    data-cursor="EXPLORE"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1 sm:gap-3 md:gap-4 shrink-0 z-10">
              {/* Phone Call Link */}
              <a
                href="tel:8600694906"
                className={`p-2 transition-colors rounded-full hidden sm:flex items-center gap-1.5 ${
                  isTransparent
                    ? "text-white hover:text-[#fab683] hover:bg-white/10"
                    : "text-[#0E382E] hover:text-[#E67E22] hover:bg-[#E8F1E9]"
                }`}
                title="Call Customer Care (8600694906)"
              >
                <Phone className="w-5 h-5" />
              </a>

              {/* Search Trigger */}
              <button
                onClick={toggleSearch}
                className={`p-2 transition-colors relative rounded-full ${
                  isTransparent
                    ? "text-white hover:text-[#fab683] hover:bg-white/10"
                    : "text-[#0E382E] hover:text-[#E67E22] hover:bg-[#E8F1E9]"
                }`}
                aria-label="Search catalogue"
                data-cursor="SEARCH"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Account Link / Auth Modal Trigger */}
              {isAuthenticated ? (
                <Link
                  to="/account"
                  className={`p-2 transition-colors rounded-full relative ${
                    isTransparent
                      ? "text-white hover:text-[#fab683] hover:bg-white/10"
                      : "text-[#0E382E] hover:text-[#E67E22] hover:bg-[#E8F1E9]"
                  }`}
                  title={`Logged in as ${user?.name || "Account"}`}
                  aria-label="My Account"
                >
                  <User className="w-5 h-5" />
                  <span className="absolute top-1 right-1 bg-[#25D366] w-2.5 h-2.5 rounded-full border border-white"></span>
                </Link>
              ) : (
                <button
                  onClick={() => openAuthModal("login")}
                  className={`p-2 transition-colors rounded-full ${
                    isTransparent
                      ? "text-white hover:text-[#fab683] hover:bg-white/10"
                      : "text-[#0E382E] hover:text-[#E67E22] hover:bg-[#E8F1E9]"
                  }`}
                  title="Log In / Sign Up"
                  aria-label="Log In / Sign Up"
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              {/* Wishlist Link (hidden on xs mobile to prevent clutter, visible on sm+) */}
              <Link
                to="/wishlist"
                className={`p-2 transition-colors relative rounded-full hidden sm:flex ${
                  isTransparent
                    ? "text-white hover:text-[#fab683] hover:bg-white/10"
                    : "text-[#0E382E] hover:text-[#E67E22] hover:bg-[#E8F1E9]"
                }`}
                aria-label="View Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#E67E22] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Trigger */}
              <button
                onClick={toggleCart}
                className={`relative flex items-center justify-center p-2 transition-all rounded-full ${
                  isTransparent
                    ? "text-white hover:text-[#fab683] hover:bg-white/10 sm:bg-white/15 sm:backdrop-blur-xs sm:border sm:border-white/25 sm:px-3.5 sm:py-1.5"
                    : "text-[#0E382E] hover:text-[#E67E22] hover:bg-[#E8F1E9] sm:bg-[#E8F1E9] sm:border sm:border-[#74B487]/50 sm:px-3.5 sm:py-1.5 sm:shadow-xs"
                }`}
                aria-label="Shopping Cart"
                data-cursor="CART"
              >
                <ShoppingBag className="w-5 h-5 sm:w-4 sm:h-4" />
                <span
                  className={`hidden sm:inline text-xs font-bold tracking-wider ${
                    isTransparent ? "text-white" : "text-[#0E382E]"
                  }`}
                >
                  CART
                </span>
                <span className="absolute -top-1 -right-1 sm:static sm:top-auto sm:right-auto bg-[#E67E22] text-white font-bold text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#F6F5F0]/98 backdrop-blur-xl flex flex-col justify-center px-8 md:hidden border-b border-[#74B487]">
          <nav className="flex flex-col gap-6 text-center">
            <Link
              to="/"
              className="text-2xl font-bold uppercase tracking-widest text-[#0E382E] hover:text-[#E67E22] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-2xl font-bold uppercase tracking-widest text-[#0E382E] hover:text-[#E67E22] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop All
            </Link>
            <Link
              to="/combos"
              className="text-xl font-bold uppercase tracking-widest text-[#0E382E] hover:text-[#E67E22] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Combos & Offers
            </Link>
            <Link
              to="/about"
              className="text-xl font-bold uppercase tracking-widest text-[#0E382E] hover:text-[#E67E22] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-xl font-bold uppercase tracking-widest text-[#0E382E] hover:text-[#E67E22] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Link
              to="/faq"
              className="text-xl font-bold uppercase tracking-widest text-[#0E382E] hover:text-[#E67E22] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              to="/wishlist"
              className="text-xl font-bold uppercase tracking-widest text-[#E67E22] transition-colors pt-4 border-t border-[#74B487]/30"
              onClick={() => setMobileMenuOpen(false)}
            >
              Saved Wishlist ({wishlistCount})
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};
