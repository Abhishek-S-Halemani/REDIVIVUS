import React, { useState } from 'react';
import { AppleIcon } from './AppleIcon';
import {
  ShoppingBag,
  X,
  User,
  Mail,
  Phone,
  Award,
  CheckCircle2,
  Sparkles,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { usePoints } from '../context/PointsContext';

interface MarketplaceAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  customMessage?: string;
}

export const MarketplaceAuthModal: React.FC<MarketplaceAuthModalProps> = ({
  isOpen,
  onClose,
  customMessage,
}) => {
  const { userProfile, isMarketplaceMember, joinMarketplace, logoutMarketplace, userPoints } =
    usePoints();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [joinedSuccess, setJoinedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!contactNumber.trim() || contactNumber.trim().length < 6) {
      setErrorMsg('Please enter a valid contact number.');
      return;
    }

    setErrorMsg('');
    joinMarketplace({
      name: name.trim(),
      email: email.trim(),
      contactNumber: contactNumber.trim(),
    });

    setJoinedSuccess(true);
    setTimeout(() => {
      setJoinedSuccess(false);
      onClose();
    }, 1800);
  };

  const handleLogout = () => {
    logoutMarketplace();
    setName('');
    setEmail('');
    setContactNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-lg bg-[#141518] text-white rounded-[32px] md:rounded-[36px] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col">
        {/* Apple specular gloss reflection */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[36px]" />

        {/* Modal Header */}
        <div className="relative z-10 px-5 sm:px-7 py-4.5 border-b border-white/10 flex items-center justify-between bg-zinc-900/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <AppleIcon gradient="emerald" size="sm" shadow={false}>
              <ShoppingBag className="w-5 h-5 text-white" />
            </AppleIcon>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {isMarketplaceMember ? 'Market Place Profile' : 'Join for Market Place'}
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {isMarketplaceMember
                  ? 'Your active Market Place account details & Eco Points Wallet'
                  : 'Register to buy, sell, negotiate & unlock Eco Points'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="relative z-10 p-5 sm:p-7 overflow-y-auto space-y-5">


          {joinedSuccess ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h4 className="text-xl font-extrabold text-white tracking-tight">
                Welcome to Market Place!
              </h4>
              <p className="text-xs text-zinc-300 max-w-xs leading-relaxed">
                Your account is active. You have unlocked your Eco Points Wallet with{' '}
                <strong className="text-emerald-400">{userPoints.toLocaleString()} PTS</strong>!
              </p>
            </div>
          ) : isMarketplaceMember ? (
            /* Logged-In Profile View */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    Member Details
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Trader</span>
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Name:</span>
                    </span>
                    <strong className="text-white text-sm font-semibold">{userProfile?.name}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Email:</span>
                    </span>
                    <strong className="text-zinc-200 font-mono">{userProfile?.email}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Contact Number:</span>
                    </span>
                    <strong className="text-zinc-200 font-mono">{userProfile?.contactNumber}</strong>
                  </div>
                </div>
              </div>

              {/* Unlocked Wallet Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-zinc-900 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                      Unlocked Eco Points Wallet
                    </span>
                    <span className="text-lg font-extrabold text-white tabular-nums">
                      {userPoints.toLocaleString()} <span className="text-xs font-bold text-emerald-400">PTS</span>
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded-lg border border-emerald-500/30">
                  Active Member
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Market Place</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Close Profile
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="space-y-4">

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* 1. Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-900/90 rounded-xl border border-white/10 text-white focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-all"
                />
              </div>

              {/* 2. Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jane@example.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-900/90 rounded-xl border border-white/10 text-white focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-all"
                />
              </div>

              {/* 3. Contact Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Contact Number</span>
                </label>
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-900/90 rounded-xl border border-white/10 text-white focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-all"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold text-xs tracking-tight shadow-lg shadow-emerald-950/40 transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Join for Market Place</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
