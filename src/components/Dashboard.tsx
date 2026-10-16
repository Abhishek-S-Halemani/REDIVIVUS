import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { RiddanceCard } from './RiddanceCard';
import { MarketplaceCard } from './MarketplaceCard';
import { ShhhPosePartition } from './ShhhPosePartition';
import { RiddanceModal } from './RiddanceModal';
import { MarketplaceModal } from './MarketplaceModal';
import { ShhhPoseModal } from './ShhhPoseModal';
import { MarketplaceAuthModal } from './MarketplaceAuthModal';
import { MarketplaceProduct } from '../types';
import { usePoints } from '../context/PointsContext';

interface DashboardProps {
  onReplayParticles: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onReplayParticles }) => {
  const { isAuthModalOpen, closeAuthModal, authCustomMessage } = usePoints();

  const [isRiddanceOpen, setIsRiddanceOpen] = useState<boolean>(false);
  const [riddanceInitialTab, setRiddanceInitialTab] = useState<'ai-scan' | 'dispatch'>('ai-scan');
  const [autoOpenCamera, setAutoOpenCamera] = useState<boolean>(false);
  const [initialScanImage, setInitialScanImage] = useState<string | null>(null);
  const [selectedCategoryHint, setSelectedCategoryHint] = useState<string>('e-waste');
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState<boolean>(false);
  const [isShhhPoseOpen, setIsShhhPoseOpen] = useState<boolean>(false);
  const [selectedMarketItem, setSelectedMarketItem] = useState<MarketplaceProduct | null>(null);

  const handleOpenRiddance = (
    tab: 'ai-scan' | 'dispatch' = 'ai-scan',
    autoCamera: boolean = false,
    initialImage: string | null = null,
    categoryHint: string = 'e-waste'
  ) => {
    setRiddanceInitialTab(tab);
    setAutoOpenCamera(autoCamera);
    setInitialScanImage(initialImage);
    setSelectedCategoryHint(categoryHint);
    setIsRiddanceOpen(true);
  };

  const handleSelectMarketItem = (item: MarketplaceProduct) => {
    setSelectedMarketItem(item);
    setIsMarketplaceOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#f7f6f2] text-slate-900 flex flex-col overflow-y-auto selection:bg-rose-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        onReplayParticles={onReplayParticles}
        onOpenRiddance={() => handleOpenRiddance('ai-scan', false, null, 'e-waste')}
        onOpenMarketplace={() => setIsMarketplaceOpen(true)}
        onOpenShhhPose={() => setIsShhhPoseOpen(true)}
      />

      {/* Main Content: 100% Full Width Screen Layout (Amazon style) */}
      <main className="flex-1 w-full px-3 sm:px-5 md:px-6 py-4 flex flex-col">
        <div className="flex flex-col gap-4 md:gap-6 flex-1 pb-10">
          {/* Main Grid: 50:50 Widths on Desktop (Left: Riddance + ShhhPose, Right: Market Place) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full items-start">
            {/* Left Column: 1. Riddance & 2. ShhhPose directly below */}
            <div className="w-full flex flex-col gap-4 md:gap-6">
              <RiddanceCard />
              <ShhhPosePartition onOpen={() => setIsShhhPoseOpen(true)} />
            </div>

            {/* Right Column: 3. Market Place */}
            <div className="w-full flex flex-col h-full">
              <MarketplaceCard
                onOpen={() => setIsMarketplaceOpen(true)}
                onSelectItem={handleSelectMarketItem}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Interactive Modals */}
      <RiddanceModal
        isOpen={isRiddanceOpen}
        onClose={() => setIsRiddanceOpen(false)}
        initialTab={riddanceInitialTab}
        autoOpenCamera={autoOpenCamera}
        initialImage={initialScanImage}
        categoryHint={selectedCategoryHint}
      />
      <MarketplaceModal
        isOpen={isMarketplaceOpen}
        onClose={() => {
          setIsMarketplaceOpen(false);
          setSelectedMarketItem(null);
        }}
        selectedItem={selectedMarketItem}
        onClearSelectedItem={() => setSelectedMarketItem(null)}
      />
      <ShhhPoseModal isOpen={isShhhPoseOpen} onClose={() => setIsShhhPoseOpen(false)} />

      {/* Market Place Login / Registration Modal */}
      <MarketplaceAuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        customMessage={authCustomMessage}
      />
    </div>
  );
};
