import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  Recycle,
  Leaf,
  RefreshCw,
  Layers,
  Clock,
  Wrench,
  Check,
  ArrowRight,
  ChevronRight,
  RotateCcw,
  Award,
  Zap,
  Info,
} from 'lucide-react';
import { WasteAnalysisResult, TransformationOption } from '../types';
import {
  analyzeWastePhoto,
  SAMPLE_WASTE_ITEMS,
  SampleWasteItem,
} from '../services/wasteAnalysisService';
import { RiddanceCameraModal } from './RiddanceCameraModal';
import { usePoints } from '../context/PointsContext';

interface RiddanceAIStudioProps {
  autoStartCamera?: boolean;
  initialImage?: string | null;
  categoryHint?: string;
}

export const RiddanceAIStudio: React.FC<RiddanceAIStudioProps> = ({
  autoStartCamera = false,
  initialImage = null,
  categoryHint = 'e-waste',
}) => {
  const { earnPoints } = usePoints();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(autoStartCamera);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string | null>(initialImage);
  const [analysisResult, setAnalysisResult] = useState<WasteAnalysisResult | null>(null);
  const [selectedOption, setSelectedOption] = useState<TransformationOption | null>(null);
  const [isClaimed, setIsClaimed] = useState<boolean>(false);

  React.useEffect(() => {
    if (autoStartCamera) {
      setIsCameraOpen(true);
    }
  }, [autoStartCamera]);

  React.useEffect(() => {
    if (initialImage) {
      processNewImage(initialImage, categoryHint);
    } else if (!currentImage && !isAnalyzing && !analysisResult) {
      const matchingSample =
        SAMPLE_WASTE_ITEMS.find((s) => s.category === categoryHint) ||
        SAMPLE_WASTE_ITEMS.find((s) => s.category.includes(categoryHint)) ||
        SAMPLE_WASTE_ITEMS[0];
      processNewImage(matchingSample.imageUrl, matchingSample.category);
    }
  }, [initialImage, categoryHint]);

  // Handle image upload from device gallery
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      processNewImage(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset so the same file can be re-selected if needed
  };

  // Handle camera capture
  const handleCameraCapture = (capturedDataUrl: string) => {
    processNewImage(capturedDataUrl);
  };

  // Handle sample selection for instant testing
  const handleSelectSample = (sample: SampleWasteItem) => {
    processNewImage(sample.imageUrl, sample.category);
  };

  // Core processing pipeline
  const processNewImage = async (imageUrl: string, hintCategory?: string) => {
    setCurrentImage(imageUrl);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setSelectedOption(null);
    setIsClaimed(false);

    try {
      const result = await analyzeWastePhoto(imageUrl, hintCategory);
      setAnalysisResult(result);
      // Pre-select first creative option so user gets instant insight
      if (result.options.length > 0) {
        setSelectedOption(result.options[0]);
      }
    } catch (err) {
      console.error('Error analyzing waste image:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Claim points reward for recycling / upcycling blueprint
  const handleClaimReward = () => {
    if (!analysisResult || !selectedOption || isClaimed) return;
    earnPoints(
      analysisResult.ecoPointsReward,
      `AI Upcycle Plan: ${selectedOption.title} from ${analysisResult.detectedItem}`
    );
    setIsClaimed(true);
  };

  const handleReset = () => {
    setCurrentImage(null);
    setAnalysisResult(null);
    setSelectedOption(null);
    setIsClaimed(false);
  };

  return (
    <div className="space-y-6">
      {/* Hidden Gallery Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Live Camera Modal */}
      <RiddanceCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* STEP 1: PHOTO UPLOAD & CAPTURE ZONE */}
      {!currentImage && (
        <div className="space-y-4">
          <div className="text-center max-w-md mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200/60 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              AI Waste Vision & Circular Blueprint
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Capture or Upload Any Waste Scrap
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Our neural vision analyzes recyclability, biodegradability, and generates an AI picture of what you can craft with complete instructions.
            </p>
          </div>

          {/* Two Primary Action Buttons: Gallery or Camera */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {/* Option 1: Camera */}
            <button
              onClick={() => setIsCameraOpen(true)}
              className="group p-5 rounded-2xl bg-white hover:bg-rose-50/50 border-2 border-dashed border-slate-300 hover:border-rose-500 text-left transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer shadow-xs hover:shadow-md"
            >
              <div className="w-13 h-13 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-sm font-bold text-slate-900">Take Photo with Camera</span>
              <span className="text-[11px] text-slate-500 mt-0.5">Use live device webcam or mobile camera</span>
            </button>

            {/* Option 2: Gallery */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group p-5 rounded-2xl bg-white hover:bg-emerald-50/50 border-2 border-dashed border-slate-300 hover:border-emerald-500 text-left transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer shadow-xs hover:shadow-md"
            >
              <div className="w-13 h-13 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-sm font-bold text-slate-900">Upload from Gallery</span>
              <span className="text-[11px] text-slate-500 mt-0.5">Choose JPEG, PNG or WebP image file</span>
            </button>
          </div>

          {/* Instant 1-Click Test Samples */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Or test with instant waste samples:</span>
              </span>
              <span className="text-[10px] text-slate-400">1-click demo</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SAMPLE_WASTE_ITEMS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="group relative rounded-xl overflow-hidden border border-black/[0.08] hover:border-rose-400 bg-white p-1 text-left transition-all hover:shadow-sm cursor-pointer"
                >
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-100 mb-1">
                    <img
                      src={sample.imageUrl}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="px-1 pb-1">
                    <span className="text-[11px] font-bold text-slate-800 line-clamp-1 block">
                      {sample.name}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase font-mono">
                      {sample.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ANALYZING STATE */}
      {isAnalyzing && currentImage && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-2 border-rose-500 shadow-xl">
            <img src={currentImage} alt="Scanning" className="w-full h-full object-cover" />
            {/* Animated Laser Scanning Line */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_15px_#f43f5e] animate-bounce" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-900">
              <RefreshCw className="w-4 h-4 text-rose-600 animate-spin" />
              <span>Analyzing Material Composition...</span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              Calculating exact recyclable, biodegradable, and reusable percentages, plus upcycle transformations.
            </p>
          </div>
        </div>
      )}

      {/* STEP 2 & 3: ANALYSIS RESULTS & RECYCLABILITY PERCENTAGES */}
      {!isAnalyzing && analysisResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Bar with Re-scan Option */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-black/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-black/10 shrink-0">
                <img
                  src={analysisResult.uploadedImageUrl}
                  alt="Scanned item"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-extrabold text-slate-950">
                    {analysisResult.detectedItem}
                  </h4>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                    {analysisResult.confidenceScore}% Confidence
                  </span>
                </div>
                <p className="text-xs text-slate-500">{analysisResult.materialCategory}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCameraOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Camera</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Gallery</span>
              </button>
              <button
                onClick={handleReset}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>
          </div>

          {/* THREE MANDATORY PERCENTAGE BREAKDOWN METERS */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-black/[0.08] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-rose-600" />
                <span>Material Recyclability & Circularity Breakdown</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                +{analysisResult.co2PotentialKg} kg CO₂ Offset
              </span>
            </div>

            {/* Visual Multi-Color Split Bar */}
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${analysisResult.recyclablePercent}%` }}
                className="h-full bg-emerald-500 transition-all duration-500"
                title={`Recyclable: ${analysisResult.recyclablePercent}%`}
              />
              <div
                style={{ width: `${analysisResult.biodegradablePercent}%` }}
                className="h-full bg-amber-500 transition-all duration-500"
                title={`Biodegradable: ${analysisResult.biodegradablePercent}%`}
              />
              <div
                style={{ width: `${analysisResult.reusablePercent}%` }}
                className="h-full bg-indigo-500 transition-all duration-500"
                title={`Reusable: ${analysisResult.reusablePercent}%`}
              />
            </div>

            {/* Three Percentage Metric Cards */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {/* Recyclable % */}
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                    <Recycle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Recyclable</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-950 tabular-nums">
                  {analysisResult.recyclablePercent}%
                </div>
                <span className="text-[10px] text-emerald-700 block mt-0.5">
                  Can be melted or re-extruded
                </span>
              </div>

              {/* Biodegradable % */}
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-amber-600" />
                    <span>Biodegradable</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-950 tabular-nums">
                  {analysisResult.biodegradablePercent}%
                </div>
                <span className="text-[10px] text-amber-700 block mt-0.5">
                  Organic natural decomposition
                </span>
              </div>

              {/* Reusable % */}
              <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-indigo-900 flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Reusable</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-indigo-950 tabular-nums">
                  {analysisResult.reusablePercent}%
                </div>
                <span className="text-[10px] text-indigo-700 block mt-0.5">
                  Upcyclable into creative goods
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-[#faf9f5] p-3 rounded-xl border border-black/[0.04] leading-relaxed">
              <strong className="text-slate-900 font-semibold">AI Diagnostic Summary: </strong>
              {analysisResult.analysisSummary}
            </p>
          </div>

          {/* STEP 3: OPTIONS SECTION ("What and all they can make from the product") */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  <span>What You Can Make from this Product</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Select an upcycling pathway to generate the AI transformed visual and step-by-step instructions:
                </p>
              </div>
              <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                {analysisResult.options.length} Ideas Available
              </span>
            </div>

            {/* Selection Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {analysisResult.options.map((opt) => {
                const isSelected = selectedOption?.id === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt)}
                    className={`p-3.5 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between border cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50/70 border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-black/[0.08] hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {opt.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            opt.difficulty === 'Easy'
                              ? 'bg-emerald-100 text-emerald-800'
                              : opt.difficulty === 'Intermediate'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {opt.difficulty}
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-slate-950 line-clamp-1 mb-1">
                        {opt.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                        {opt.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-black/[0.05] flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{opt.timeRequired}</span>
                      </span>

                      <span
                        className={`font-bold flex items-center gap-1 ${
                          isSelected ? 'text-rose-600' : 'text-slate-700'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: AI GENERATED TRANSFORMED PICTURE & STEP-BY-STEP GUIDE */}
          {selectedOption && (
            <div className="p-5 rounded-2xl bg-[#faf9f5] border border-black/[0.08] shadow-xs space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-black/[0.06]">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                    AI Generative Blueprint
                  </span>
                  <h4 className="text-lg font-extrabold text-slate-950 mt-1">
                    {selectedOption.title}
                  </h4>
                  <p className="text-xs text-slate-500">{selectedOption.subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-xl border border-black/10 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Est. Time: {selectedOption.timeRequired}</span>
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-xl border border-black/10 flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedOption.difficulty}</span>
                  </span>
                </div>
              </div>

              {/* Side-by-Side: Before (Raw Scrap) vs After (AI Generated Recycled Picture) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before: Uploaded Raw Scrap */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>1. Before: Raw Uploaded Waste</span>
                    <span className="text-[10px] font-mono text-slate-400">Scrap Input</span>
                  </div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-black/10 shadow-xs">
                    <img
                      src={analysisResult.uploadedImageUrl}
                      alt="Raw scrap before"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-medium">
                      Source: {analysisResult.detectedItem}
                    </div>
                  </div>
                </div>

                {/* After: AI Generated Picture of how it looks after recycling */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>2. After: AI Recycled Product Visual</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                      AI Generated
                    </span>
                  </div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 border-2 border-emerald-400/80 shadow-md">
                    <img
                      src={selectedOption.resultImageUrl}
                      alt={selectedOption.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <div className="text-[9px] font-mono uppercase tracking-wider text-emerald-300">
                        Finished Upcycle Outcome
                      </div>
                      <div className="text-xs font-bold drop-shadow-sm">
                        {selectedOption.title}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Materials & Tools Banner */}
              <div className="p-3.5 rounded-xl bg-white border border-black/[0.06] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Required Materials:
                  </span>
                  <span className="font-semibold text-slate-800">{selectedOption.materialsUsed}</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 shrink-0">
                  Zero Landfill Impact
                </span>
              </div>

              {/* CREATIVE STEP-BY-STEP GUIDE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Creative Step-by-Step Instructions:
                  </h5>
                  <span className="text-[11px] text-slate-400">
                    Follow in sequence for optimal finish
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedOption.steps.map((st) => (
                    <div
                      key={st.stepNumber}
                      className="p-3.5 rounded-xl bg-white border border-black/[0.06] shadow-2xs flex gap-3 text-xs"
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {st.stepNumber}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h6 className="font-bold text-slate-900">{st.title}</h6>
                          {st.toolRequired && (
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              Tool: {st.toolRequired}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                          {st.instruction}
                        </p>
                        {st.tip && (
                          <div className="text-[10px] text-emerald-800 bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-200/60 flex items-center gap-1 font-medium">
                            <Info className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>Pro Tip: {st.tip}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Claim Points or Dispatch */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleClaimReward}
                  disabled={isClaimed}
                  className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs tracking-tight shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isClaimed
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-slate-950 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isClaimed ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Blueprint Saved! +{analysisResult.ecoPointsReward} Eco Points Credited!</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4 text-emerald-300" />
                      <span>Save Blueprint & Claim +{analysisResult.ecoPointsReward} Eco Points</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white hover:bg-slate-100 border border-black/10 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Scan Another Scrap
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
