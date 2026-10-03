import React, { useState } from 'react';
import { Download, Printer, Share2, Sparkles, Check, FileText, Layers, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { MenuData, ImageResolution } from '../types';
import { getSampleSvgForDish } from '../data/presets';
import { downloadImage } from '../utils/helpers';

interface ExportStudioTabProps {
  menuData: MenuData;
  activeResolution: ImageResolution;
}

export const ExportStudioTab: React.FC<ExportStudioTabProps> = ({
  menuData,
  activeResolution,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [printTheme, setPrintTheme] = useState<'classic-ivory' | 'charcoal-noir'>('classic-ivory');

  const photosCount = menuData.dishes.filter((d) => d.generatedPhoto).length;

  const handleDownloadAllPhotos = () => {
    // Download each generated photo or sample photo
    menuData.dishes.forEach((dish, idx) => {
      const url =
        dish.generatedPhoto?.url || getSampleSvgForDish(dish.name, dish.suggestedStyle);
      const safeName = dish.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const filename = `${safeName}_${activeResolution}.png`;
      setTimeout(() => {
        downloadImage(url, filename);
      }, idx * 250);
    });

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Download className="w-3.5 h-3.5" />
              High-Resolution Export Suite
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
              Export Food Photography & Print Menus
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl">
              Export ready-to-use photography for UberEats, DoorDash, your restaurant website, Instagram, and physical tabletop print menus in {activeResolution} resolution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadAllPhotos}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all hover:scale-105"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 font-bold" />
                  <span>All Photos Exported!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 font-bold" />
                  <span>Download All Photos ({menuData.dishes.length} Files)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-100">
            Delivery Apps & Website
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Standard 1K and 2K web-optimized images formatted for UberEats, DoorDash, Toast POS, and Squarespace restaurant menus.
          </p>
          <div className="text-[11px] text-amber-400 font-semibold pt-2">
            ✓ 1:1 Aspect Ratio Compatible
          </div>
        </div>

        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            <Share2 className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-100">
            Instagram & Social Media
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Vivid top-down flat-lay and 45° hero angles ideal for Instagram grid posts, food blogger reels, and TikTok culinary showcases.
          </p>
          <div className="text-[11px] text-amber-400 font-semibold pt-2">
            ✓ Flat-Lay & Chiaroscuro Ready
          </div>
        </div>

        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            <Printer className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-100">
            Physical Print Menus
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            High DPI resolution (up to 4K Ultra) suitable for laminated tabletop cards, tasting booklets, and fine dining leather-bound folios.
          </p>
          <div className="text-[11px] text-amber-400 font-semibold pt-2">
            ✓ Up to 4K Print Quality
          </div>
        </div>
      </div>

      {/* Printable Menu Card Preview & Formatter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-100 flex items-center gap-2">
              <Printer className="w-5 h-5 text-amber-400" />
              <span>Tabletop Print-Ready Menu Card</span>
            </h2>
            <p className="text-xs text-stone-400">
              Preview and export a stylized restaurant menu sheet.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPrintTheme('classic-ivory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                printTheme === 'classic-ivory'
                  ? 'bg-amber-100 text-stone-900 shadow'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200'
              }`}
            >
              Classic Ivory
            </button>
            <button
              onClick={() => setPrintTheme('charcoal-noir')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                printTheme === 'charcoal-noir'
                  ? 'bg-stone-800 text-amber-300 shadow'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200'
              }`}
            >
              Charcoal Noir
            </button>
          </div>
        </div>

        {/* The Print Sheet Container */}
        <div
          id="printable-menu-sheet"
          className={`max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 shadow-2xl transition-colors ${
            printTheme === 'classic-ivory'
              ? 'bg-[#fdfaf5] text-stone-900 border-2 border-stone-300 font-serif'
              : 'bg-stone-950 text-stone-100 border border-stone-800 font-serif'
          }`}
        >
          {/* Header on Menu */}
          <div className="text-center pb-8 border-b-2 border-current/20 max-w-lg mx-auto">
            <div className="text-[11px] uppercase tracking-widest font-sans font-semibold mb-1 opacity-70">
              {menuData.cuisineType}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {menuData.restaurantName}
            </h1>
            <p className="text-xs font-sans mt-2 opacity-75">
              Tasting Menu • High-End Culinary Photography Edition
            </p>
          </div>

          {/* Dishes in 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            {menuData.dishes.map((dish) => {
              const photoUrl =
                dish.generatedPhoto?.url || getSampleSvgForDish(dish.name, dish.suggestedStyle);

              return (
                <div key={dish.id} className="flex gap-4 items-start">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 shadow-md border border-current/15">
                    <img
                      src={photoUrl}
                      alt={dish.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-baseline justify-between gap-2 border-b border-dotted border-current/30 pb-1">
                      <h4 className="text-base font-bold leading-tight">{dish.name}</h4>
                      <span className="font-bold text-sm whitespace-nowrap">{dish.price}</span>
                    </div>
                    <p className="text-[11px] font-sans opacity-70 leading-relaxed line-clamp-2">
                      {dish.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="text-center pt-10 mt-10 border-t border-current/20 text-[10px] font-sans opacity-60">
            {menuData.restaurantName} • Photographed with AuraPlate AI Food Photography Suite
          </div>
        </div>
      </div>
    </div>
  );
};
