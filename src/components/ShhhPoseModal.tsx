import React, { useState } from 'react';
import { AppleIcon } from './AppleIcon';
import {
  Lock,
  X,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Baby,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Info,
  Check
} from 'lucide-react';
import { SHHH_CATEGORIES, DisposalCategory, DisposalItem } from '../data/shhhPoseData';

interface ShhhPoseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShhhPoseModal: React.FC<ShhhPoseModalProps> = ({ isOpen, onClose }) => {
  // Active Category state (defaults to Women's Hygiene)
  const [selectedCategoryId, setSelectedCategoryId] = useState<'womens-hygiene' | 'mens-hygiene' | 'baby-care'>('womens-hygiene');
  
  // Active Item state (defaults to first item of selected category)
  const [selectedItemId, setSelectedItemId] = useState<string>('sanitary-pads');
  
  // Feedback copy state
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeCategory: DisposalCategory =
    SHHH_CATEGORIES.find((cat) => cat.id === selectedCategoryId) || SHHH_CATEGORIES[0];

  const activeItem: DisposalItem =
    activeCategory.items.find((item) => item.id === selectedItemId) || activeCategory.items[0];

  const handleSelectCategory = (categoryId: 'womens-hygiene' | 'mens-hygiene' | 'baby-care') => {
    setSelectedCategoryId(categoryId);
    const targetCategory = SHHH_CATEGORIES.find((cat) => cat.id === categoryId);
    if (targetCategory && targetCategory.items.length > 0) {
      setSelectedItemId(targetCategory.items[0].id);
    }
  };

  const handleCopyGuide = () => {
    const textToCopy = `Recommended Disposal Steps for ${activeItem.name}:\n` +
      activeItem.recommendedSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n') +
      '\n\nRelevant Safety Tips:\n' +
      activeItem.safetyTips.map((tip) => `• ${tip}`).join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-5xl bg-[#141518] text-white rounded-[32px] md:rounded-[36px] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Apple specular gloss reflection */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[36px]" />

        {/* Header */}
        <div className="relative z-10 px-5 sm:px-7 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <AppleIcon gradient="graphite" size="sm" shadow={false}>
              <Lock className="w-5 h-5 text-white" />
            </AppleIcon>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-xl font-extrabold text-white tracking-tight">
                  ShhhPose Intimate & Hygiene Disposal
                </h3>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyGuide}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-medium border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Info className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden sm:inline">Copy Guide</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 transition-colors cursor-pointer"
              title="Close ShhhPose screen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 p-5 sm:p-7 overflow-y-auto space-y-6">
          
          {/* 1. Category Selection: Desktop arranged horizontally in equal 1:1:1 proportions, Mobile stacked vertically */}
          <div>
            <div className="flex items-center justify-end mb-3">
              <span className="text-xs text-zinc-400">
                Selected: <strong className="text-white font-semibold">{activeCategory.name}</strong>
              </span>
            </div>

            {/* Equal 1:1:1 on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 w-full">
              {SHHH_CATEGORIES.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    type="button"
                    className={`relative p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group ${
                      isSelected
                        ? 'bg-zinc-800/95 border-rose-500/80 shadow-[0_10px_25px_rgba(244,63,94,0.18)] ring-1 ring-rose-500/40 text-white'
                        : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-zinc-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400" />
                    )}

                    <div className="flex items-center justify-between w-full mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-rose-500 text-white shadow-md'
                              : 'bg-white/10 text-zinc-400 group-hover:text-white'
                          }`}
                        >
                          {cat.id === 'womens-hygiene' && <Heart className="w-4 h-4 stroke-[2.2]" />}
                          {cat.id === 'mens-hygiene' && <ShieldCheck className="w-4 h-4 stroke-[2.2]" />}
                          {cat.id === 'baby-care' && <Baby className="w-4 h-4 stroke-[2.2]" />}
                        </div>
                        <div>
                          <div className="text-base font-bold text-white tracking-tight">
                            {cat.name}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            {cat.itemCount} Items
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                          isSelected
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-white/5 text-zinc-400 border-white/10'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Directly below category selection: Show Items for selected category & Recommended Disposal Steps */}
          <div className="p-4 sm:p-6 rounded-2xl md:rounded-[26px] bg-[#1a1b20] border border-white/10 shadow-inner space-y-6">
            
            {/* Item Selector Chips */}
            <div>
              <div className="flex flex-wrap items-center justify-end gap-2 mb-3">
                <span className="text-[11px] text-zinc-400">
                  Select an item to view specific disposal steps
                </span>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {activeCategory.items.map((item) => {
                  const isSelected = selectedItemId === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      type="button"
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-tight transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
                        isSelected
                          ? 'bg-white text-zinc-950 border-white shadow-md scale-[1.02]'
                          : 'bg-zinc-900/90 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-rose-500' : 'bg-zinc-500'}`} />
                      <span>{item.name}</span>
                      {isSelected && <ChevronRight className="w-3.5 h-3.5 ml-0.5 text-zinc-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Recommended Disposal Steps & Relevant Safety Tips */}
            <div className="pt-4 border-t border-white/10 space-y-5">
              
              {/* Item Title Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <h4 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                    <span className="text-rose-400">{activeItem.name}</span>
                  </h4>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs text-zinc-300 bg-zinc-900 px-3 py-1 rounded-xl border border-white/10 font-mono">
                    {activeItem.recommendedSteps.length} Step Protocol
                  </span>
                </div>
              </div>

              {/* Instructions + Safety Tips Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-start">
                
                {/* Recommended Steps (Numbered Instructions) */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                    <span>Recommended Disposal Steps</span>
                  </h5>

                  <div className="space-y-2.5">
                    {activeItem.recommendedSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950/70 border border-white/10 hover:border-white/20 transition-all text-xs sm:text-sm text-zinc-200 leading-relaxed"
                      >
                        <div className="w-6 h-6 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <span>{step}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Relevant Safety Tips */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-4">
                  <div className="p-4 sm:p-4.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-200/90 shadow-md">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-amber-500/20 text-amber-400 mb-3">
                      <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
                      <h5 className="text-xs font-bold uppercase tracking-wider font-mono">
                        Relevant Safety Tips
                      </h5>
                    </div>

                    <ul className="space-y-2.5 text-xs leading-relaxed text-amber-100/90">
                      {activeItem.safetyTips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Eco Impact Callout */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200/90 text-xs flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-emerald-300 text-xs">Eco & Sewer Safety</div>
                      <p className="text-[11px] text-emerald-200/80 mt-0.5 leading-normal">
                        {activeItem.ecoHighlight}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="relative z-10 px-5 sm:px-7 py-3.5 border-t border-white/10 flex items-center justify-end bg-zinc-900/80 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs transition-all cursor-pointer shadow-md"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
