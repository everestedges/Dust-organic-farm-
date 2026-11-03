import React from "react";
import { Link } from "react-router-dom";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Clock } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    getSubtotal,
  } = useCartStore();

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const freeShippingThreshold = 799;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0E382E]/50 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F6F5F0] border-l border-[#74B487]/40 text-[#0E382E] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-[#1F684B]/40 flex items-center justify-between bg-[#0E382E] text-[#F6F5F0]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E67E22]" />
              <h2 className="text-lg font-extrabold tracking-wider uppercase text-[#F6F5F0]">
                YOUR SELECTION
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-[#F6F5F0]/80 hover:text-[#E67E22] transition-colors"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-[#E8F1E9] px-6 py-3.5 border-b border-[#74B487]/30 space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-[#0E382E] font-medium">
                {subtotal >= freeShippingThreshold ? (
                  <span className="text-[#0E382E] font-bold flex items-center gap-1">
                    ✓ <strong className="text-[#E67E22]">Free Prepaid Shipping Unlocked!</strong>
                  </span>
                ) : (
                  <>
                    Add{" "}
                    <strong className="text-[#E67E22] font-bold">
                      ₹{freeShippingThreshold - subtotal}
                    </strong>{" "}
                    more for Free Shipping (Prepaid ₹799+)
                  </>
                )}
              </span>
            </div>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#74B487]/40">
              <div
                className="h-full bg-[#E67E22] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-stone-600 leading-tight">
              *Free delivery on prepaid orders ₹799+. For COD orders, ₹120 delivery fee applies.
            </p>
            <div className="flex items-center gap-1.5 pt-1 text-[10px] text-[#0E382E] font-medium">
              <Clock className="w-3 h-3 text-[#E67E22] shrink-0" />
              <span>Order Packing Time: 24 to 48 hrs of fresh packing and delivery</span>
            </div>
          </div>

          {/* Cart List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#0E382E]/70 py-12">
                <ShoppingBag className="w-12 h-12 stroke-1 mb-4 text-[#74B487]" />
                <p className="text-sm font-sans uppercase tracking-widest font-extrabold text-[#0E382E]">
                  Your cart is empty
                </p>
                <p className="text-xs text-[#1F684B] mt-1 max-w-xs font-normal">
                  Discover our pure fruit powders and heritage wellness creations.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-6 py-2.5 btn-dust-orange text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const mainImg = item.product.images[0]?.src || item.product.storyImage;
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3.5 bg-white rounded-xl border border-[#74B487]/30 shadow-xs"
                  >
                    <img
                      src={mainImg}
                      alt={item.product.name}
                      className="w-20 h-24 object-contain rounded-lg bg-[#F6F5F0] border border-[#74B487]/30"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold text-[#0E382E] line-clamp-1">
                            {item.product.shortName || item.product.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-stone-400 hover:text-[#E67E22] transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[11px] text-[#1F684B] font-medium mt-0.5">
                          {item.product.netWeight}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-[#74B487]/50 rounded-md bg-[#F6F5F0]">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1.5 text-[#0E382E] hover:text-[#E67E22]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-bold text-[#0E382E]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1.5 text-[#0E382E] hover:text-[#E67E22]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-extrabold text-[#0E382E]">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#74B487]/30 bg-[#E8F1E9] space-y-4">
              <div className="flex justify-between items-baseline font-sans">
                <span className="text-[#0E382E] uppercase tracking-widest text-xs font-extrabold">
                  Subtotal
                </span>
                <span className="text-xl font-extrabold text-[#0E382E]">
                  ₹{subtotal}
                </span>
              </div>
              <p className="text-[11px] text-[#1F684B] font-sans">
                Taxes & shipping calculated at checkout.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="w-full text-center px-4 py-3 bg-white border border-[#74B487] hover:bg-[#F6F5F0] text-[#0E382E] text-xs font-extrabold uppercase tracking-wider rounded-lg transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="w-full text-center px-4 py-3 btn-dust-orange text-white text-xs font-extrabold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2"
                >
                  Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
