import React from 'react';
import { Camera, Sparkles, UtensilsCrossed, Sliders, Menu as MenuIcon, Layers, FileDown, Eye } from 'lucide-react';
import { ImageModel, ImageResolution, PhotographyStyle } from '../types';

interface HeaderProps {
  activeTab: 'menu' | 'studio' | 'retouch' | 'digital-menu' | 'export';
  setActiveTab: (tab: 'menu' | 'studio' | 'retouch' | 'digital-menu' | 'export') => void;
  restaurantName: string;
  cuisineType: string;
  totalDishes: number;
  shotDishesCount: number;
  activeModel: ImageModel;
  activeResolution: ImageResolution;
  activeStyle: PhotographyStyle;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  restaurantName,
  cuisineType,
  totalDishes,
  shotDishesCount,
  activeModel,
  activeResolution,
  activeStyle,
}) => {
  return (
    <header className="bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 sticky top-0 z-40 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/30 ring-1 ring-amber-400/40">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-stone-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-stone-100">
                  Aura<span className="text-amber-400">Plate</span>
                </span>
                <span className="hidden md:inline-flex text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Virtual Food Photographer
                </span>
              </div>
              <p className="text-xs text-stone-400 truncate max-w-[200px] sm:max-w-xs">
                {restaurantName || 'Restaurant Menu'} • <span className="text-stone-300">{cuisineType || 'Artisan Cuisine'}</span>
              </p>
            </div>
          </div>

          {/* Quick Shoot Status Badges */}
          <div className="hidden lg:flex items-center space-x-3 text-xs">
            <div className="bg-stone-900/80 border border-stone-800 rounded-lg px-3 py-1.5 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-stone-400">Shoot Progress:</span>
              <span className="font-semibold text-stone-200">
                {shotDishesCount}/{totalDishes} Photos
              </span>
            </div>

            <div className="bg-stone-900/80 border border-stone-800 rounded-lg px-3 py-1.5 flex items-center space-x-2">
              <span className="text-amber-400 font-medium">Style:</span>
              <span className="text-stone-200 capitalize font-semibold">{activeStyle}</span>
              <span className="text-stone-600">•</span>
              <span className="text-amber-400 font-medium">Res:</span>
              <span className="text-stone-200 font-semibold">{activeResolution}</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'menu'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-semibold'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900/80'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Menu</span>
            </button>

            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all relative ${
                activeTab === 'studio'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-semibold'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900/80'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Photo Studio</span>
              {totalDishes > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'studio' ? 'bg-stone-950 text-amber-400' : 'bg-stone-800 text-stone-300'
                  }`}
                >
                  {totalDishes}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('retouch')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'retouch'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-semibold'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900/80'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Retouch</span>
            </button>

            <button
              onClick={() => setActiveTab('digital-menu')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'digital-menu'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-semibold'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900/80'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Digital</span> Menu
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'export'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-semibold'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900/80'
              }`}
            >
              <FileDown className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
