import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Truck, CheckCircle2, Clock, MapPin, Package, ExternalLink, AlertCircle } from "lucide-react";
import { companyInfo } from "@/lib/data";

interface LiveTrackOrder {
  reference: string;
  status: string;
  customerName: string;
  city: string;
  state: string;
  awb: string | null;
  courierName: string;
  trackingUrl: string | null;
  labelUrl: string | null;
  orderDate: string;
}

export const OrderTracking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const [searchQuery, setSearchQuery] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<LiveTrackOrder | null>(null);

  const fetchTracking = async (term: string) => {
    if (!term.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const apiBase =
        typeof window !== "undefined" && window.location.hostname !== "localhost"
          ? "/api"
          : "http://localhost:5000/api";
      const res = await fetch(`${apiBase}/orders/track?q=${encodeURIComponent(term.trim())}`);
      const data = await res.json();
      if (res.ok && data.success && data.order) {
        setOrderData(data.order);
      } else {
        setOrderData(null);
        setErrorMsg(data.message || "No order found with this Order ID or Phone number.");
      }
    } catch (err: any) {
      setOrderData(null);
      setErrorMsg("Network error connecting to tracking system: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchTracking(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(searchQuery);
  };

  const getTimeline = () => {
    const isDispatched = !!orderData?.awb || orderData?.status === "Handed to Courier" || orderData?.status === "Shipped" || orderData?.status === "Delivered";
    const isDelivered = orderData?.status === "Delivered";

    return [
      {
        label: "Order Placed & Confirmed",
        desc: "Order registered in live system",
        status: "completed",
        date: orderData?.orderDate ? new Date(orderData.orderDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Confirmed",
      },
      {
        label: "Packed at Pune Hub",
        desc: "Hygienically packed at Ravet Warehouse, Pune",
        status: "completed",
        date: "Completed",
      },
      {
        label: "Dispatched via Velocity Courier",
        desc: orderData?.awb
          ? `${orderData.courierName || "Velocity Express"} — AWB: ${orderData.awb}`
          : "AWB generation in progress",
        status: isDispatched ? (isDelivered ? "completed" : "active") : "pending",
        date: isDispatched ? "In Transit" : "Preparing",
      },
      {
        label: "Out for Delivery",
        desc: `Delivery agent arriving in ${orderData?.city || "your city"}`,
        status: isDelivered ? "completed" : "pending",
        date: isDelivered ? "Done" : "Expected in 2-3 Days",
      },
      {
        label: "Delivered",
        desc: "Package handed to customer",
        status: isDelivered ? "completed" : "pending",
        date: isDelivered ? "Delivered" : "--",
      },
    ];
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 md:px-12 lg:px-16 w-full min-h-screen bg-[#F6F5F0] text-[#0E382E]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Search Header */}
        <div className="space-y-4 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold flex items-center justify-center gap-2">
            <Truck className="w-4 h-4" /> LIVE VELOCITY SHIPMENT TRACKING
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0E382E]">
            Track Your DUST Order
          </h1>
          <p className="text-xs text-[#1F684B] max-w-md mx-auto">
            Enter your Order Reference ID (e.g. DST-8600-1234), AWB Number, or 10-digit mobile number.
          </p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Order ID, AWB, or Phone"
                className="w-full bg-white border border-[#74B487]/40 rounded-full pl-11 pr-4 py-3 text-xs outline-none focus:border-[#E67E22] font-mono shadow-xs"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-dust-orange px-6 py-3 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? "Searching..." : "Track"}
            </button>
          </form>
        </div>

        {errorMsg && (
          <div className="max-w-md mx-auto p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-800 text-xs flex items-center gap-2.5 font-medium">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {orderData && (
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#74B487]/40 shadow-xl space-y-8 animate-fade-in">
            {/* Status Summary Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-[#E8F1E9] rounded-2xl border border-[#74B487]/40 gap-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-[#E67E22] tracking-widest">
                  ORDER {orderData.reference}
                </span>
                <h3 className="text-2xl font-extrabold text-[#0E382E]">
                  {orderData.status || "In Transit"}
                </h3>
                <p className="text-xs text-[#1F684B] mt-0.5">
                  Courier Partner:{" "}
                  <strong>{orderData.courierName || "Velocity Express"}</strong>
                  {orderData.awb && (
                    <span className="font-mono ml-1 text-[#0E382E] font-bold">
                      (AWB: {orderData.awb})
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  Recipient: {orderData.customerName} • Destination: {orderData.city}, {orderData.state}
                </p>
              </div>

              {orderData.awb && (
                <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                  <a
                    href={`https://shipfastt.in/track/${orderData.awb}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#0E382E] hover:bg-[#E67E22] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <span>Track on Velocity</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Timeline Progress Tracker */}
            <div className="space-y-6">
              <h4 className="text-xs uppercase tracking-widest text-[#0E382E] font-extrabold">
                Live Delivery Stages
              </h4>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#74B487]/40">
                {getTimeline().map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                        step.status === "completed"
                          ? "bg-[#0E382E] text-white"
                          : step.status === "active"
                          ? "bg-[#E67E22] text-white animate-pulse"
                          : "bg-[#F6F5F0] text-stone-400 border border-stone-300"
                      }`}
                    >
                      {step.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                      ) : (
                        idx + 1
                      )}
                    </div>

                    <div className="pl-4 space-y-0.5">
                      <div className="flex items-center gap-3">
                        <h5 className="text-sm font-extrabold text-[#0E382E]">
                          {step.label}
                        </h5>
                        <span className="text-[10px] font-bold text-[#E67E22] bg-[#E8F1E9] px-2 py-0.5 rounded-full">
                          {step.date}
                        </span>
                      </div>
                      <p className="text-xs text-[#1F684B]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Help */}
            <div className="pt-6 border-t border-[#74B487]/30 flex flex-col sm:flex-row justify-between items-center text-xs text-[#1F684B] font-semibold gap-2">
              <p>Need help with your delivery? Contact Customer Support:</p>
              <a href={`tel:${companyInfo.phone}`} className="text-[#E67E22] font-bold hover:underline">
                Call {companyInfo.phoneFormatted}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
