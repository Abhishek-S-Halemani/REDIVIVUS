import React, { useState, useEffect } from 'react';
import { AppleIcon } from './AppleIcon';
import { MarketplaceProduct } from '../types';
import { usePoints } from '../context/PointsContext';
import { CUSTOMER_LOCATIONS, getHowToMakeForProduct } from '../data/marketplaceData';
import {
  ShoppingBag,
  X,
  Search,
  ShieldCheck,
  ArrowRight,
  Check,
  Sparkles,
  MessageSquare,
  Send,
  Award,
  Layers,
  MapPin,
  Star,
  ChevronLeft,
  ChevronDown,
  AlertCircle,
  Percent,
  Navigation,
} from 'lucide-react';

interface MarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: MarketplaceProduct | null;
  onClearSelectedItem: () => void;
}

export const MarketplaceModal: React.FC<MarketplaceModalProps> = ({
  isOpen,
  onClose,
  selectedItem,
  onClearSelectedItem,
}) => {
  const {
    products,
    userPoints,
    customerLocation,
    setCustomerLocation,
    maxDistanceKm,
    setMaxDistanceKm,
    buyProductWithPoints,
    requestDiscount,
    sendMessageToSeller,
    conversations,
    isMarketplaceMember,
    openAuthModal,
  } = usePoints();

  const [activeItem, setActiveItem] = useState<MarketplaceProduct | null>(selectedItem || null);
  const [viewMode, setViewMode] = useState<'catalog' | 'detail'>('catalog');
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [purchaseSuccess, setPurchaseSuccess] = useState<boolean>(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  // Streamlined points negotiation state
  const [customOfferPoints, setCustomOfferPoints] = useState<number>(0);
  const [isSubmittingOffer, setIsSubmittingOffer] = useState<boolean>(false);
  const [negotiationToast, setNegotiationToast] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState<string>('');
  const [showChat, setShowChat] = useState<boolean>(false);
  const [isHowToExpanded, setIsHowToExpanded] = useState<boolean>(false);

  // Sync prop changes & reset default state when closed or opened without selection
  useEffect(() => {
    if (isOpen) {
      if (selectedItem) {
        const fresh = products.find((p) => p.id === selectedItem.id) || selectedItem;
        setActiveItem(fresh);
        setViewMode('detail');
        setPurchaseSuccess(false);
        setPurchaseError(null);
        setCustomOfferPoints(fresh.negotiatedPoints || Math.round(fresh.points * 0.85));
      } else {
        // Normal open without product selection: default to catalog view
        setActiveItem(null);
        setViewMode('catalog');
        setPurchaseSuccess(false);
        setPurchaseError(null);
      }
    } else {
      // Reset state when closed
      setActiveItem(null);
      setViewMode('catalog');
      setPurchaseSuccess(false);
      setPurchaseError(null);
      onClearSelectedItem();
    }
  }, [isOpen, selectedItem]);

  if (!isOpen) return null;

  const currentProduct = activeItem
    ? products.find((p) => p.id === activeItem.id) || activeItem
    : null;

  // Filter nearby products according to customer location radius
  const filtered = products
    .filter((p) => p.distanceKm <= maxDistanceKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .filter((p) => {
      const matchCat = category === 'all' || p.category === category;
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.recycledFrom.toLowerCase().includes(search.toLowerCase()) ||
        p.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
        p.seller.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });

  const handleOpenDetail = (item: MarketplaceProduct) => {
    setActiveItem(item);
    setViewMode('detail');
    setPurchaseSuccess(false);
    setPurchaseError(null);
    setShowChat(false);
    setCustomOfferPoints(item.negotiatedPoints || Math.round(item.points * 0.85));
  };

  const handleBackToCatalog = () => {
    setViewMode('catalog');
    setActiveItem(null);
    setPurchaseSuccess(false);
    setPurchaseError(null);
    onClearSelectedItem();
  };

  const handleBuy = (item: MarketplaceProduct) => {
    if (!isMarketplaceMember) {
      openAuthModal('Please join Market Place to acquire recycled products with Eco Points!');
      return;
    }
    const result = buyProductWithPoints(item.id);
    if (result.success) {
      setPurchaseSuccess(true);
      setPurchaseError(null);
    } else {
      setPurchaseError(result.message);
    }
  };

  const handleQuickDiscount = async (discountPercent: number) => {
    if (!currentProduct) return;
    if (!isMarketplaceMember) {
      openAuthModal('Please join Market Place to request point discounts!');
      return;
    }
    const targetPoints = Math.round(currentProduct.points * (1 - discountPercent / 100));
    setIsSubmittingOffer(true);
    setNegotiationToast(`Sending offer for ${targetPoints.toLocaleString()} PTS...`);

    const result = await requestDiscount(
      currentProduct.id,
      targetPoints,
      `Hello! Requesting nearby buyer discount of ${discountPercent}% (${targetPoints.toLocaleString()} PTS).`
    );

    setIsSubmittingOffer(false);
    setNegotiationToast(result.sellerNote);
    setTimeout(() => setNegotiationToast(null), 4500);
  };

  const handleCustomPointOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct || customOfferPoints <= 0) return;

    setIsSubmittingOffer(true);
    setNegotiationToast(`Proposing ${customOfferPoints.toLocaleString()} PTS to seller...`);

    const result = await requestDiscount(currentProduct.id, customOfferPoints);

    setIsSubmittingOffer(false);
    setNegotiationToast(result.sellerNote);
    setTimeout(() => setNegotiationToast(null), 4500);
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct || !chatInput.trim()) return;

    const text = chatInput.trim();
    setChatInput('');
    await sendMessageToSeller(currentProduct.id, text);
  };

  const activeMessages = currentProduct ? conversations[currentProduct.id] || [] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#faf9f5] rounded-[34px] border border-black/10 shadow-[0_30px_70px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Apple specular gloss reflection */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/80 to-transparent pointer-events-none rounded-t-[34px]" />

        {/* Modal Header */}
        <div className="relative z-10 px-4 sm:px-6 py-3.5 border-b border-black/[0.06] flex items-center justify-between bg-white/85 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
            <AppleIcon gradient="emerald" size="sm" shadow={false}>
              <ShoppingBag className="w-5 h-5 text-white" />
            </AppleIcon>

            {/* Nearby Recycled Market Titled Div */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 whitespace-nowrap">
                  Nearby Recycled Market
                </h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Local Radius
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Points Only
                </span>
              </div>

              {/* Location Tab placed below the title */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/90 border border-slate-200/80 shadow-2xs text-xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">Location:</span>
                <select
                  value={customerLocation.id}
                  onChange={(e) => {
                    const found = CUSTOMER_LOCATIONS.find((loc) => loc.id === e.target.value);
                    if (found) setCustomerLocation(found);
                  }}
                  className="font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer text-xs"
                >
                  {CUSTOMER_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.neighborhood} ({loc.city})
                    </option>
                  ))}
                </select>

                <span className="text-slate-300">|</span>

                {/* Radius toggle chips */}
                <div className="flex items-center gap-1">
                  {[5, 10, 15, 25].map((km) => (
                    <button
                      key={km}
                      type="button"
                      onClick={() => setMaxDistanceKm(km)}
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                        maxDistanceKm === km
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      &lt;{km}km
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Live Wallet Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100/90 text-emerald-950 border border-emerald-200 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>{userPoints.toLocaleString()} PTS</span>
            </div>

            <button
              onClick={() => {
                if (viewMode === 'detail') {
                  handleBackToCatalog();
                } else {
                  onClearSelectedItem();
                  onClose();
                }
              }}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              title={viewMode === 'detail' ? 'Return to Catalog' : 'Close Market Place'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 flex-1 min-h-0 overflow-y-auto">
          {/* PURCHASE RECEIPT SCREEN */}
          {purchaseSuccess && currentProduct ? (
            <div className="p-6 sm:p-10 flex flex-col items-center text-center my-auto">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-slate-900">Item Successfully Acquired!</h4>
              <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
                You acquired <strong className="text-slate-800">{currentProduct.title}</strong> from nearby seller{' '}
                <strong className="text-slate-800">{currentProduct.seller}</strong> ({currentProduct.distanceKm} km away).
              </p>

              <div className="mt-5 p-4 rounded-2xl bg-white border border-black/[0.06] shadow-sm max-w-md w-full text-left space-y-2">
                <div className="flex gap-3 items-center pb-2 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={currentProduct.image}
                      alt={currentProduct.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{currentProduct.title}</h5>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{currentProduct.location} ({currentProduct.distanceKm} km)</span>
                    </p>
                    <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Local Pickup Ready
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-xs py-0.5">
                  <span className="text-slate-500">Points Deducted:</span>
                  <span className="font-extrabold text-slate-950 tabular-nums">
                    {(currentProduct.negotiatedPoints ?? currentProduct.points).toLocaleString()} Eco Points
                  </span>
                </div>
                <div className="flex justify-between text-xs py-0.5">
                  <span className="text-slate-500">Remaining Balance:</span>
                  <span className="font-bold text-emerald-700 tabular-nums">
                    {userPoints.toLocaleString()} PTS
                  </span>
                </div>
                <div className="flex justify-between text-xs py-0.5">
                  <span className="text-slate-500">Carbon Diverted:</span>
                  <span className="font-bold text-emerald-600">-{currentProduct.co2SavedKg} kg CO₂</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={handleBackToCatalog}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  Browse More Nearby Sellers
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : viewMode === 'detail' && currentProduct ? (
            /* STREAMLINED PRODUCT DETAIL VIEW */
            <div className="p-4 sm:p-6 space-y-4">
              {/* Back Bar */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBackToCatalog}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Nearby Catalog</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{currentProduct.distanceKm} km from you</span>
                  </span>
                </div>
              </div>

              {/* Purchase Error Banner */}
              {purchaseError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-900">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-semibold">{purchaseError}</span>
                </div>
              )}

              {/* Negotiation Toast Banner */}
              {negotiationToast && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center gap-2 text-xs text-emerald-950 animate-in fade-in">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">{negotiationToast}</span>
                </div>
              )}

              {/* 2-Column Responsive Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left Column: Fully Responsive & Compatible Recycled Photo */}
                <div className="space-y-3">
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-square max-h-80 md:max-h-96 rounded-2xl overflow-hidden bg-slate-200 border border-black/10 shadow-xs">
                    <img
                      src={currentProduct.image}
                      alt={currentProduct.title}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{currentProduct.distanceKm} km away</span>
                      </span>

                      <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30">
                        {currentProduct.condition}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <div className="text-[9px] font-mono uppercase tracking-wider text-emerald-300">
                        Recycled Origin
                      </div>
                      <div className="text-xs font-semibold leading-snug drop-shadow-sm">
                        {currentProduct.recycledFrom}
                      </div>
                    </div>
                  </div>

                  {/* Recycled Materials Breakdown */}
                  <div className="p-3.5 rounded-2xl bg-white border border-black/[0.06] shadow-2xs space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Recycled Composition</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {currentProduct.materials.map((mat) => (
                        <div key={mat.name} className="p-2 rounded-xl bg-slate-50 text-center">
                          <div className="text-xs font-black text-slate-900">{mat.percentage}%</div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">{mat.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Title, Points Price, Direct Negotiation & Acquisition */}
                <div className="space-y-3.5 flex flex-col justify-between">
                  <div>
                    {/* Seller & Distance Header */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={currentProduct.sellerAvatar}
                          alt={currentProduct.seller}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-800">{currentProduct.seller}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span className="font-mono text-emerald-700 font-semibold">
                        📍 {currentProduct.location}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-slate-950 leading-tight">
                      {currentProduct.title}
                    </h2>

                    {/* Price Card in Points */}
                    <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-emerald-800">
                          Price in Points
                        </div>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-2xl sm:text-3xl font-black text-slate-950 tabular-nums">
                            {(currentProduct.negotiatedPoints ?? currentProduct.points).toLocaleString()}
                          </span>
                          <span className="text-sm font-bold text-emerald-700">PTS</span>

                          {currentProduct.negotiatedPoints &&
                          currentProduct.negotiatedPoints < currentProduct.points ? (
                            <span className="text-xs text-slate-400 line-through tabular-nums">
                              {currentProduct.points} PTS
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 line-through tabular-nums">
                              {currentProduct.originalPoints} PTS
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-black text-emerald-900 tabular-nums">
                          {userPoints.toLocaleString()} PTS
                        </span>
                      </div>
                    </div>

                    {/* HOW TO MAKE THIS PRODUCT SECTION (Collapsible Dropdown Button to save space) */}
                    {(() => {
                      const howTo = getHowToMakeForProduct(currentProduct);
                      return (
                        <div className="mt-3 p-3 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-amber-50/50 to-white border border-emerald-200/90 shadow-2xs space-y-2">
                          {/* Title Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                                🛠️
                              </div>
                              <div>
                                <h4 className="text-xs font-extrabold text-slate-950 uppercase tracking-wide">
                                  How to Make This Product
                                </h4>
                              </div>
                            </div>
                          </div>

                          {/* Expand/Collapse Dropdown Button */}
                          <button
                            type="button"
                            onClick={() => setIsHowToExpanded(!isHowToExpanded)}
                            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200/90 text-slate-800 text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-2xs active:scale-[0.99]"
                          >
                            <span className="flex items-center gap-1.5 text-emerald-950 font-extrabold">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                              <span>
                                {isHowToExpanded ? 'Hide Crafting Steps' : `View Step-by-Step DIY Guide (${howTo.steps.length} Steps)`}
                              </span>
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-emerald-700 transition-transform duration-200 ${
                                isHowToExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {/* Expanded Content: Tools & Steps */}
                          {isHowToExpanded && (
                            <div className="space-y-2.5 pt-2 border-t border-emerald-200/60 animate-in fade-in duration-200">
                              {/* Tools & Materials Required */}
                              <div className="text-[10px] bg-white/90 p-2.5 rounded-xl border border-black/[0.06] space-y-1">
                                <div className="font-extrabold text-slate-900 flex items-center gap-1 text-[11px]">
                                  <Sparkles className="w-3 h-3 text-emerald-600" />
                                  <span>Tools & Materials Required:</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {howTo.toolsNeeded.map((tool, idx) => (
                                    <span
                                      key={idx}
                                      className="bg-slate-100 text-slate-800 font-medium px-2 py-0.5 rounded-md text-[10px] border border-slate-200/80"
                                    >
                                      • {tool}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Step by Step DIY Instructions */}
                              <div className="space-y-2">
                                <div className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">
                                  Crafting Steps ({howTo.steps.length} Steps):
                                </div>
                                {howTo.steps.map((st) => (
                                  <div
                                    key={st.stepNumber}
                                    className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[11px] leading-relaxed flex gap-2.5 shadow-2xs"
                                  >
                                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                      {st.stepNumber}
                                    </span>
                                    <div className="space-y-0.5">
                                      <div className="font-extrabold text-slate-900 text-xs">
                                        {st.title}
                                      </div>
                                      <p className="text-slate-600 text-[11px] leading-relaxed">
                                        {st.instruction}
                                      </p>
                                      {st.tip && (
                                        <div className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 font-medium inline-block mt-1">
                                          💡 Pro Tip: {st.tip}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* DIRECT POINTS NEGOTIATION (Clean, Fast, No Clutter) */}
                    <div className="mt-3 p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Percent className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Negotiate Points with Nearby Seller</span>
                        </span>
                      </div>

                      {/* Quick 1-click discount presets */}
                      <div className="grid grid-cols-3 gap-1.5">
                        {[10, 20, 30].map((pct) => {
                          const targetPts = Math.round(currentProduct.points * (1 - pct / 100));
                          return (
                            <button
                              key={pct}
                              type="button"
                              onClick={() => handleQuickDiscount(pct)}
                              disabled={isSubmittingOffer}
                              className="py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-center transition-all cursor-pointer disabled:opacity-50"
                            >
                              <div className="text-xs font-bold text-slate-900">-{pct}%</div>
                              <div className="text-[10px] text-emerald-700 font-semibold tabular-nums">
                                {targetPts.toLocaleString()} PTS
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom Point Offer Input */}
                      <form onSubmit={handleCustomPointOffer} className="flex gap-1.5">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min="50"
                            max={currentProduct.points}
                            value={customOfferPoints}
                            onChange={(e) => setCustomOfferPoints(Number(e.target.value))}
                            placeholder="Propose custom points..."
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 focus:bg-white focus:outline-none"
                          />
                          <span className="absolute right-2.5 top-1.5 text-[10px] font-bold text-slate-400">
                            PTS
                          </span>
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmittingOffer}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isSubmittingOffer ? 'Evaluating...' : 'Propose Points'}
                        </button>
                      </form>
                    </div>

                    {/* Optional Direct Seller Chat Toggle */}
                    <div className="mt-2">
                      <button
                        onClick={() => setShowChat(!showChat)}
                        className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{showChat ? 'Hide Message Thread' : 'Ask Seller about Local Pickup'}</span>
                      </button>

                      {showChat && (
                        <div className="mt-2 p-3 rounded-2xl bg-white border border-slate-200 space-y-2">
                          <div className="max-h-28 overflow-y-auto space-y-1.5 text-xs">
                            {activeMessages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`p-2 rounded-xl text-[11px] ${
                                  msg.sender === 'buyer'
                                    ? 'bg-slate-900 text-white ml-auto max-w-[80%]'
                                    : 'bg-slate-100 text-slate-800 mr-auto max-w-[80%]'
                                }`}
                              >
                                {msg.text}
                              </div>
                            ))}
                          </div>
                          <form onSubmit={handleSendChatMessage} className="flex gap-1.5">
                            <input
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              placeholder="Type message to seller..."
                              className="flex-1 px-2.5 py-1 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none"
                            />
                            <button
                              type="submit"
                              className="px-3 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg"
                            >
                              <Send className="w-3 h-3" />
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Primary Buy Action in Points */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleBuy(currentProduct)}
                      className="w-full py-3 px-4 rounded-2xl bg-slate-950 hover:bg-emerald-600 text-white font-bold text-xs tracking-tight shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-emerald-300" />
                      <span>
                        Acquire for{' '}
                        {(currentProduct.negotiatedPoints ?? currentProduct.points).toLocaleString()} Points
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* CATALOG GRID VIEW: NEARBY SELLERS ONLY */
            <div className="p-4 sm:p-6 space-y-4">
              {/* Category Filter + Search Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                  {(
                    [
                      { id: 'all', label: 'All Nearby' },
                      { id: 'furniture', label: 'Furniture' },
                      { id: 'wearables', label: 'Wearables' },
                      { id: 'materials', label: 'Craft & Table' },
                      { id: 'tech', label: 'Tech' },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setCategory(t.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                        category === t.id
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search nearby recycled items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-xs bg-white rounded-xl border border-black/10 focus:border-emerald-400 focus:outline-none w-56 sm:w-64 shadow-2xs"
                  />
                </div>
              </div>

              {/* No items in radius fallback */}
              {filtered.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <Navigation className="w-10 h-10 text-slate-300 mb-2" />
                  <h4 className="text-sm font-bold text-slate-800">No sellers within {maxDistanceKm} km</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-0.5">
                    Expand your nearby radius or switch location to view more recycled products.
                  </p>
                  <button
                    onClick={() => setMaxDistanceKm(25)}
                    className="mt-3 px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                  >
                    Expand to 25 km Radius
                  </button>
                </div>
              ) : (
                /* Compatible Responsive Grid of Nearby Recycled Items */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((item) => {
                    const currentPrice = item.negotiatedPoints ?? item.points;
                    const hasDiscount = item.negotiatedPoints && item.negotiatedPoints < item.points;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleOpenDetail(item)}
                        className="group/card p-3 rounded-2xl bg-white border border-black/[0.06] hover:border-emerald-400 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
                      >
                        <div>
                          {/* Compatible Responsive Photo Container */}
                          <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 mb-2.5">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-300"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.src =
                                  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />

                             {/* Top badging */}
                            <div className="absolute top-2 left-2 right-2 flex items-center justify-end">
                            </div>

                            {/* Bottom overlay: distance kms away on left, PTS on right */}
                            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-medium text-white">
                              <span className="font-extrabold text-white text-[9px] flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                                <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                                <span>{item.distanceKm} km away</span>
                              </span>
                              <span className="text-emerald-300 font-mono text-[9px] font-extrabold bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded border border-emerald-400/40 tabular-nums">
                                {currentPrice.toLocaleString()} PTS
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        </div>

                        {/* Points & Negotiate Footer */}
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-black text-slate-950 tabular-nums">
                              {currentPrice.toLocaleString()}{' '}
                              <span className="text-[10px] font-bold text-emerald-700">PTS</span>
                            </div>
                            {hasDiscount ? (
                              <span className="text-[9px] text-emerald-600 font-bold block">
                                Negotiated Discount!
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">
                                Orig. {item.originalPoints} PTS
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetail(item);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <Percent className="w-3 h-3" />
                              <span>Negotiate</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBuy(item);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-emerald-600 text-white font-bold text-xs tracking-tight shadow-2xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <span>Acquire</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
