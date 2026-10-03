import React, { useState } from 'react';
import { Dish, MenuData } from '../types';
import { getSampleSvgForDish } from '../data/presets';
import { Eye, Moon, Sun, Smartphone, Sparkles, Printer, Check, Star } from 'lucide-react';

interface DigitalMenuTabProps {
  menuData: MenuData;
  onOpenRetouch: (dish: Dish) => void;
  onGoToExport: () => void;
}

type MenuTheme = 'luxury-dark' | 'modern-light' | 'social-delivery';

export const DigitalMenuTab: React.FC<DigitalMenuTabProps> = ({
  menuData,
  onOpenRetouch,
  onGoToExport,
}) => {
  const [theme, setTheme] = useState<MenuTheme>('luxury-dark');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(menuData.dishes.map((d) => d.category)))];

  const filteredDishes =
    selectedCategory === 'All'
      ? menuData.dishes
      : menuData.dishes.filter((d) => d.category === selectedCategory);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Bar with Theme Toggles */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            Live Customer Experience Preview
          </span>
          <h2 className="font-serif text-xl font-bold text-stone-100">
            Digital Menu Presentation
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Theme Switcher */}
          <div className="flex bg-stone-950 p-1.5 rounded-2xl border border-stone-800 text-xs">
            <button
              onClick={() => setTheme('luxury-dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                theme === 'luxury-dark'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Michelin Dark</span>
            </button>
            <button
              onClick={() => setTheme('modern-light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                theme === 'modern-light'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Modern Bistro</span>
            </button>
            <button
              onClick={() => setTheme('social-delivery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                theme === 'social-delivery'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Delivery App</span>
            </button>
          </div>

          <button
            onClick={onGoToExport}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-amber-500/20 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Layout</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Themed Preview Canvas Container */}
      <div
        className={`rounded-3xl p-6 sm:p-10 transition-all duration-300 shadow-2xl border ${
          theme === 'luxury-dark'
            ? 'bg-stone-950 border-stone-800 text-stone-100'
            : theme === 'modern-light'
            ? 'bg-stone-50 border-stone-200 text-stone-900'
            : 'bg-stone-900 border-stone-800 text-stone-100'
        }`}
      >
        {/* Restaurant Header in Theme */}
        <div className="text-center max-w-2xl mx-auto mb-10 pb-8 border-b border-current/10">
          <span
            className={`text-xs font-semibold uppercase tracking-widest block mb-2 ${
              theme === 'luxury-dark'
                ? 'text-amber-400'
                : theme === 'modern-light'
                ? 'text-amber-700'
                : 'text-amber-400'
            }`}
          >
            {menuData.cuisineType}
          </span>
          <h1
            className={`font-serif text-3xl sm:text-5xl font-bold tracking-tight ${
              theme === 'modern-light' ? 'text-stone-900' : 'text-stone-100'
            }`}
          >
            {menuData.restaurantName}
          </h1>
          <p
            className={`text-xs sm:text-sm mt-3 leading-relaxed ${
              theme === 'modern-light' ? 'text-stone-600' : 'text-stone-400'
            }`}
          >
            Seasonal tasting menu prepared with artisan ingredients, photographed by AuraPlate.
          </p>
        </div>

        {/* Layout per Theme */}
        {theme === 'social-delivery' ? (
          /* Mobile / Delivery App Style Feed */
          <div className="max-w-2xl mx-auto space-y-4">
            {filteredDishes.map((dish) => {
              const photoUrl =
                dish.generatedPhoto?.url || getSampleSvgForDish(dish.name, dish.suggestedStyle);
              return (
                <div
                  key={dish.id}
                  className="bg-stone-950 border border-stone-800 rounded-2xl p-4 flex gap-4 items-center shadow-lg hover:border-amber-500/40 transition-all"
                >
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-stone-900 shrink-0">
                    <img
                      src={photoUrl}
                      alt={dish.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {dish.generatedPhoto && (
                      <span className="absolute top-1.5 left-1.5 bg-amber-500 text-stone-950 text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        HD
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between h-full space-y-1.5">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase text-amber-400">
                          {dish.category}
                        </span>
                        <div className="flex items-center text-amber-400 text-xs gap-1 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>4.9</span>
                        </div>
                      </div>
                      <h3 className="font-serif text-base font-bold text-stone-100">{dish.name}</h3>
                      <p className="text-xs text-stone-400 line-clamp-2 mt-0.5">
                        {dish.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-serif text-base font-bold text-amber-400">
                        {dish.price}
                      </span>
                      <button
                        onClick={() => onOpenRetouch(dish)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-750 text-amber-300 font-medium transition-colors"
                      >
                        Retouch Photo
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Grid Card Layout (Luxury Dark or Modern Light) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDishes.map((dish) => {
              const photoUrl =
                dish.generatedPhoto?.url || getSampleSvgForDish(dish.name, dish.suggestedStyle);

              return (
                <div
                  key={dish.id}
                  className={`rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                    theme === 'luxury-dark'
                      ? 'bg-stone-900/60 border border-stone-800/80 hover:border-amber-500/50 shadow-xl'
                      : 'bg-white border border-stone-200 hover:border-stone-400 shadow-md'
                  }`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
                    <img
                      src={photoUrl}
                      alt={dish.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-md ${
                          theme === 'luxury-dark'
                            ? 'bg-stone-950/80 text-amber-300 border border-amber-500/20'
                            : 'bg-white/90 text-stone-800 border border-stone-200'
                        }`}
                      >
                        {dish.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={`font-serif text-lg font-bold ${
                            theme === 'luxury-dark' ? 'text-stone-100' : 'text-stone-900'
                          }`}
                        >
                          {dish.name}
                        </h3>
                        <span
                          className={`font-serif text-base font-bold whitespace-nowrap ${
                            theme === 'luxury-dark' ? 'text-amber-400' : 'text-amber-700'
                          }`}
                        >
                          {dish.price}
                        </span>
                      </div>
                      <p
                        className={`text-xs mt-1.5 line-clamp-3 leading-relaxed ${
                          theme === 'luxury-dark' ? 'text-stone-400' : 'text-stone-600'
                        }`}
                      >
                        {dish.description}
                      </p>
                    </div>

                    {dish.ingredients.length > 0 && (
                      <div className="pt-2 border-t border-current/10 flex flex-wrap gap-1">
                        {dish.ingredients.slice(0, 4).map((ing, i) => (
                          <span
                            key={i}
                            className={`text-[10px] px-2 py-0.5 rounded-full ${
                              theme === 'luxury-dark'
                                ? 'bg-stone-950 text-stone-400'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
