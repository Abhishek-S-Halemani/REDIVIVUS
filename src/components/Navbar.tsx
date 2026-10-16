import React, { useState } from 'react';
import { Sparkles, Award, ShoppingBag, User, CheckCircle2 } from 'lucide-react';
import { usePoints } from '../context/PointsContext';

interface NavbarProps {
  onReplayParticles: () => void;
  onOpenRiddance: () => void;
  onOpenMarketplace: () => void;
  onOpenShhhPose: () => void;
  activeTab?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onReplayParticles,
  onOpenRiddance,
  onOpenMarketplace,
  onOpenShhhPose,
}) => {
  const { userPoints, isMarketplaceMember, userProfile, openAuthModal } = usePoints();
  const [showWalletTooltip, setShowWalletTooltip] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-5 md:px-6 py-3.5 bg-[#f7f6f2]/85 backdrop-blur-xl border-b border-black/[0.06] transition-all">
      <div className="w-full flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-b from-[#ff3b53] to-[#c91838] flex items-center justify-center text-white shadow-md shadow-rose-900/20 ring-1 ring-white/40">
            <Sparkles className="w-4 h-4" />
          </div>
          <button
            onClick={onReplayParticles}
            className="text-lg font-bold tracking-tight text-slate-900 hover:text-rose-600 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
          >
            <span>REDIVIVUS</span>
          </button>
        </div>

        {/* Zone 3: Points Wallet / Join for Market Place + Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isMarketplaceMember ? (
            /* Eco Points Wallet for Logged-In Members */
            <div
              onClick={onOpenMarketplace}
              onMouseEnter={() => setShowWalletTooltip(true)}
              onMouseLeave={() => setShowWalletTooltip(false)}
              className="relative flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/80 text-emerald-900 shadow-xs cursor-pointer transition-all active:scale-95 group"
              title="Your Eco Points Wallet"
            >
              <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-[9px] uppercase font-bold text-emerald-700 tracking-wider leading-none">
                  Eco Points
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-emerald-950 tabular-nums leading-tight">
                  {userPoints.toLocaleString()} <span className="text-[10px] font-semibold text-emerald-700">PTS</span>
                </div>
              </div>

              {/* Quick tooltip */}
              {showWalletTooltip && (
                <div className="absolute right-0 top-full mt-2 w-56 p-2.5 rounded-xl bg-slate-950 text-white text-[11px] leading-snug shadow-xl z-50 pointer-events-none animate-in fade-in duration-150">
                  <div className="font-bold text-emerald-400 mb-0.5">100% Points Economy</div>
                  Earn points by scheduling clearance in Riddance, then spend them on certified recycled products!
                </div>
              )}
            </div>
          ) : (
            /* Join for Market Place Button */
            <button
              onClick={() => openAuthModal('Enter your Name, Email, and Contact Number to unlock your Eco Points & start buying/selling!')}
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-500 rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
              title="Join for Market Place to get Eco Points"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-200" />
              <span>Join Market Place</span>
            </button>
          )}

          {/* User Profile Button replacing particle canvas button */}
          <button
            onClick={() => openAuthModal()}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-extrabold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-xs transition-all active:scale-95 whitespace-nowrap flex items-center gap-2 cursor-pointer"
            title="User Profile"
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span>
              {isMarketplaceMember && userProfile?.name
                ? userProfile.name.split(' ')[0]
                : 'Profile'}
            </span>
            {isMarketplaceMember && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
          </button>
        </div>
      </div>
    </header>
  );
};
