import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { ShieldCheck, Lock, Mail, Building2, ArrowRight, KeyRound } from "lucide-react";
import { useAdminAuthStore } from "@/lib/admin-auth-store";
import { companyInfo } from "@/lib/data";

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { adminLogin, isAdminLoggedIn, adminError } = useAdminAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  if (isAdminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError("Please enter both Admin email and password.");
      return;
    }
    setLocalError("");
    const success = await adminLogin(email, password);
    if (success) {
      navigate("/admin");
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 md:px-12 lg:px-16 w-full min-h-screen bg-[#0E382E] text-white flex items-center justify-center relative overflow-hidden">
      {/* Background Accent Lines */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#74B487]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E67E22]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#1F684B]/90 p-8 sm:p-12 rounded-3xl border border-[#74B487]/40 shadow-2xl backdrop-blur-md space-y-8 relative z-10">
        {/* Header Badge */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-[#0E382E] text-[#E67E22] rounded-2xl flex items-center justify-center mx-auto shadow-xl border border-[#74B487]/50">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#E67E22] bg-[#0E382E] px-3.5 py-1 rounded-full border border-[#74B487]/30 inline-block">
            RESTRICTED ACCESS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            DUST Central Admin
          </h1>
          <p className="text-xs text-[#E8F1E9] font-medium">
            Authorized management portal for <strong>{companyInfo.name}</strong>
          </p>
        </div>

        {(localError || adminError) && (
          <div className="p-3.5 bg-red-900/60 border border-red-500/50 text-red-100 text-xs rounded-xl text-center font-semibold">
            {localError || adminError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-extrabold text-[#74B487] uppercase tracking-wider mb-1.5">
              Admin Corporate Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full bg-[#0E382E]/90 border border-[#74B487]/50 rounded-xl pl-10 pr-4 py-3.5 text-xs text-white placeholder-stone-400 outline-none focus:border-[#E67E22] font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#74B487] uppercase tracking-wider mb-1.5">
              Admin Master Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0E382E]/90 border border-[#74B487]/50 rounded-xl pl-10 pr-4 py-3.5 text-xs text-white placeholder-stone-400 outline-none focus:border-[#E67E22] font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-dust-orange py-4 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02]"
          >
            Authenticate Admin Portal <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
