import React from "react";
import { Truck, CheckCircle2 } from "lucide-react";
import { companyInfo } from "@/lib/data";

export const ShippingPolicy: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 md:px-12 lg:px-16 w-full min-h-screen bg-[#F6F5F0] text-[#0E382E]">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-3 border-b border-[#74B487]/30 pb-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold flex items-center gap-2">
            <Truck className="w-4 h-4" /> NATIONWIDE PAN-INDIA DISPATCH
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0E382E]">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs text-[#74B487] font-semibold">
            {companyInfo.name} Logistics Policy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#74B487]/40 shadow-xs space-y-2">
            <div className="text-2xl font-extrabold text-[#E67E22]">24 to 48 Hrs</div>
            <h3 className="text-xs font-extrabold text-[#0E382E] uppercase">Order Packing Time</h3>
            <p className="text-[11px] text-[#1F684B]">24 to 48 hrs of fresh packing and delivery dispatch for guaranteed freshness.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#74B487]/40 shadow-xs space-y-2">
            <div className="text-2xl font-extrabold text-[#E67E22]">3–5 Days</div>
            <h3 className="text-xs font-extrabold text-[#0E382E] uppercase">Pan-India Delivery</h3>
            <p className="text-[11px] text-[#1F684B]">Express air & surface transport to 24,000+ PIN codes across India.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#74B487]/40 shadow-xs space-y-2">
            <div className="text-2xl font-extrabold text-[#E67E22]">₹799+</div>
            <h3 className="text-xs font-extrabold text-[#0E382E] uppercase">Free Prepaid Shipping</h3>
            <p className="text-[11px] text-[#1F684B]">Zero delivery fee automatically applied on prepaid orders ₹799 and above.</p>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#74B487]/40 shadow-xs space-y-6 text-xs text-[#1F684B] leading-relaxed font-normal">
          <section className="space-y-2">
            <h2 className="text-lg font-extrabold text-[#0E382E]">1. Courier Partners & Tracking</h2>
            <p>
              We partner with premier courier networks (Shiprocket, Delhivery, BlueDart, DTDC). Once dispatched, a live tracking link is sent directly via SMS and WhatsApp ({companyInfo.phone}).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-extrabold text-[#0E382E]">2. Free Shipping Policy (Prepaid Only)</h2>
            <p>
              Free Express Shipping is available across India exclusively for <strong>prepaid orders</strong> (UPI, Credit/Debit Cards, Net Banking) of <strong>₹799 and above</strong>. Prepaid orders below ₹799 are subject to a nominal standard shipping fee of ₹50.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-extrabold text-[#0E382E]">3. Cash on Delivery (COD) Policy</h2>
            <p>
              Cash on Delivery (COD) is available across all serviceable PIN codes in India. Please note that COD orders do not qualify for free shipping and are subject to a <strong>flat delivery and handling fee of ₹120</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
