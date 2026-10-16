import React from 'react';
import { AppleIcon } from './AppleIcon';
import { Lock, Heart } from 'lucide-react';

interface ShhhPosePartitionProps {
  onOpen: () => void;
}

export const ShhhPosePartition: React.FC<ShhhPosePartitionProps> = ({ onOpen }) => {
  return (
    <div
      onClick={onOpen}
      className="group relative w-full p-4 sm:p-5 md:p-6 bg-[#16171a] hover:bg-[#1a1b20] text-white rounded-[28px] md:rounded-[32px] border border-white/10 shadow-[0_16px_45px_rgba(0,0,0,0.25)] hover:shadow-[0_24px_55px_rgba(244,63,94,0.18)] transition-all duration-300 cursor-pointer overflow-hidden select-none flex flex-col justify-between gap-4"
    >
      {/* Apple specular gloss reflection at top */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/12 to-transparent pointer-events-none rounded-t-[32px]" />

      {/* Ambient graphite & rose glow */}
      <div className="absolute -bottom-8 right-1/4 w-80 h-24 bg-rose-500/10 blur-3xl pointer-events-none" />

      {/* Main Bar Contents */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* Left: Apple App Icon + Title */}
        <div className="flex items-center gap-3.5 shrink-0">
          <AppleIcon gradient="graphite" size="md" shadow={true}>
            <Lock className="w-6 h-6 text-white stroke-[2.2]" />
          </AppleIcon>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-white group-hover:text-rose-400 transition-colors">
                ShhhPose
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
