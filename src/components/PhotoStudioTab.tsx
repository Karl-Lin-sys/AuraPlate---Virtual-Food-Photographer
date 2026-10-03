import React, { useState } from 'react';
import { Camera, Sparkles, Sliders, Download, Maximize2, RefreshCw, Check, AlertCircle, Info, Image as ImageIcon } from 'lucide-react';
import { Dish, PhotographyStyle, ImageResolution, AspectRatio, ImageModel } from '../types';
import { getSampleSvgForDish } from '../data/presets';
import { PromptInspectorModal } from './PromptInspectorModal';
import { PhotoZoomModal } from './PhotoZoomModal';
import { downloadImage } from '../utils/helpers';

interface PhotoStudioTabProps {
  dishes: Dish[];
  globalStyle: PhotographyStyle;
  resolution: ImageResolution;
  model: ImageModel;
  aspectRatio: AspectRatio;
  onShootDish: (dishId: string, customPrompt?: string, styleOverride?: PhotographyStyle) => Promise<void>;
  onOpenRetouch: (dish: Dish) => void;
  isBatchShooting: boolean;
}

export const PhotoStudioTab: React.FC<PhotoStudioTabProps> = ({
  dishes,
  globalStyle,
  resolution,
  model,
  aspectRatio,
  onShootDish,
  onOpenRetouch,
  isBatchShooting,
}) => {
  const [selectedDishForPrompt, setSelectedDishForPrompt] = useState<Dish | null>(null);
  const [zoomedDish, setZoomedDish] = useState<Dish | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  // Categories
  const categories = ['All', ...Array.from(new Set(dishes.map((d) => d.category)))];

  const filteredDishes =
    activeCategoryFilter === 'All'
      ? dishes
      : dishes.filter((d) => d.category === activeCategoryFilter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Category Filter Pills & Shoot Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider mr-1">
            Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategoryFilter === cat
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 text-xs text-stone-400 self-end sm:self-auto">
          <span>
            Showing <strong className="text-stone-200">{filteredDishes.length}</strong> dishes
          </span>
          <span className="text-stone-600">•</span>
          <span>
            Photos Shot:{' '}
            <strong className="text-amber-400">
              {dishes.filter((d) => d.generatedPhoto).length} / {dishes.length}
            </strong>
          </span>
        </div>
      </div>

      {/* Dish Studio Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDishes.map((dish) => {
          const hasPhoto = Boolean(dish.generatedPhoto);
          const photoUrl =
            dish.generatedPhoto?.url || getSampleSvgForDish(dish.name, dish.suggestedStyle || globalStyle);
          const isShootingThis = dish.status === 'generating';

          return (
            <div
              key={dish.id}
              className={`group bg-stone-900/80 border rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl ${
                dish.status === 'error'
                  ? 'border-red-900/60'
                  : hasPhoto
                  ? 'border-amber-500/30 hover:border-amber-500/60 shadow-amber-950/10'
                  : 'border-stone-800 hover:border-stone-700'
              }`}
            >
              {/* Photo Preview Container */}
              <div className="relative aspect-square w-full bg-stone-950 overflow-hidden">
                <img
                  src={photoUrl}
                  alt={dish.name}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    hasPhoto ? 'group-hover:scale-105' : 'opacity-85'
                  }`}
                />

                {/* Top Overlay Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-stone-200 border border-stone-700/80 shadow-sm">
                    {dish.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {hasPhoto ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/90 text-stone-950 flex items-center gap-1 shadow-sm">
                        <Check className="w-3 h-3 font-bold" />
                        {dish.generatedPhoto?.imageSize || resolution}
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-900/90 text-amber-300/90 border border-amber-500/20 backdrop-blur-sm">
                        Ready to Shoot
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Overlay Info on Photo */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent p-4 pt-10">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-amber-400 capitalize block">
                        {dish.generatedPhoto?.style || dish.suggestedStyle || globalStyle} Style
                      </span>
                      <h3 className="font-serif text-lg font-bold text-stone-100 drop-shadow-md line-clamp-1">
                        {dish.name}
                      </h3>
                    </div>
                    <span className="font-serif text-base font-bold text-amber-300 drop-shadow-md">
                      {dish.price}
                    </span>
                  </div>
                </div>

                {/* Quick Action Overlay (View zoom / Download) */}
                {hasPhoto && (
                  <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => setZoomedDish(dish)}
                      className="p-2.5 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-100 shadow-xl border border-stone-700 transition-transform hover:scale-110"
                      title="Inspect Full Image"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (dish.generatedPhoto) {
                          const filename = `${dish.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
                          downloadImage(dish.generatedPhoto.url, filename);
                        }
                      }}
                      className="p-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-xl transition-transform hover:scale-110"
                      title="Download Image"
                    >
                      <Download className="w-4 h-4 font-bold" />
                    </button>
                  </div>
                )}

                {/* Loading Spinner during shoot */}
                {isShootingThis && (
                  <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                    <div className="w-9 h-9 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <span className="text-xs font-bold text-amber-300">
                      Shooting {resolution} Photo...
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 max-w-[200px]">
                      Applying {dish.suggestedStyle || globalStyle} chiaroscuro & food styling
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>

                  {dish.photographyNotes && (
                    <div className="mt-2.5 p-2 rounded-xl bg-stone-950/70 border border-stone-800/80 text-[11px] text-stone-400 flex items-start gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{dish.photographyNotes}</span>
                    </div>
                  )}

                  {dish.status === 'error' && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span className="text-[11px]">{dish.error || 'Failed to capture photo'}</span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-stone-800">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={isShootingThis || isBatchShooting}
                      onClick={() => onShootDish(dish.id, undefined, dish.suggestedStyle || globalStyle)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        isShootingThis
                          ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          : hasPhoto
                          ? 'bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700'
                          : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md shadow-amber-950/30'
                      }`}
                    >
                      {hasPhoto ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Re-shoot</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-3.5 h-3.5" />
                          <span>Shoot Dish</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenRetouch(dish)}
                      className="py-2 px-3 rounded-xl font-semibold text-xs bg-stone-950 hover:bg-stone-850 text-amber-300 border border-amber-500/20 hover:border-amber-500/40 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>AI Retouch</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedDishForPrompt(dish)}
                    className="w-full py-1.5 rounded-lg text-[11px] font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-950 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Sliders className="w-3 h-3 text-amber-400" />
                    <span>Customize Camera & Plating Brief</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {selectedDishForPrompt && (
        <PromptInspectorModal
          dish={selectedDishForPrompt}
          isOpen={Boolean(selectedDishForPrompt)}
          onClose={() => setSelectedDishForPrompt(null)}
          onShootDish={onShootDish}
          globalStyle={globalStyle}
          resolution={resolution}
          model={model}
          aspectRatio={aspectRatio}
          isShooting={selectedDishForPrompt.status === 'generating'}
        />
      )}

      {zoomedDish && (
        <PhotoZoomModal
          dish={zoomedDish}
          isOpen={Boolean(zoomedDish)}
          onClose={() => setZoomedDish(null)}
          onOpenRetouch={onOpenRetouch}
        />
      )}
    </div>
  );
};
