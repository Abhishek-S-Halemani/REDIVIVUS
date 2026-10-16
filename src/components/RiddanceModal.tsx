import React, { useState, useEffect } from 'react';
import { AppleIcon } from './AppleIcon';
import { Recycle, X, Check, Truck, MapPin, Calendar, Scale, Sparkles, AlertCircle, Award, Camera } from 'lucide-react';
import { usePoints } from '../context/PointsContext';
import { RiddanceAIStudio } from './RiddanceAIStudio';

interface RiddanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'ai-scan' | 'dispatch';
  autoOpenCamera?: boolean;
  initialImage?: string | null;
  categoryHint?: string;
}

const CATEGORIES = [
  { id: 'e-waste', name: 'Electronic & Batteries', factor: 4.8, icon: '🔋', desc: 'Laptops, Li-ion cells, motherboards, cords' },
  { id: 'organics', name: 'Biomass & Organic', factor: 1.2, icon: '🌱', desc: 'Food scraps, yard trimmings, natural pulp' },
  { id: 'plastics', name: 'High-Density Polymers', factor: 2.1, icon: '🍾', desc: 'HDPE, PET, acrylic, clean plastics' },
  { id: 'metals', name: 'Alloys & Scrap Metal', factor: 5.4, icon: '⚙️', desc: 'Copper, brass, aluminum, stainless steel' },
  { id: 'textiles', name: 'Post-Consumer Fabrics', factor: 3.2, icon: '👕', desc: 'Denim, wool, cotton cuttings, leather' },
  { id: 'bulky', name: 'Bulky Restoration Pieces', factor: 3.9, icon: '🪑', desc: 'Wooden furniture, broken appliances, frames' },
];

export const RiddanceModal: React.FC<RiddanceModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'ai-scan',
  autoOpenCamera = false,
  initialImage = null,
  categoryHint = 'e-waste',
}) => {
  const { earnPoints } = usePoints();
  const [activeTab, setActiveTab] = useState<'ai-scan' | 'dispatch'>(initialTab);
  const [selectedCat, setSelectedCat] = useState<string>('e-waste');
  const [weightKg, setWeightKg] = useState<number>(12);
  const [pickupType, setPickupType] = useState<'van' | 'locker'>('van');
  const [address, setAddress] = useState<string>('742 Evergreen Terrace, Sector 4');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [pointsEarned, setPointsEarned] = useState<number>(0);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const currentCategory = CATEGORIES.find((c) => c.id === selectedCat) || CATEGORIES[0];
  const calculatedCo2Offset = (weightKg * currentCategory.factor).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const earned = Math.round(weightKg * 15);
    setPointsEarned(earned);
    earnPoints(earned, `Riddance Dispatch: ${weightKg}kg ${currentCategory.name}`);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#faf9f5] rounded-[32px] border border-black/10 shadow-[0_30px_70px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col">
        {/* Apple specular gloss reflection */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/80 to-transparent pointer-events-none rounded-t-[32px]" />

        {/* Modal Header */}
        <div className="relative z-10 px-5 sm:px-6 py-4 border-b border-black/[0.06] flex items-center justify-between bg-white/70 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <AppleIcon gradient="ruby" size="sm" shadow={false}>
              <Recycle className="w-5 h-5 text-white" />
            </AppleIcon>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Riddance Circular Studio</h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  AI Upcycle
                </span>
              </div>
              <p className="text-xs text-slate-500">Zero-landfill photo recyclability analysis & circular dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer shrink-0"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 p-5 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'ai-scan' ? (
            <RiddanceAIStudio
              autoStartCamera={autoOpenCamera}
              initialImage={initialImage}
              categoryHint={categoryHint}
            />
          ) : isSubmitted ? (
            <div className="py-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Riddance Dispatch Scheduled!</h4>
              <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
                Your circular courier has been assigned ticket <strong className="text-slate-800 font-mono">#RDV-8821</strong>.
                An all-electric van will arrive to collect your {weightKg}kg of {currentCategory.name}.
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-white border border-black/[0.06] shadow-sm max-w-sm w-full text-left">
                <div className="flex justify-between text-xs py-1">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-800">{currentCategory.name}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-slate-500">Net Weight:</span>
                  <span className="font-semibold text-slate-800">{weightKg} kg</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-slate-500">Estimated CO₂ Offset:</span>
                  <span className="font-bold text-emerald-600">+{calculatedCo2Offset} kg CO₂</span>
                </div>
                <div className="flex justify-between text-xs py-1 bg-emerald-50 px-2 rounded-lg border border-emerald-200/60 my-1">
                  <span className="text-emerald-800 font-semibold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Eco Points Credited:</span>
                  </span>
                  <span className="font-extrabold text-emerald-950 tabular-nums">+{pointsEarned} PTS</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-t border-slate-100 mt-1 pt-1">
                  <span className="text-slate-500">Pickup Mode:</span>
                  <span className="font-semibold text-slate-800">
                    {pickupType === 'van' ? 'Electric Courier Dispatch' : 'Drop-Locker Reservation'}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Schedule Another Discard
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  1. Select Discard Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCat(cat.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedCat === cat.id
                          ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-500/10'
                          : 'bg-white/60 border-black/[0.06] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{cat.icon}</span>
                        {selectedCat === cat.id && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">{cat.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{cat.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Slider */}
              <div className="p-4 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-bold text-slate-800">Estimated Item Weight</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900 tabular-nums">{weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="80"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 kg (envelope)</span>
                  <span>40 kg</span>
                  <span>80 kg (crate/appliance)</span>
                </div>
              </div>

              {/* Carbon Impact Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold text-emerald-950">Immediate Planetary Benefit</div>
                    <div className="text-[11px] text-emerald-700">Diverts 100% toxic leachates from landfill beds</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-emerald-700 tabular-nums">+{calculatedCo2Offset} kg</div>
                  <div className="text-[10px] text-emerald-600 uppercase font-semibold">CO₂ Offset</div>
                </div>
              </div>

              {/* Mode: Van vs Locker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  2. Collection Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPickupType('van')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      pickupType === 'van'
                        ? 'bg-white border-slate-900 shadow-sm'
                        : 'bg-white/60 border-black/[0.06] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="w-4 h-4 text-slate-800" />
                      <span className="text-xs font-bold text-slate-900">Courier Doorstep Pickup</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Electric van dispatches to your doorstep within 4 hours</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPickupType('locker')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      pickupType === 'locker'
                        ? 'bg-white border-slate-900 shadow-sm'
                        : 'bg-white/60 border-black/[0.06] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-slate-800" />
                      <span className="text-xs font-bold text-slate-900">Solar Drop Locker</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Generate QR code to unlock nearest 24/7 solar kiosk</p>
                  </button>
                </div>
              </div>

              {/* Location Input */}
              {pickupType === 'van' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-black/10 focus:border-rose-500 focus:outline-none transition-all shadow-sm"
                  />
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-xs tracking-tight shadow-lg shadow-rose-950/20 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4 text-amber-200" />
                  <span>Confirm Riddance Pickup Order (Earn +{Math.round(weightKg * 15)} Eco Points)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
