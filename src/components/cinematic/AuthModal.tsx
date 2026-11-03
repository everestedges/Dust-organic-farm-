import React, { useState } from "react";
import { X, Lock, Mail, Phone, User, ArrowRight, ShieldCheck, CheckCircle2, KeyRound } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { companyInfo } from "@/lib/data";

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authView,
    closeAuthModal,
    setAuthView,
    login,
    signup,
  } = useAuthStore();

  // Form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please fill in both email and password.");
      return;
    }
    setErrorMsg("");
    const success = await login(email, password);
    if (!success) {
      setErrorMsg(useAuthStore.getState().authError || "Login failed. Check your email or password.");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }
    setErrorMsg("");
    const success = await signup(name, email, phone, password);
    if (!success) {
      setErrorMsg(useAuthStore.getState().authError || "Registration failed. Try again.");
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }
    setErrorMsg("");
    setForgotSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in print:hidden">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#74B487]/50 shadow-2xl overflow-hidden p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-[#0E382E] transition-colors rounded-full hover:bg-[#E8F1E9]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#0E382E] text-[#E67E22] rounded-full flex items-center justify-center mx-auto shadow-md border border-[#74B487]/40">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#0E382E]">
            {authView === "login" && "Welcome Back to DUST"}
            {authView === "signup" && "Create Your DUST Account"}
            {authView === "forgot" && "Reset Password"}
          </h2>
          <p className="text-xs text-[#1F684B] font-medium">
            {authView === "login" && "Access your orders, saved addresses, and express checkout."}
            {authView === "signup" && "Join Everest Edges Pvt. Ltd. member network & get 10% OFF."}
            {authView === "forgot" && "We'll send password reset instructions to your inbox."}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center font-semibold">
            {errorMsg}
          </div>
        )}

        {/* View 1: LOGIN */}
        {authView === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-[#0E382E] uppercase mb-1">
                Email Address or Phone *
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

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-extrabold text-[#0E382E] uppercase">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => setAuthView("forgot")}
                  className="text-[11px] font-bold text-[#E67E22] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
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
              className="w-full btn-dust-orange py-3.5 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 shadow-md"
            >
              Log In to Account <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-xs text-[#1F684B]">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthView("signup")}
                className="font-extrabold text-[#E67E22] hover:underline"
              >
                Sign Up Now
              </button>
            </div>
          </form>
        )}

        {/* View 2: SIGNUP */}
        {authView === "signup" && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
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

            <div>
              <label className="block text-xs font-extrabold text-[#0E382E] uppercase mb-1">
                Mobile Number (for SMS/WhatsApp tracking) *
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
                  placeholder="Minimum 6 characters"
                  className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl pl-10 pr-3 py-3 text-xs outline-none focus:border-[#E67E22] text-[#0E382E]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-dust-orange py-3.5 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 shadow-md"
            >
              Create Account & Log In <CheckCircle2 className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-xs text-[#1F684B]">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthView("login")}
                className="font-extrabold text-[#E67E22] hover:underline"
              >
                Log In
              </button>
            </div>
          </form>
        )}

        {/* View 3: FORGOT PASSWORD */}
        {authView === "forgot" && (
          <div className="space-y-4">
            {forgotSuccess ? (
              <div className="p-6 bg-[#E8F1E9] rounded-2xl border border-[#74B487] text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#E67E22] mx-auto" />
                <h4 className="text-base font-extrabold text-[#0E382E]">Reset Link Sent!</h4>
                <p className="text-xs text-[#1F684B]">
                  We sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
                </p>
                <button
                  onClick={() => setAuthView("login")}
                  className="btn-dust-orange px-4 py-2 text-white font-bold text-xs uppercase tracking-wider rounded-xl"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#0E382E] uppercase mb-1">
                    Your Registered Email *
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

                <button
                  type="submit"
                  className="w-full btn-dust-orange py-3.5 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 shadow-md"
                >
                  Send Reset Link <KeyRound className="w-4 h-4" />
                </button>

                <div className="pt-2 text-center text-xs text-[#1F684B]">
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthView("login")}
                    className="font-extrabold text-[#E67E22] hover:underline"
                  >
                    Back to Log In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
