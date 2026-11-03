import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, User, Phone, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { companyInfo } from "@/lib/data";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useAuthStore();
  const [isSignup, setIsSignup] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    navigate("/account");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      if (!name || !email || !phone || !password) {
        setError("Please fill out all fields.");
        return;
      }
      signup(name, email, phone, password);
      navigate("/account");
    } else {
      if (!email || !password) {
        setError("Please enter your email and password.");
        return;
      }
      login(email, password);
      navigate("/account");
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 md:px-12 lg:px-16 w-full min-h-screen bg-[#F6F5F0] text-[#0E382E] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 sm:p-12 rounded-3xl border border-[#74B487]/40 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#0E382E] text-[#E67E22] rounded-full flex items-center justify-center mx-auto shadow-md border border-[#74B487]/40">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#0E382E]">
            {isSignup ? "Sign Up for DUST" : "Log In to DUST"}
          </h1>
          <p className="text-xs text-[#1F684B] font-medium">
            {isSignup
              ? "Join Everest Edges Pvt. Ltd. member network & unlock order history."
              : "Access your saved addresses, track shipments, and view past invoices."}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-xs font-extrabold text-[#0E382E] uppercase mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl pl-10 pr-3 py-3 text-xs outline-none focus:border-[#E67E22] text-[#0E382E]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold text-[#0E382E] uppercase mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl pl-10 pr-3 py-3 text-xs outline-none focus:border-[#E67E22] text-[#0E382E]"
              />
            </div>
          </div>

          {isSignup && (
            <div>
              <label className="block text-xs font-extrabold text-[#0E382E] uppercase mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl pl-10 pr-3 py-3 text-xs outline-none focus:border-[#E67E22] text-[#0E382E]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold text-[#0E382E] uppercase mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl pl-10 pr-3 py-3 text-xs outline-none focus:border-[#E67E22] text-[#0E382E]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-dust-orange py-4 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {isSignup ? "Create Account & Log In" : "Log In to Account"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#1F684B]">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => { setIsSignup(false); setError(""); }}
                className="font-extrabold text-[#E67E22] hover:underline"
              >
                Log In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => { setIsSignup(true); setError(""); }}
                className="font-extrabold text-[#E67E22] hover:underline"
              >
                Sign Up Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
