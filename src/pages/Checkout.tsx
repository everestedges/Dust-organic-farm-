import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, CheckCircle2, ArrowLeft, Clock, Ticket, Tag, X as XIcon, Sparkles } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { useCouponsStore, Coupon } from "@/lib/coupons-store";

export const Checkout: React.FC = () => {
  const { cart, getSubtotal, clearCart } = useCartStore();
  const { user, isAuthenticated, openAuthModal } = useAuthStore();

  const { coupons, fetchCoupons, validateCoupon } = useCouponsStore();

  useEffect(() => {
    fetchCoupons(false);
  }, [fetchCoupons]);

  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponFeedback, setCouponFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    pincode: user?.pincode || "",
    paymentMethod: "upi",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        city: user.city || prev.city,
        pincode: user.pincode || prev.pincode,
      }));
    }
  }, [user]);

  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();

  // Dynamic coupon discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    const maxCap = appliedCoupon.maxDiscountAmount || appliedCoupon.maxDiscount;
    if (appliedCoupon.minOrderAmount && subtotal < appliedCoupon.minOrderAmount) {
      discountAmount = 0;
    } else if (appliedCoupon.discountType === "percentage") {
      let disc = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (maxCap && disc > maxCap) {
        disc = maxCap;
      }
      discountAmount = disc;
    } else {
      discountAmount = Math.min(subtotal, appliedCoupon.discountValue);
    }
  }

  const isCOD = formData.paymentMethod === "cod";
  const shippingFee = subtotal === 0 ? 0 : isCOD ? 120 : subtotal >= 599 ? 0 : 50;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const applyCouponCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return;
    const result = validateCoupon(clean, subtotal);
    if (result.isValid && result.coupon) {
      setAppliedCoupon(result.coupon);
      setPromoCode(result.coupon.code);
      setCouponFeedback({
        type: "success",
        message: result.message,
      });
    } else {
      setCouponFeedback({
        type: "error",
        message: result.message,
      });
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    applyCouponCode(promoCode);
  };

  const handleRemovePromo = () => {
    setAppliedCoupon(null);
    setPromoCode("");
    setCouponFeedback(null);
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert("Please fill in your full name, email, phone number, and shipping address.");
      return;
    }

    setIsSubmitting(true);
    const generatedId = "DST-8600-" + Math.floor(1000 + Math.random() * 9000);
    setOrderId(generatedId);

    const apiBase =
      typeof window !== "undefined" && window.location.hostname !== "localhost"
        ? "/api"
        : "http://localhost:5000/api";

    const payload = {
      reference: generatedId,
      customerName: (formData.name || user?.name || "Customer").trim(),
      customerEmail: (formData.email || user?.email || "").trim(),
      customerPhone: (formData.phone || user?.phone || "").trim(),
      address: formData.address.trim(),
      city: (formData.city || "Pune").trim(),
      state: "Maharashtra",
      pincode: (formData.pincode || "411045").trim(),
      total: grandTotal,
      subtotal: subtotal,
      discount: discountAmount,
      promoCode: appliedCoupon?.code || null,
      paymentMethod: isCOD ? "COD" : "UPI",
      items:
        cart.length > 0
          ? cart.map((item) => ({
              productId: 1,
              name: item.product?.name || "DUST Organic Powder",
              quantity: item.quantity || 1,
              price: item.product?.price || 0,
            }))
          : [
              {
                productId: 1,
                name: "DUST Organic Heritage Powder",
                quantity: 1,
                price: grandTotal,
              },
            ],
    };

    try {
      const response = await fetch(`${apiBase}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        alert(
          "Could not place order: " +
            (data.message || response.statusText || "Database server error")
        );
        setIsSubmitting(false);
        return;
      }

      // Save order to local fallback storage
      try {
        const localBackup = JSON.parse(
          localStorage.getItem("dust_orders_history_backup") || "[]"
        );
        localBackup.unshift({
          id: generatedId,
          date: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          total: grandTotal,
          status: "Pending",
          items: payload.items
            .map((i: any) => `${i.quantity}x ${i.name}`)
            .join(", "),
          customerEmail: payload.customerEmail,
        });
        localStorage.setItem(
          "dust_orders_history_backup",
          JSON.stringify(localBackup)
        );
      } catch (backupErr) {
        // Ignored
      }

      setOrderComplete(true);
      clearCart();
    } catch (err: any) {
      alert("Network error submitting order: " + err.message + ". Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="pt-36 pb-24 px-4 sm:px-8 max-w-xl mx-auto min-h-screen text-center space-y-6 bg-[#F6F5F0] text-[#0E382E]">
        <div className="w-20 h-20 bg-[#E8F1E9] text-[#E67E22] rounded-full border border-[#74B487]/40 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#0E382E]">
          Order Confirmed!
        </h1>
        <p className="text-sm text-stone-700 font-normal">
          Thank you, <strong className="text-[#0E382E]">{formData.name}</strong>. Your order <span className="text-[#E67E22] font-extrabold">{orderId}</span> has been placed successfully.
        </p>
        <div className="p-6 bg-white rounded-2xl border border-[#74B487]/40 text-left text-xs space-y-2 text-stone-700 shadow-xs">
          <p><strong className="text-[#0E382E]">Shipping Address:</strong> {formData.address}, {formData.city} - {formData.pincode}</p>
          <p><strong className="text-[#0E382E]">Payment Method:</strong> {formData.paymentMethod.toUpperCase()}</p>
          <p><strong className="text-[#0E382E]">Estimated Delivery:</strong> 2-4 Business Days</p>
        </div>
        <Link
          to="/"
          className="inline-block px-8 py-3.5 btn-dust-orange text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-colors shadow-sm"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 md:px-12 lg:px-16 w-full min-h-screen bg-[#F6F5F0] text-[#0E382E]">
      <div className="mb-8 flex items-center gap-4">
        <Link to="/cart" className="text-[#0E382E] hover:text-[#E67E22] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold">
            CHECKOUT
          </span>
          <h1 className="text-3xl font-extrabold text-[#0E382E]">
            Complete Your Order
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Form (7 cols) */}
        <form onSubmit={handleCompleteOrder} className="lg:col-span-7 space-y-8">
          {/* 1. Customer Contact & Details */}
          <div className="bg-white p-6 rounded-3xl border border-[#74B487]/40 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="text-xs uppercase font-extrabold text-[#E67E22] tracking-wider">
                1. Customer Contact & Details
              </h3>
              {isAuthenticated && user ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F1E9] text-[#0E382E] text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Logged in as: {user.email}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="text-[11px] font-extrabold text-[#0E382E] hover:text-[#E67E22] transition-colors underline decoration-[#E67E22]/60"
                >
                  Already have an account? Sign in (Optional)
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <input
                type="text"
                required
                placeholder="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[#F6F5F0] p-3 rounded-xl border border-[#74B487]/40 text-[#0E382E] outline-none focus:border-[#E67E22] font-medium"
              />
              <input
                type="email"
                required
                placeholder="Email Address *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-[#F6F5F0] p-3 rounded-xl border border-[#74B487]/40 text-[#0E382E] outline-none focus:border-[#E67E22] font-medium"
              />
              <input
                type="tel"
                required
                placeholder="Mobile Number (for delivery SMS) *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-[#F6F5F0] p-3 rounded-xl border border-[#74B487]/40 text-[#0E382E] outline-none focus:border-[#E67E22] font-medium sm:col-span-2"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-3xl border border-[#74B487]/40 space-y-4 shadow-xs">
            <h3 className="text-xs uppercase font-extrabold text-[#E67E22] tracking-wider">
              2. Shipping Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <input
                type="text"
                required
                placeholder="Street Address / House No. *"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-[#F6F5F0] p-3 rounded-xl border border-[#74B487]/40 text-[#0E382E] outline-none focus:border-[#E67E22] font-medium sm:col-span-2"
              />
              <input
                type="text"
                required
                placeholder="City *"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="bg-[#F6F5F0] p-3 rounded-xl border border-[#74B487]/40 text-[#0E382E] outline-none focus:border-[#E67E22] font-medium"
              />
              <input
                type="text"
                required
                placeholder="Pincode *"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="bg-[#F6F5F0] p-3 rounded-xl border border-[#74B487]/40 text-[#0E382E] outline-none focus:border-[#E67E22] font-medium"
              />
            </div>
          </div>

          {/* Payment Selection */}
          <div className="bg-white p-6 rounded-3xl border border-[#74B487]/40 space-y-4 shadow-xs">
            <h3 className="text-xs uppercase font-extrabold text-[#E67E22] tracking-wider">
              3. Select Payment Method
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { id: "upi", label: "UPI / GPay / PhonePe", note: "Prepaid • Free Shipping on ₹599+" },
                { id: "card", label: "Credit / Debit Card", note: "Prepaid • Free Shipping on ₹599+" },
                { id: "netbanking", label: "Net Banking", note: "Prepaid • Free Shipping on ₹599+" },
                { id: "cod", label: "Cash on Delivery", note: "₹120 Delivery fee applies" },
              ].map((pm) => (
                <button
                  type="button"
                  key={pm.id}
                  onClick={() => setFormData({ ...formData, paymentMethod: pm.id })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    formData.paymentMethod === pm.id
                      ? "bg-[#E67E22] text-white border-[#E67E22] shadow-xs"
                      : "bg-[#F6F5F0] border-[#74B487]/40 text-[#0E382E] hover:bg-[#E8F1E9]"
                  }`}
                >
                  <div className="font-extrabold">{pm.label}</div>
                  <div className={`text-[10px] mt-1 ${formData.paymentMethod === pm.id ? "text-white/90" : "text-stone-500 font-medium"}`}>
                    {pm.note}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 btn-dust-orange text-white font-extrabold text-sm uppercase tracking-widest rounded-2xl transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving Order to Live Database...
              </>
            ) : (
              `Place Order (₹${grandTotal})`
            )}
          </button>
        </form>

        {/* Order Summary Sidebar (5 cols) */}
        <div className="lg:col-span-5 bg-[#E8F1E9] p-8 rounded-3xl border border-[#74B487]/40 space-y-6 sticky top-28 shadow-sm">
          <h3 className="text-xl font-extrabold text-[#0E382E] border-b border-[#74B487]/30 pb-4">
            Items in Order
          </h3>

          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]?.src || item.product.storyImage}
                    alt={item.product.name}
                    className="w-12 h-14 object-contain bg-white p-1 rounded-lg border border-[#74B487]/30"
                  />
                  <div>
                    <h4 className="font-extrabold text-[#0E382E]">{item.product.shortName || item.product.name}</h4>
                    <p className="text-stone-500 font-medium">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-[#0E382E] font-extrabold">
                  ₹{item.product.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Available Offers Picker */}
          {(() => {
            const activeCoupons = coupons.filter(
              (c) => c.isActive && (!c.expiryDate || new Date(c.expiryDate).getTime() >= Date.now())
            );
            if (activeCoupons.length === 0) return null;
            return (
              <div className="pt-2 border-t border-[#74B487]/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold text-[#0E382E]">
                  <span className="inline-flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-[#E67E22]" /> Available Offers & Coupons
                  </span>
                  <span className="text-[10px] text-stone-500 font-bold">
                    {activeCoupons.length} offer{activeCoupons.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {activeCoupons.map((cpn) => {
                    const isSelected = appliedCoupon?.code === cpn.code;
                    const meetsMin = !cpn.minOrderAmount || subtotal >= cpn.minOrderAmount;

                    return (
                      <div
                        key={cpn.id}
                        className={`p-2 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                          isSelected
                            ? "bg-[#25D366]/10 border-[#25D366]/40 shadow-xs"
                            : meetsMin
                            ? "bg-white border-[#74B487]/30 hover:border-[#0E382E]"
                            : "bg-stone-50 border-stone-200 opacity-60"
                        }`}
                      >
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono font-black text-[#0E382E] bg-stone-100 px-2 py-0.5 rounded border border-stone-200 text-[11px]">
                              {cpn.code}
                            </span>
                            <span className="font-extrabold text-[#E67E22] text-[11px]">
                              {cpn.discountType === "percentage"
                                ? `${cpn.discountValue}% OFF`
                                : `₹${cpn.discountValue} FLAT OFF`}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500 truncate">
                            {cpn.description || (cpn.minOrderAmount ? `Orders above ₹${cpn.minOrderAmount}` : "Valid on all orders")}
                          </p>
                        </div>

                        {isSelected ? (
                          <button
                            type="button"
                            onClick={handleRemovePromo}
                            className="shrink-0 text-[10px] font-extrabold text-red-500 hover:underline px-2 py-1"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => applyCouponCode(cpn.code)}
                            className="shrink-0 px-2.5 py-1 bg-[#0E382E] hover:bg-[#E67E22] text-white text-[10px] font-extrabold rounded-lg uppercase transition-colors"
                          >
                            Apply
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Promo Code Form / Applied State */}
          {!appliedCoupon ? (
            <div className="pt-2 border-t border-[#74B487]/30 space-y-1.5">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="w-full bg-white pl-8 pr-3 py-2 text-xs text-[#0E382E] rounded-xl border border-[#74B487]/40 outline-none uppercase font-extrabold tracking-wider focus:border-[#0E382E]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 btn-dust-orange text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-xs"
                >
                  Apply
                </button>
              </form>

              {couponFeedback && (
                <p
                  className={`text-xs font-extrabold flex items-center gap-1.5 ${
                    couponFeedback.type === "success" ? "text-[#25D366]" : "text-red-500"
                  }`}
                >
                  {couponFeedback.type === "success" ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span>⚠️</span>
                  )}
                  {couponFeedback.message}
                </p>
              )}
            </div>
          ) : (
            <div className="pt-2 border-t border-[#74B487]/30">
              <div className="p-2.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-mono font-black text-xs text-[#0E382E] uppercase">
                      {appliedCoupon.code}
                    </span>
                    <p className="text-[10px] text-[#0E382E] font-extrabold">
                      ✓ Coupon Applied: Save ₹{discountAmount} (
                      {appliedCoupon.discountType === "percentage"
                        ? `${appliedCoupon.discountValue}% OFF`
                        : `₹${appliedCoupon.discountValue} FLAT`}
                      )
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemovePromo}
                  className="px-2.5 py-1 text-[11px] font-extrabold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Calculation Breakdown */}
          <div className="space-y-2.5 text-xs text-[#0E382E] font-medium pt-4 border-t border-[#74B487]/30">
            <div className="flex justify-between">
              <span className="text-stone-600">Subtotal</span>
              <span className="font-bold">₹{subtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#E67E22] font-extrabold">
                <span>
                  Coupon Discount ({appliedCoupon?.code}{" "}
                  {appliedCoupon?.discountType === "percentage"
                    ? `${appliedCoupon?.discountValue}%`
                    : "FLAT"}
                  )
                </span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-stone-600">
                Shipping {isCOD ? "(COD Delivery Fee)" : "(Prepaid)"}
              </span>
              <span className="font-bold">
                {shippingFee === 0 ? (
                  <span className="text-[#25D366]">FREE</span>
                ) : (
                  `₹${shippingFee}`
                )}
              </span>
            </div>
            {isCOD ? (
              <p className="text-[10px] text-[#E67E22] font-semibold leading-tight">
                *Cash on Delivery incurs a ₹120 fee. Switch to Prepaid (UPI/Card) for Free Shipping on orders ₹599+!
              </p>
            ) : subtotal < 599 ? (
              <p className="text-[10px] text-stone-500 leading-tight">
                *Add ₹{599 - subtotal} more to unlock Free Shipping on this prepaid order.
              </p>
            ) : (
              <p className="text-[10px] text-[#25D366] font-semibold leading-tight">
                ✓ Free Shipping unlocked on your prepaid order!
              </p>
            )}
            <div className="flex justify-between border-t border-[#74B487]/30 pt-3 text-sm font-extrabold text-[#0E382E]">
              <span>Total Payable</span>
              <span className="text-[#E67E22] text-xl font-extrabold">₹{grandTotal}</span>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#74B487]/30 text-[11px] text-[#0E382E] font-medium">
              <Clock className="w-4 h-4 text-[#E67E22] shrink-0" />
              <span><strong>Order Packing Time:</strong> 24 to 48 hrs of fresh packing and delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
