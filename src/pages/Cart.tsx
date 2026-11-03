import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Clock } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getSubtotal, clearCart } =
    useCartStore();

  const subtotal = getSubtotal();
  const isPrepaidFree = subtotal >= 799;
  const shippingFee = subtotal === 0 ? 0 : isPrepaidFree ? 0 : 50;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 md:px-12 lg:px-16 w-full min-h-screen bg-[#F6F5F0] text-[#0E382E]">
      <div className="mb-10 space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold">
          SHOPPING BAG
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0E382E]">
          Your Cart Selection
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#74B487]/40 space-y-4 max-w-md mx-auto shadow-xs">
          <ShoppingBag className="w-16 h-16 stroke-1 mx-auto text-[#74B487]" />
          <h2 className="text-xl font-extrabold text-[#0E382E]">
            Your cart is empty
          </h2>
          <p className="text-xs text-[#1F684B] font-medium">
            Explore our authentic Shahi Ragi laddoo mix and royal paan digestive shots.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3.5 btn-dust-orange text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-colors mt-2 shadow-sm"
          >
            Explore Catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-[#74B487]/40 text-xs text-[#0E382E] font-extrabold uppercase tracking-wider">
              <span>Item Description</span>
              <button
                onClick={clearCart}
                className="hover:text-[#E67E22] transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {cart.map((item) => {
              const mainImg = item.product.images[0]?.src || item.product.storyImage;
              return (
                <div
                  key={item.product.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white rounded-3xl border border-[#74B487]/40 gap-6 shadow-xs"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={mainImg}
                      alt={item.product.name}
                      className="w-20 h-24 object-contain bg-[#E8F1E9] p-2 rounded-2xl border border-[#74B487]/30 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] uppercase text-[#E67E22] font-extrabold">
                        {item.product.categoryLabel}
                      </span>
                      <h3 className="text-lg font-extrabold text-[#0E382E]">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium">
                        {item.product.netWeight}
                      </p>
                      <p className="text-xs text-[#0E382E] font-extrabold mt-1">
                        {item.product.priceDisplay}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#E8F1E9]">
                    <div className="flex items-center border border-[#74B487]/40 rounded-xl bg-[#E8F1E9]">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="px-3 py-1.5 text-[#0E382E] hover:text-[#E67E22] font-bold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-sm font-extrabold text-[#0E382E]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="px-3 py-1.5 text-[#0E382E] hover:text-[#E67E22] font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-base font-extrabold text-[#0E382E] w-20 text-right">
                      ₹{item.product.price * item.quantity}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary (4 cols) */}
          <div className="lg:col-span-4 bg-[#E8F1E9] p-8 rounded-3xl border border-[#74B487]/40 space-y-6 sticky top-28 shadow-sm">
            <h3 className="text-xl font-extrabold text-[#0E382E] border-b border-[#74B487]/30 pb-4">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs text-[#0E382E] font-medium">
              <div className="flex justify-between">
                <span className="text-stone-600">Subtotal</span>
                <span className="font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Shipping (Prepaid)</span>
                <span className="font-bold">{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
              </div>
              <p className="text-[10px] text-stone-500 leading-tight">
                *Free shipping on prepaid orders ₹799+. COD orders incur ₹120 delivery fee.
              </p>
              <div className="flex justify-between border-t border-[#74B487]/30 pt-3 text-sm font-extrabold text-[#0E382E]">
                <span>Grand Total</span>
                <span className="text-[#E67E22] text-xl font-extrabold">₹{grandTotal}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full py-4 btn-dust-orange text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#1F684B] font-bold pt-2">
              <ShieldCheck className="w-4 h-4 text-[#E67E22]" />
              <span>Safe & Secure SSL Checkout</span>
            </div>

            <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-[#74B487]/30 text-[10.5px] text-[#0E382E] font-medium text-center">
              <Clock className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
              <span>Order Packing Time: 24 to 48 hrs of fresh packing and delivery</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
