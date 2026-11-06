import React, { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, Building } from "lucide-react";
import { companyInfo } from "@/lib/data";

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "General Enquiry",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const API_BASE =
      typeof window !== "undefined" && window.location.hostname !== "localhost"
        ? "/api"
        : "http://localhost:5000/api";

    try {
      const res = await fetch(`${API_BASE}/distributor-leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          company: `Website Contact Inquiry (${formData.inquiryType})`,
          phone: formData.phone.trim() || "Not provided",
          email: formData.email.trim(),
          cityState: "Online Direct Support",
          channel: formData.inquiryType,
          investment: "Customer Support / Inquiry",
          message: formData.message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.message || "Failed to submit message. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage("Network error connecting to database: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 md:px-12 lg:px-16 w-full min-h-screen bg-[#F6F5F0] text-[#0E382E]">
      {/* Header */}
      <div className="max-w-3xl mb-12 space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold">
          GET IN TOUCH WITH US
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0E382E]">
          Contact DUST Team
        </h1>
        <p className="text-base text-[#1F684B]">
          Have questions about our sachet rituals, bulk orders, or distributorship? We are here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Company Identity */}
          <div className="bg-white p-8 rounded-3xl border border-[#74B487]/40 shadow-xs space-y-4">
            <div className="flex items-center gap-3 text-[#E67E22]">
              <Building className="w-6 h-6" />
              <span className="text-xs uppercase tracking-widest font-extrabold">
                PARENT COMPANY
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#0E382E]">
              {companyInfo.name}
            </h2>
            <div className="space-y-1 text-xs text-[#1F684B] font-semibold">
              <p>CIN: {companyInfo.cin}</p>
              <p>GSTIN: {companyInfo.gstin}</p>
              <p>PAN: {companyInfo.pan} | TAN: {companyInfo.tan}</p>
              <p>FSSAI: {companyInfo.fssai}</p>
            </div>
          </div>

          {/* Direct Communication Channels */}
          <div className="bg-white p-8 rounded-3xl border border-[#74B487]/40 shadow-xs space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#E8F1E9] text-[#E67E22] rounded-2xl shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#0E382E]">
                  Registered Office Address
                </h3>
                <p className="text-xs text-[#1F684B] mt-1 font-medium leading-relaxed">
                  {companyInfo.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#E8F1E9] text-[#E67E22] rounded-2xl shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#0E382E]">
                  Phone / Support
                </h3>
                <a
                  href={`tel:${companyInfo.phone}`}
                  className="text-sm font-extrabold text-[#E67E22] hover:underline mt-1 block"
                >
                  {companyInfo.phoneFormatted}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#E8F1E9] text-[#25D366] rounded-2xl shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#0E382E]">
                  WhatsApp Support
                </h3>
                <a
                  href={companyInfo.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-extrabold text-[#25D366] hover:underline mt-1 block"
                >
                  Chat on WhatsApp ({companyInfo.phone})
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#E8F1E9] text-[#E67E22] rounded-2xl shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#0E382E]">
                  Email Addresses
                </h3>
                <p className="text-xs text-[#1F684B]">
                  Customer Care:{" "}
                  <a
                    href={`mailto:${companyInfo.email}`}
                    className="font-bold text-[#0E382E] hover:text-[#E67E22]"
                  >
                    {companyInfo.email}
                  </a>
                </p>
                <p className="text-xs text-[#1F684B]">
                  Business Enquiries:{" "}
                  <a
                    href={`mailto:${companyInfo.businessEmail}`}
                    className="font-bold text-[#0E382E] hover:text-[#E67E22]"
                  >
                    {companyInfo.businessEmail}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form & Google Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#74B487]/40 shadow-xs space-y-6">
            <h2 className="text-2xl font-extrabold text-[#0E382E]">
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="p-8 bg-[#E8F1E9] rounded-2xl border border-[#74B487] text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#E67E22] mx-auto" />
                <h3 className="text-xl font-extrabold text-[#0E382E]">
                  Message Received!
                </h3>
                <p className="text-xs text-[#1F684B] max-w-md mx-auto">
                  Thank you for contacting DUST. Our customer care team will respond to <strong>{formData.email}</strong> within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0E382E] uppercase mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-xs outline-none focus:border-[#E67E22]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0E382E] uppercase mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-xs outline-none focus:border-[#E67E22]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0E382E] uppercase mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-xs outline-none focus:border-[#E67E22]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0E382E] uppercase mb-1.5">
                      Inquiry Type
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-xs outline-none focus:border-[#E67E22] font-semibold"
                    >
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Product Information">Product Information</option>
                      <option value="B2B / Corporate Orders">B2B / Corporate Orders</option>
                      <option value="Distributor / Dealership">Distributor / Dealership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E382E] uppercase mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us how we can help you..."
                    className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-xs outline-none focus:border-[#E67E22]"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center font-semibold">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-dust-orange py-4 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Embedded Map */}
          <div className="bg-white p-4 rounded-3xl border border-[#74B487]/40 shadow-xs overflow-hidden">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#0E382E] p-2">
              Our Location — Ravet, Pune
            </h3>
            <div className="w-full h-56 rounded-2xl overflow-hidden bg-stone-100 border border-[#74B487]/30">
              <iframe
                title="DUST Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.252684812836!2d73.7431213!3d18.6521509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9e6f3b0606d%3A0xb36b58abf32ad60e!2sRavet%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
