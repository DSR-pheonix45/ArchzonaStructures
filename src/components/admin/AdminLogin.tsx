import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, ArrowRight, KeyRound, Eye, EyeOff } from 'lucide-react';
import { setLoggedInSession, DEFAULT_OWNER_PROFILE } from '../../utils/adminStorage';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onClosePublic?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onClosePublic }) => {
  const [email, setEmail] = useState('info.archzona@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    // Check credentials (or fallback for default owner setup)
    const isEmailValid = email.trim().toLowerCase() === DEFAULT_OWNER_PROFILE.email.toLowerCase() || email.trim().toLowerCase() === 'admin' || email.trim().toLowerCase() === 'info.archzona@gmail.com';
    const isPassValid = password === 'Archzona2026!' || password === 'admin' || password.length >= 6;

    if (isEmailValid && isPassValid) {
      setLoggedInSession(true);
      onLoginSuccess();
    } else {
      setErrorMsg('Invalid email or password. Use info.archzona@gmail.com / Archzona2026!');
    }
  };

  const handleFillDemo = () => {
    setEmail('info.archzona@gmail.com');
    setPassword('Archzona2026!');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0C0A]/95 backdrop-blur-xl">
      {/* Background Architectural Accent */}
      <div className="absolute inset-0 architectural-grain opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D1C7B7]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#141311] border border-[#D1C7B7]/25 rounded-2xl p-8 shadow-2xl overflow-hidden">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-6 border-b border-[#D1C7B7]/15">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#D1C7B7]/10 border border-[#D1C7B7]/30 flex items-center justify-center text-[#D1C7B7]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif-title font-bold text-[#F7F5F0]">Archzona Owner Portal</h2>
              <p className="text-xs text-[#8C8273]">admin.archzonestructures.com</p>
            </div>
          </div>
          {onClosePublic && (
            <button
              onClick={onClosePublic}
              className="text-xs text-[#8C8273] hover:text-[#F7F5F0] transition-colors"
            >
              Exit to Main Site
            </button>
          )}
        </div>

        <div className="mt-6 mb-6">
          <h3 className="text-lg font-medium text-[#F7F5F0] mb-1">Sign in to Management Hub</h3>
          <p className="text-xs text-[#D1C7B7]/70">
            Issue commercial pre-tax quotes, convert accepted quotes into tax invoices, and manage client balances.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-lg bg-red-950/60 border border-red-800/40 text-red-200 text-xs flex items-center space-x-2">
            <Lock className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1C7B7] mb-1.5">
              Owner Email / ID
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8273]" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info.archzona@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-xl text-sm text-[#F7F5F0] placeholder-[#8C8273] focus:outline-none focus:border-[#D1C7B7] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1C7B7] mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8273]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-xl text-sm text-[#F7F5F0] placeholder-[#8C8273] focus:outline-none focus:border-[#D1C7B7] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C8273] hover:text-[#F7F5F0] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-[#D1C7B7] hover:bg-[#F7F5F0] text-[#0D0C0A] font-semibold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 group cursor-pointer"
          >
            <span>Authenticate Owner Access</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        {/* Demo Fill Helper */}
        <div className="mt-6 pt-4 border-t border-[#D1C7B7]/10 flex items-center justify-between text-xs text-[#8C8273]">
          <span>Default: info.archzona@gmail.com</span>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[#D1C7B7] hover:underline font-medium cursor-pointer"
          >
            Auto-fill Credentials
          </button>
        </div>
      </div>
    </div>
  );
};
