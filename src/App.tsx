/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ParticleAssembler } from './components/ParticleAssembler';
import { Dashboard } from './components/Dashboard';
import { PointsProvider } from './context/PointsContext';

export default function App() {
  const [currentView, setCurrentView] = useState<'particles' | 'dashboard'>('particles');

  return (
    <PointsProvider>
      <div className="w-full min-h-screen bg-[#08080a] overflow-x-hidden font-sans">
        {currentView === 'particles' ? (
          <div className="w-full h-full animate-in fade-in zoom-in-95 duration-500">
            <ParticleAssembler onEnterApp={() => setCurrentView('dashboard')} />
          </div>
        ) : (
          <div className="w-full h-full animate-in fade-in duration-500">
            <Dashboard onReplayParticles={() => setCurrentView('particles')} />
          </div>
        )}
      </div>
    </PointsProvider>
  );
}
