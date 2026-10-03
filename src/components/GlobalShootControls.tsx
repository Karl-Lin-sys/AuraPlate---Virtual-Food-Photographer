import React from 'react';
import { Moon, Sun, Smartphone, Sparkles, Zap, Play, CheckCircle2, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { AspectRatio, ImageModel, ImageResolution, PhotographyStyle } from '../types';

interface GlobalShootControlsProps {
  style: PhotographyStyle;
  setStyle: (style: PhotographyStyle) => void;
  resolution: ImageResolution;
  setResolution: (res: ImageResolution) => void;
  model: ImageModel;
  setModel: (model: ImageModel) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ar: AspectRatio) => void;
  onBatchShoot: () => void;
  isBatchShooting: boolean;
  batchProgress: { current: number; total: number };
  totalDishes: number;
  shotCount: number;
}

export const GlobalShootControls: React.FC<GlobalShootControlsProps> = ({
  style,
  setStyle,
  resolution,
  setResolution,
  model,
  setModel,
  aspectRatio,
  setAspectRatio,
  onBatchShoot,
  isBatchShooting,
  batchProgress,
  totalDishes,
  shotCount,
}) => {
  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md mb-8">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        {/* Style Toggles */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            1. Culinary Photography Style
          </label>
          <div className="grid grid-cols-3 gap-2 bg-stone-950 p-1.5 rounded-xl border border-stone-800">
            {/* Rustic/Dark */}
            <button
              type="button"
              onClick={() => setStyle('rustic')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                style === 'rustic'
                  ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-inner'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
              title="Moody chiaroscuro, dark slate, warm side lighting, artisanal tavern aesthetic"
            >
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              <div className="text-left">
                <span className="font-semibold block">Rustic / Dark</span>
                <span className="text-[10px] text-stone-500 hidden sm:block">Chiaroscuro & Slate</span>
              </div>
            </button>

            {/* Bright/Modern */}
            <button
              type="button"
              onClick={() => setStyle('bright')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                style === 'bright'
                  ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-inner'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
              title="Sunlit daylight, off-white ceramic, marble, clean Scandinavian bistro"
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <div className="text-left">
                <span className="font-semibold block">Bright / Modern</span>
                <span className="text-[10px] text-stone-500 hidden sm:block">Sunlit & Marble</span>
              </div>
            </button>

            {/* Social Media Flat-Lay */}
            <button
              type="button"
              onClick={() => setStyle('social')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                style === 'social'
                  ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-inner'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
              title="90° overhead bird's-eye flat lay with lifestyle props for Instagram & delivery apps"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <div className="text-left">
                <span className="font-semibold block">Social Media</span>
                <span className="text-[10px] text-stone-500 hidden sm:block">Top-Down Flat-Lay</span>
              </div>
            </button>
          </div>
        </div>

        {/* Resolution & Ratio Affordances */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
          {/* Resolution Selector (1K, 2K, 4K) */}
          <div className="space-y-2 flex-1 sm:flex-initial">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              Resolution
            </label>
            <div className="flex bg-stone-950 p-1.5 rounded-xl border border-stone-800">
              {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setResolution(res)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    resolution === res
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  }`}
                  title={
                    res === '4K'
                      ? '4K Ultra High Definition (3840×3840) for print billboards and fine-dining menus'
                      : res === '2K'
                      ? '2K High Definition (2048×2048) for printed tabletop menu cards'
                      : '1K Standard (1024×1024) for digital menus and social media'
                  }
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2 flex-1 sm:flex-initial">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              Aspect Ratio
            </label>
            <div className="flex bg-stone-950 p-1.5 rounded-xl border border-stone-800">
              {(['1:1', '4:3', '16:9', '3:4'] as AspectRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    aspectRatio === ratio
                      ? 'bg-stone-800 text-amber-300 font-bold border border-amber-500/40'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Model Affordance */}
          <div className="space-y-2 flex-1 sm:flex-initial">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Gemini Engine
            </label>
            <div className="flex bg-stone-950 p-1.5 rounded-xl border border-stone-800">
              <button
                type="button"
                onClick={() => setModel('gemini-3-pro-image-preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  model === 'gemini-3-pro-image-preview'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
                title="Flagship Studio model with up to 4K resolution"
              >
                3-Pro
              </button>
              <button
                type="button"
                onClick={() => setModel('gemini-3.1-flash-image-preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  model === 'gemini-3.1-flash-image-preview'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
                title="3.1-Flash Image model for fast generation & interactive retouching"
              >
                3.1-Flash
              </button>
            </div>
          </div>
        </div>

        {/* Batch Shoot Button */}
        <div className="flex items-center lg:self-end">
          <button
            type="button"
            disabled={isBatchShooting || totalDishes === 0}
            onClick={onBatchShoot}
            className={`w-full lg:w-auto px-5 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all ${
              isBatchShooting
                ? 'bg-stone-800 text-stone-400 cursor-not-allowed border border-stone-700'
                : totalDishes === 0
                ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 shadow-amber-900/30 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isBatchShooting ? (
              <>
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <span>
                  Shooting {batchProgress.current + 1} of {batchProgress.total}...
                </span>
              </>
            ) : shotCount === totalDishes && totalDishes > 0 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-stone-950 font-bold" />
                <span>Re-shoot Entire Menu ({totalDishes})</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-stone-950" />
                <span>Shoot Entire Menu ({totalDishes} Dishes)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Batch Progress Bar */}
      {isBatchShooting && (
        <div className="mt-4 pt-3 border-t border-stone-800/80">
          <div className="flex justify-between items-center text-xs text-stone-300 mb-1.5 font-medium">
            <span>
              Generating high-end {style} food photography at {resolution} resolution...
            </span>
            <span className="text-amber-400 font-bold">
              {Math.round(((batchProgress.current) / batchProgress.total) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
              style={{
                width: `${Math.max(5, (batchProgress.current / batchProgress.total) * 100)}%`,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
