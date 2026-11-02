import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Download, Truck, ArrowRight, Package, ShieldCheck } from "lucide-react";
import { companyInfo, products } from "@/lib/data";

export const OrderConfirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id") || "DST-8600-9482";
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleDownloadInvoice = () => {
    window.print();
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 md:px-12 lg:px-16 w-full min-h-screen bg-[#F6F5F0] text-[#0E382E]">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Success Header Card */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#74B487]/40 shadow-xl text-center space-y-4 invoice-success-card print:hidden">
          <div className="w-20 h-20 bg-[#E8F1E9] text-[#E67E22] rounded-full flex items-center justify-center mx-auto border-2 border-[#74B487]/50 shadow-md">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold">
              ORDER CONFIRMED & DISPATCH READY
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0E382E]">
              Thank You for Choice of Motherland!
            </h1>
            <p className="text-xs text-[#1F684B] font-semibold">
              Order Reference ID: <strong className="text-[#0E382E] font-mono">{orderId}</strong>
            </p>
          </div>

          <div className="p-4 bg-[#E8F1E9]/60 rounded-2xl border border-[#74B487]/30 max-w-md mx-auto text-xs text-[#1F684B] space-y-1">
            <p>Confirmation email sent to <strong>customer@example.com</strong></p>
            <p className="text-[11px] text-[#74B487] font-bold">Estimated Dispatch: Within 24 Hours from Pune Hub</p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4 print:hidden">
            <Link
              to={`/order-tracking?id=${orderId}`}
              className="btn-dust-orange px-6 py-3 text-white font-extrabold text-xs uppercase tracking-wider rounded-full inline-flex items-center gap-2 shadow-md"
            >
              <Truck className="w-4 h-4" /> Track Order Status
            </Link>

            <button
              onClick={handleDownloadInvoice}
              className="bg-[#0E382E] text-white hover:bg-[#1F684B] px-6 py-3 font-extrabold text-xs uppercase tracking-wider rounded-full inline-flex items-center gap-2 shadow-md transition-colors"
            >
              <Download className="w-4 h-4 text-[#E67E22]" /> Download Tax Invoice (PDF)
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Container */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#74B487]/40 shadow-md space-y-6 printable-invoice">
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-[#74B487]/30 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0E382E] flex items-center justify-center text-white text-xs font-bold">
                  D
                </div>
                <h2 className="text-xl font-extrabold text-[#0E382E] tracking-wider">
                  DUST — CHOICE OF MOTHERLAND
                </h2>
              </div>
              <p className="text-[11px] text-[#1F684B] mt-1 font-semibold">
                Parent Company: <strong>{companyInfo.name}</strong>
              </p>
              <p className="text-[10px] text-[#74B487] font-medium">
                CIN: {companyInfo.cin} | GSTIN: {companyInfo.gstin}
              </p>
              <p className="text-[10px] text-[#74B487] font-medium">
                Address: {companyInfo.address}
              </p>
            </div>

            <div className="text-right text-xs space-y-0.5">
              <h3 className="font-extrabold text-[#0E382E] text-base">TAX INVOICE</h3>
              <p className="font-mono text-[#1F684B]">Invoice #: {orderId}</p>
              <p className="text-[#74B487] font-semibold">Date: {dateStr}</p>
              <p className="text-[#E67E22] font-bold">Payment Status: PAID (Prepaid UPI)</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-[#0E382E] uppercase tracking-wider">
              Order Items Summary
            </h3>

            <div className="border border-[#74B487]/30 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#E8F1E9] text-[#0E382E] font-extrabold">
                  <tr>
                    <th className="p-3">Product Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#74B487]/20 text-[#1F684B]">
                  <tr>
                    <td className="p-3 font-semibold text-[#0E382E]">
                      Shahi Ragi & Dry Fruit Laddoo Mix (250g Pack)
                    </td>
                    <td className="p-3 text-center font-bold">2</td>
                    <td className="p-3 text-right">₹229</td>
                    <td className="p-3 text-right font-extrabold text-[#0E382E]">₹458</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#0E382E]">
                      Paan Digestive Shot Box (20g Multipack)
                    </td>
                    <td className="p-3 text-center font-bold">1</td>
                    <td className="p-3 text-right">₹249</td>
                    <td className="p-3 text-right font-extrabold text-[#0E382E]">₹249</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Calculation */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-64 space-y-2 text-xs border-t border-[#74B487]/30 pt-4">
              <div className="flex justify-between text-[#1F684B]">
                <span>Items Subtotal</span>
                <span className="font-bold">₹647</span>
              </div>
              <div className="flex justify-between text-[#1F684B]">
                <span>GST (18% Included)</span>
                <span className="font-bold">₹98.69</span>
              </div>
              <div className="flex justify-between text-[#1F684B]">
                <span>Shipping Charge</span>
                <span className="text-[#25D366] font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-[#0E382E] font-extrabold text-base pt-2 border-t border-[#74B487]/40">
                <span>Total Paid</span>
                <span className="text-[#E67E22]">₹647</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center print:hidden">
          <Link
            to="/shop"
            className="text-xs font-extrabold text-[#0E382E] hover:text-[#E67E22] underline tracking-wider uppercase inline-flex items-center gap-1"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
