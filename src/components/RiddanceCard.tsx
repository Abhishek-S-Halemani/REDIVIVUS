import React, { useState, useRef, useEffect } from 'react';
import { AppleIcon } from './AppleIcon';
import {
  Recycle,
  Sparkles,
  Camera,
  Upload,
  Leaf,
  RefreshCw,
  Check,
  Award,
  Info,
  ChevronDown,
} from 'lucide-react';
import {
  analyzeWastePhoto,
  SAMPLE_WASTE_ITEMS,
} from '../services/wasteAnalysisService';
import { WasteAnalysisResult, TransformationOption } from '../types';
import { RiddanceCameraModal } from './RiddanceCameraModal';
import { usePoints } from '../context/PointsContext';

interface RiddanceCardProps {
  onOpen?: (tab?: 'ai-scan' | 'dispatch', autoCamera?: boolean, initialImage?: string | null, categoryHint?: string) => void;
}

const WASTE_CATEGORIES = [
  { id: 'e-waste', label: 'E-Waste & Cells', factor: 4.8, color: 'bg-rose-500', icon: '🔋' },
  { id: 'biomass', label: 'Compost Biomass', factor: 1.2, color: 'bg-emerald-500', icon: '🌱' },
  { id: 'polymers', label: 'Pure Polymers', factor: 2.1, color: 'bg-blue-500', icon: '🍾' },
  { id: 'metals', label: 'Metals & Alloys', factor: 5.4, color: 'bg-amber-600', icon: '⚙️' },
  { id: 'textiles', label: 'Post-Consumer Fiber', factor: 3.2, color: 'bg-indigo-500', icon: '👕' },
];

export const RiddanceCard: React.FC<RiddanceCardProps> = () => {
  const { earnPoints } = usePoints();
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedCat, setSelectedCat] = useState<string>('e-waste');
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<WasteAnalysisResult | null>(null);
  const [activeMetricTab, setActiveMetricTab] = useState<'reusable' | 'recyclable' | 'biodegradable'>('reusable');
  const [selectedOption, setSelectedOption] = useState<TransformationOption | null>(null);
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const [isStepsExpanded, setIsStepsExpanded] = useState<boolean>(true);

  // Only process images when user explicitly captures via camera or uploads via gallery

  const loadCategoryAnalysis = async (catId: string) => {
    setSelectedCat(catId);
    const matchingSample =
      SAMPLE_WASTE_ITEMS.find((s) => s.category === catId) ||
      SAMPLE_WASTE_ITEMS.find((s) => s.category.includes(catId)) ||
      SAMPLE_WASTE_ITEMS[0];
    await processCardImage(matchingSample.imageUrl, catId);
  };

  const processCardImage = async (imageUrl: string, categoryHint?: string) => {
    setIsAnalyzing(true);
    setIsClaimed(false);
    setSelectedOption(null);
    try {
      const result = await analyzeWastePhoto(imageUrl, categoryHint || selectedCat);
      setAnalysisResult(result);
      if (result && result.options && result.options.length > 0) {
        setSelectedOption(result.options[0]);
      }
    } catch (err) {
      console.error('Card analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      processCardImage(dataUrl, selectedCat);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCameraCapture = (capturedDataUrl: string) => {
    processCardImage(capturedDataUrl, selectedCat);
  };

  const handleClaimReward = () => {
    if (!analysisResult || !selectedOption || isClaimed) return;
    earnPoints(
      analysisResult.ecoPointsReward,
      `AI Upcycle Plan: ${selectedOption.title} from ${analysisResult.detectedItem}`
    );
    setIsClaimed(true);
  };

  return (
    <div className="group relative w-full h-auto flex flex-col gap-4 p-4 sm:p-5 bg-white/95 rounded-[28px] md:rounded-[32px] border border-black/[0.08] shadow-[0_16px_45px_rgba(0,0,0,0.06),_0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 overflow-hidden select-none">
      {/* Hidden Gallery Input */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleGalleryUpload}
        className="hidden"
      />

      {/* Live Camera Modal */}
      <RiddanceCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Apple specular gloss reflection */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/80 to-transparent pointer-events-none rounded-t-[32px]" />

      {/* Ambient ruby accent glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none group-hover:bg-rose-500/15 transition-all" />

      {/* Header */}
      <div className="relative z-10 flex flex-col shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <AppleIcon gradient="ruby" size="md" shadow={true}>
              <Recycle className="w-7 h-7 text-white drop-shadow-sm stroke-[2.2]" />
            </AppleIcon>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-950">
                  Riddance
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* AI Photo Scan Feature Banner (Camera & Gallery options) */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-500/10 via-orange-500/10 to-rose-500/5 border border-rose-200/90 transition-all">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="text-xs font-extrabold text-slate-950 tracking-tight">
              AI Waste Photo Scan
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="py-2 px-3 rounded-xl bg-white hover:bg-rose-50 border border-black/[0.08] hover:border-rose-300 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <Camera className="w-4 h-4 text-rose-600" />
              <span>Camera</span>
            </button>
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="py-2 px-3 rounded-xl bg-white hover:bg-emerald-50 border border-black/[0.08] hover:border-emerald-300 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Gallery</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prompt Placeholder when no photo captured/uploaded yet */}
      {!analysisResult && !isAnalyzing && (
        <div className="relative z-10 p-3 rounded-2xl bg-[#faf9f5] border border-dashed border-slate-300 text-center space-y-1">
          <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
            Take a photo with <strong className="text-slate-800">Camera</strong> or choose an image from <strong className="text-slate-800">Gallery</strong> above.
          </p>
        </div>
      )}

      {/* THREE BUTTONS & DETAILS (Shown ONLY after capturing or uploading an image) */}
      {analysisResult && !isAnalyzing && (
        <div className="relative z-10 pt-2 border-t border-black/[0.06] space-y-3">
          {/* Three Interactive Buttons: Reusable, Recyclable, Biodegradable */}

          {/* Three Interactive Buttons: Reusable, Recyclable, Biodegradable */}
          <div className="grid grid-cols-3 gap-2">
            {/* 1. Reusable Button */}
            <button
              onClick={() => setActiveMetricTab('reusable')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                activeMetricTab === 'reusable'
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-500/30 font-bold'
                  : 'bg-indigo-50/70 hover:bg-indigo-100/80 border-indigo-200 text-indigo-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-1 text-xs">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reusable</span>
              </div>
              <span className="text-sm font-black tabular-nums">
                {analysisResult.reusablePercent}%
              </span>
            </button>

            {/* 2. Recyclable Button */}
            <button
              onClick={() => setActiveMetricTab('recyclable')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                activeMetricTab === 'recyclable'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/30 font-bold'
                  : 'bg-emerald-50/70 hover:bg-emerald-100/80 border-emerald-200 text-emerald-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-1 text-xs">
                <Recycle className="w-3.5 h-3.5" />
                <span>Recyclable</span>
              </div>
              <span className="text-sm font-black tabular-nums">
                {analysisResult.recyclablePercent}%
              </span>
            </button>

            {/* 3. Biodegradable Button */}
            <button
              onClick={() => setActiveMetricTab('biodegradable')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                activeMetricTab === 'biodegradable'
                  ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30 font-bold'
                  : 'bg-amber-50/70 hover:bg-amber-100/80 border-amber-200 text-amber-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-1 text-xs">
                <Leaf className="w-3.5 h-3.5" />
                <span>Biodegradable</span>
              </div>
              <span className="text-sm font-black tabular-nums">
                {analysisResult.biodegradablePercent}%
              </span>
            </button>
          </div>

          {/* DETAIL PANEL DISPLAYING RIDDANCE CIRCULAR STUDIO DETAILS BASED ON SELECTED METRIC BUTTON */}
          <div className="p-3.5 rounded-2xl bg-[#faf9f5] border border-black/[0.08] space-y-3 animate-in fade-in duration-200">
            {/* TAB 1: REUSABLE DETAILS & UPCYCLE BLUEPRINTS */}
            {activeMetricTab === 'reusable' && (
              <div className="space-y-3 text-xs">
                {/* Recognized Object Information Banner */}
                <div className="p-3 rounded-xl bg-white border border-indigo-200/80 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between flex-wrap gap-1.5 pb-2 border-b border-black/[0.06]">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">
                        🔍 AI Recognized Object
                      </span>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-950">
                        {analysisResult.detectedItem}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                        {analysisResult.materialCategory}
                      </span>
                      {analysisResult.confidenceScore && (
                        <span className="text-[10px] font-bold text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200">
                          {analysisResult.confidenceScore}% Match
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {analysisResult.analysisSummary}
                  </p>
                </div>

                {/* Craft Project Selection Header */}
                <div className="pt-1">
                  <div className="text-[11px] font-extrabold text-slate-900 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>How to Use & Make a Craft Out of {analysisResult.detectedItem}:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {analysisResult.options.map((opt) => {
                      const isSelected = selectedOption?.id === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSelectedOption(opt);
                            setIsStepsExpanded(true);
                          }}
                          className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-center ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-500/20 font-bold'
                              : 'bg-white hover:bg-indigo-50/60 border-black/[0.08] text-slate-800'
                          }`}
                        >
                          <div className="text-xs font-extrabold line-clamp-1">
                            {opt.title}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Reusability Technique Details */}
                {selectedOption && (
                  <div className="p-3 rounded-xl bg-white border border-indigo-200/80 space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        Technique: {selectedOption.title}
                      </h5>
                      <span className="text-[10px] font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                        {selectedOption.difficulty} • ⏱️ {selectedOption.timeRequired}
                      </span>
                    </div>

                    {/* Source Photo vs Reusable Craft Outcome */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-500 block">Uploaded Photo Object:</span>
                        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-black/10">
                          <img
                            src={analysisResult.uploadedImageUrl}
                            alt="Analyzed Object"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-emerald-700 block">Usable Craft Outcome:</span>
                        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-emerald-300">
                          <img
                            src={selectedOption.resultImageUrl}
                            alt={selectedOption.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">
                      {selectedOption.description}
                    </p>

                    {/* Required Materials & Tools */}
                    <div className="text-[10px] font-medium text-slate-700 bg-slate-50 p-2 rounded-lg border border-black/[0.04]">
                      <strong className="text-slate-900 font-bold">Materials & Tools Required: </strong>
                      {selectedOption.materialsUsed}
                    </div>

                    {/* Step-by-Step Techniques Guide */}
                    <div className="space-y-2 pt-1 border-t border-black/[0.05]">
                      <div className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                        <span>Techniques to Make it Usable Again ({selectedOption.steps.length} Steps):</span>
                      </div>

                      <div className="space-y-2 animate-in fade-in duration-200">
                        {selectedOption.steps.map((st) => (
                          <div
                            key={st.stepNumber}
                            className="p-2.5 rounded-xl bg-slate-50 border border-black/[0.04] text-[10px] leading-relaxed flex gap-2.5 shadow-2xs"
                          >
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                              {st.stepNumber}
                            </span>
                            <div className="space-y-0.5">
                              <div className="font-bold text-slate-900 text-[11px]">{st.title}</div>
                              <p className="text-slate-600 text-[10px] leading-relaxed">
                                {st.instruction}
                              </p>
                              {st.tip && (
                                <div className="text-[9px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 font-medium inline-block mt-0.5">
                                  Pro Tip: {st.tip}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reward Claim Button */}
                    <button
                      type="button"
                      onClick={handleClaimReward}
                      disabled={isClaimed}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isClaimed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-950 hover:bg-emerald-700 text-white shadow-sm'
                      }`}
                    >
                      {isClaimed ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Blueprint Saved! +{analysisResult.ecoPointsReward} Eco Points Credited!</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Save Blueprint & Claim +{analysisResult.ecoPointsReward} Eco Points</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: RECYCLABLE DETAILS */}
            {activeMetricTab === 'recyclable' && (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
                  <h4 className="text-sm font-extrabold text-slate-950">
                    {analysisResult.materialCategory}
                  </h4>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Thermal Reprocessing Efficiency</span>
                    <span className="font-mono font-extrabold text-emerald-700">
                      {analysisResult.recyclablePercent}% Standard Efficiency
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {analysisResult.analysisSummary}
                  </p>
                  <div className="p-2 rounded-lg bg-emerald-50 text-[10px] text-emerald-900 font-medium flex items-center gap-1.5 border border-emerald-200/60">
                    <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      Diverting this material saves approximately {analysisResult.co2PotentialKg} kg of atmospheric carbon emissions.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BIODEGRADABLE DETAILS */}
            {activeMetricTab === 'biodegradable' && (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
                  <h4 className="text-sm font-extrabold text-slate-950">
                    Composting & Biomass
                  </h4>
                </div>

                <div className="p-3 rounded-xl bg-white border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Organic Breakdown Capacity</span>
                    <span className="font-mono font-extrabold text-amber-700">
                      {analysisResult.biodegradablePercent}% Natural Pulp
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Organic natural decomposition process. Suitable for home or industrial biomass composting when separated from non-organic synthetic fasteners.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analyzing state indicator */}
      {isAnalyzing && (
        <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 text-center space-y-2">
          <div className="w-5 h-5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <span className="text-xs font-bold text-slate-900 block">
            Analyzing Waste Composition...
          </span>
        </div>
      )}
    </div>
  );
};
