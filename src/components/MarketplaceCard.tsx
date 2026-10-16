import React, { useState } from 'react';
import { AppleIcon } from './AppleIcon';
import { MarketplaceProduct } from '../types';
import { usePoints } from '../context/PointsContext';
import { CUSTOMER_LOCATIONS, getHowToMakeForProduct } from '../data/marketplaceData';
import {
  ShoppingBag,
  ArrowUpRight,
  Search,
  Heart,
  ArrowRight,
  MapPin,
  Navigation,
} from 'lucide-react';

interface MarketplaceCardProps {
  onOpen: () => void;
  onSelectItem: (item: MarketplaceProduct) => void;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ onOpen, onSelectItem }) => {
  const {
    nearbyProducts,
    userPoints,
    customerLocation,
    setCustomerLocation,
    maxDistanceKm,
    setMaxDistanceKm,
    isMarketplaceMember,
    openAuthModal,
  } = usePoints();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredItems = nearbyProducts.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recycledFrom.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div
      onClick={onOpen}
      className="group relative w-full h-full min-h-[480px] flex flex-col justify-between p-4 sm:p-5 md:p-6 bg-white/95 hover:bg-white rounded-[28px] md:rounded-[32px] border border-black/[0.08] shadow-[0_16px_45px_rgba(0,0,0,0.06),_0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_24px_55px_rgba(5,150,105,0.12)] transition-all duration-300 cursor-pointer overflow-hidden select-none"
    >
      {/* Apple specular gloss reflection at top */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/80 to-transparent pointer-events-none rounded-t-[32px]" />

      {/* Ambient emerald accent glow */}
      <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all" />

      {/* Grid Partition Header */}
      <div className="relative z-10 flex flex-col shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {/* Apple App Icon */}
            <AppleIcon gradient="emerald" size="md" shadow={true}>
              <ShoppingBag className="w-7 h-7 text-white drop-shadow-sm stroke-[2.2]" />
            </AppleIcon>

            <div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
                className="flex items-center gap-1.5 mb-1 group/title cursor-pointer text-left focus:outline-none"
                title="Click to view all Market Place products"
              >
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-950 group-hover/title:text-emerald-600 transition-colors flex items-center gap-1.5">
                  <span>Market Place</span>
                  <ArrowUpRight className="w-5 h-5 text-emerald-600 opacity-90 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-transform" />
                </h2>
              </button>

              {/* Location Tab placed below the title */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs shadow-2xs"
              >
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <select
                    value={customerLocation.id}
                    onChange={(e) => {
                      const found = CUSTOMER_LOCATIONS.find((loc) => loc.id === e.target.value);
                      if (found) setCustomerLocation(found);
                    }}
                    className="font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer text-[11px]"
                  >
                    {CUSTOMER_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.neighborhood}
                      </option>
                    ))}
                  </select>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-0.5">
                    {[5, 10, 15].map((km) => (
                      <button
                        key={km}
                        type="button"
                        onClick={() => setMaxDistanceKm(km)}
                        className={`px-1 py-0.2 text-[9px] font-bold rounded transition-all cursor-pointer ${
                          maxDistanceKm === km
                            ? 'bg-emerald-700 text-white'
                            : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        &lt;{km}k
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-all duration-200 shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

        {/* Filter controls + Search */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-black/[0.05]"
        >
          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100/90 rounded-xl overflow-x-auto max-w-full">
            {(
              [
                { id: 'all', label: 'All Nearby' },
                { id: 'furniture', label: 'Furniture' },
                { id: 'wearables', label: 'Wearables' },
                { id: 'materials', label: 'Craft & Table' },
                { id: 'tech', label: 'Tech' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative flex items-center">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter nearby items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-2.5 py-1 text-[11px] bg-slate-100/80 focus:bg-white rounded-lg border border-transparent focus:border-emerald-300 text-slate-800 focus:outline-none transition-all w-36 sm:w-40"
            />
          </div>
        </div>
      </div>

      {/* Responsive Grid Body with Compatible Recycled Photos */}
      <div className="relative z-10 flex-1 min-h-0 my-2 overflow-y-auto pr-1">
        {filteredItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center">
            <Navigation className="w-8 h-8 text-slate-300 mb-1" />
            <div className="text-xs font-bold text-slate-700">No sellers within {maxDistanceKm} km</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Try expanding your nearby radius to 15 km.</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMaxDistanceKm(15);
              }}
              className="mt-2 px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200"
            >
              Expand to 15 km
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 content-start">
            {filteredItems.slice(0, 4).map((item) => {
              const currentPrice = item.negotiatedPoints ?? item.points;

              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem(item);
                  }}
                  className="group/item relative p-2 rounded-2xl bg-[#faf9f5] hover:bg-white border border-black/[0.05] hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Responsive, Proportion-Compatible Recycled Photo */}
                    <div className="relative w-full aspect-[16/10] h-24 sm:h-28 max-h-32 rounded-xl overflow-hidden bg-slate-200 mb-1.5">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover object-center group-hover/item:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />

                      {/* Top badging */}
                      <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-end">

                        <button
                          onClick={(e) => toggleLike(item.id, e)}
                          className={`p-1 rounded-full backdrop-blur-md transition-colors ${
                            likedItems[item.id]
                              ? 'bg-rose-500 text-white'
                              : 'bg-black/40 text-white/80 hover:text-white'
                          }`}
                          aria-label="Save item"
                        >
                          <Heart className={`w-3 h-3 ${likedItems[item.id] ? 'fill-white' : ''}`} />
                        </button>
                      </div>

                      {/* Bottom image overlay: kms away on left, PTS on right */}
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[9px] text-white">
                        <span className="font-extrabold text-white text-[9px] flex items-center gap-1 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
                          <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                          <span>{item.distanceKm} km away</span>
                        </span>
                        <span className="text-emerald-300 font-mono text-[9px] font-extrabold bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded border border-emerald-400/40 tabular-nums">
                          {currentPrice.toLocaleString()} PTS
                        </span>
                      </div>
                    </div>

                    {/* Item title and How to Make indicator */}
                    <div className="px-1 py-1 space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 line-clamp-1 group-hover/item:text-emerald-700 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-emerald-800 font-bold flex items-center justify-between">
                        <span>🛠️ How to Make ({getHowToMakeForProduct(item).steps.length} Steps)</span>
                        <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                          {getHowToMakeForProduct(item).difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid Footer Bar */}
      <div className="relative z-10 pt-2 border-t border-black/[0.05] flex items-center justify-end shrink-0">

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          className="py-1.5 px-3 rounded-xl bg-slate-950 hover:bg-emerald-700 text-white font-semibold text-xs tracking-tight shadow-sm transition-all duration-200 flex items-center gap-1 active:scale-[0.98] cursor-pointer"
        >
          <span>All Nearby Goods</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
