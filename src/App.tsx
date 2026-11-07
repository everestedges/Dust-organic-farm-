import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { FilmGrain } from "@/components/cinematic/FilmGrain";
import { CustomCursor } from "@/components/cinematic/CustomCursor";
import { Navbar } from "@/components/cinematic/Navbar";
import { CartDrawer } from "@/components/cinematic/CartDrawer";
import { QuickViewModal } from "@/components/cinematic/QuickViewModal";
import { SearchOverlay } from "@/components/cinematic/SearchOverlay";
import { WhatsAppWidget } from "@/components/cinematic/WhatsAppWidget";
import { InstagramFloatingWidget } from "@/components/cinematic/InstagramFloatingWidget";
import { Footer } from "@/components/cinematic/Footer";
import { AuthModal } from "@/components/cinematic/AuthModal";

// Eager load critical landing page for maximum LCP & FCP
import { Home } from "@/pages/Home";

// Route-level code splitting for non-critical secondary pages
const Shop = lazy(() => import("@/pages/Shop").then((m) => ({ default: m.Shop })));
const ProductDetail = lazy(() => import("@/pages/ProductDetail").then((m) => ({ default: m.ProductDetail })));
const CollectionDetail = lazy(() => import("@/pages/CollectionDetail").then((m) => ({ default: m.CollectionDetail })));
const Cart = lazy(() => import("@/pages/Cart").then((m) => ({ default: m.Cart })));
const Checkout = lazy(() => import("@/pages/Checkout").then((m) => ({ default: m.Checkout })));
const Wishlist = lazy(() => import("@/pages/Wishlist").then((m) => ({ default: m.Wishlist })));
const About = lazy(() => import("@/pages/About").then((m) => ({ default: m.About })));
const Contact = lazy(() => import("@/pages/Contact").then((m) => ({ default: m.Contact })));
const Combos = lazy(() => import("@/pages/Combos").then((m) => ({ default: m.Combos })));
const FAQ = lazy(() => import("@/pages/FAQ").then((m) => ({ default: m.FAQ })));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy").then((m) => ({ default: m.PrivacyPolicy })));
const TermsConditions = lazy(() => import("@/pages/TermsConditions").then((m) => ({ default: m.TermsConditions })));
const ShippingPolicy = lazy(() => import("@/pages/ShippingPolicy").then((m) => ({ default: m.ShippingPolicy })));
const ReturnRefundPolicy = lazy(() => import("@/pages/ReturnRefundPolicy").then((m) => ({ default: m.ReturnRefundPolicy })));
const CancellationPolicy = lazy(() => import("@/pages/CancellationPolicy").then((m) => ({ default: m.CancellationPolicy })));
const OrderConfirmation = lazy(() => import("@/pages/OrderConfirmation").then((m) => ({ default: m.OrderConfirmation })));
const OrderTracking = lazy(() => import("@/pages/OrderTracking").then((m) => ({ default: m.OrderTracking })));
const Account = lazy(() => import("@/pages/Account").then((m) => ({ default: m.Account })));
const Admin = lazy(() => import("@/pages/Admin").then((m) => ({ default: m.Admin })));
const AdminLogin = lazy(() => import("@/pages/AdminLogin").then((m) => ({ default: m.AdminLogin })));
const Login = lazy(() => import("@/pages/Login").then((m) => ({ default: m.Login })));

function RouteLoadingFallback() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center bg-[#F6F5F0]">
      <div className="w-8 h-8 border-3 border-[#0E382E] border-t-[#E67E22] rounded-full animate-spin" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-white text-emerald-950 selection:bg-emerald-600 selection:text-white relative overflow-x-hidden font-sans">
        <FilmGrain />
        <CustomCursor />
        <Navbar />
        <main className="min-h-screen">
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/collections/:slug" element={<CollectionDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/combos" element={<Combos />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
              <Route path="/cancellation-policy" element={<CancellationPolicy />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/order-tracking" element={<OrderTracking />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <CartDrawer />
        <QuickViewModal />
        <SearchOverlay />
        <WhatsAppWidget />
        <InstagramFloatingWidget />
        <AuthModal />
      </div>
    </BrowserRouter>
  );
}
