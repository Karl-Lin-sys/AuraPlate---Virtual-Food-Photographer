import React, { useState } from 'react';
import { Upload, Sparkles, Plus, Trash2, Edit3, Check, FileText, Utensils, ChefHat, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Dish, MenuData, PhotographyStyle } from '../types';
import { PRESET_MENUS } from '../data/presets';

interface MenuUploadTabProps {
  menuData: MenuData;
  setMenuData: React.Dispatch<React.SetStateAction<MenuData>>;
  onGoToStudio: () => void;
  onParseMenuText: (text: string) => Promise<void>;
  isParsing: boolean;
  parseError: string | null;
}

export const MenuUploadTab: React.FC<MenuUploadTabProps> = ({
  menuData,
  setMenuData,
  onGoToStudio,
  onParseMenuText,
  isParsing,
  parseError,
}) => {
  const [pastedText, setPastedText] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('rustic-italian');
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  // New dish form state
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState('Mains');
  const [newDishPrice, setNewDishPrice] = useState('$24');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishIngredients, setNewDishIngredients] = useState('');
  const [newDishStyle, setNewDishStyle] = useState<PhotographyStyle>('rustic');
  const [newDishNotes, setNewDishNotes] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPastedText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_MENUS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setMenuData(preset.menu);
    setPastedText(preset.rawText);
  };

  const handleParse = async () => {
    if (!pastedText.trim()) return;
    await onParseMenuText(pastedText);
  };

  const handleDeleteDish = (dishId: string) => {
    setMenuData((prev) => ({
      ...prev,
      dishes: prev.dishes.filter((d) => d.id !== dishId),
    }));
  };

  const handleSaveDish = () => {
    if (!newDishName.trim()) return;

    const dishToSave: Dish = {
      id: editingDish ? editingDish.id : `dish-custom-${Date.now()}`,
      name: newDishName.trim(),
      category: newDishCategory.trim() || 'Mains',
      price: newDishPrice.trim() || '$20',
      description: newDishDesc.trim(),
      ingredients: newDishIngredients
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean),
      suggestedStyle: newDishStyle,
      photographyNotes: newDishNotes.trim(),
      status: editingDish ? editingDish.status : 'idle',
      generatedPhoto: editingDish ? editingDish.generatedPhoto : undefined,
    };

    if (editingDish) {
      setMenuData((prev) => ({
        ...prev,
        dishes: prev.dishes.map((d) => (d.id === editingDish.id ? dishToSave : d)),
      }));
    } else {
      setMenuData((prev) => ({
        ...prev,
        dishes: [...prev.dishes, dishToSave],
      }));
    }

    // Reset & close
    setShowAddDishModal(false);
    setEditingDish(null);
    setNewDishName('');
    setNewDishDesc('');
    setNewDishIngredients('');
    setNewDishNotes('');
  };

  const openEditModal = (dish: Dish) => {
    setEditingDish(dish);
    setNewDishName(dish.name);
    setNewDishCategory(dish.category);
    setNewDishPrice(dish.price);
    setNewDishDesc(dish.description);
    setNewDishIngredients(dish.ingredients.join(', '));
    setNewDishStyle(dish.suggestedStyle);
    setNewDishNotes(dish.photographyNotes || '');
    setShowAddDishModal(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 border border-stone-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <ChefHat className="w-3.5 h-3.5" />
            AI Culinary Photography Suite
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-100">
            Turn your text menu into <span className="text-amber-400 italic">Michelin-star</span> food photography.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-stone-300 leading-relaxed">
            Upload or paste your restaurant's text menu. AuraPlate's culinary AI parses your dishes, optimizes the food photography styling, and shoots high-resolution photos in <strong className="text-amber-300">Rustic/Dark</strong>, <strong className="text-amber-300">Bright/Modern</strong>, or <strong className="text-amber-300">Social Media</strong> aesthetics.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onGoToStudio}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all hover:scale-105"
            >
              <span>View Photo Studio ({menuData.dishes.length} Dishes)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-stone-400">or load a gourmet test menu below</span>
          </div>
        </div>
      </div>

      {/* Preset Restaurant Pickers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-stone-200 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-amber-400" />
            1-Click Sample Menus for Testing
          </h2>
          <span className="text-xs text-stone-400">Click any preset to load instantly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRESET_MENUS.map((preset) => {
            const isSelected = selectedPresetId === preset.id && menuData.restaurantName === preset.menu.restaurantName;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleLoadPreset(preset.id)}
                className={`text-left p-4 rounded-2xl border transition-all relative ${
                  isSelected
                    ? 'bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-950/30'
                    : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-800 text-amber-400 border border-stone-700">
                      {preset.cuisine}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-100 mt-2">{preset.name}</h3>
                  </div>
                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">{preset.description}</p>
                <div className="mt-3 text-[11px] text-stone-300 font-medium flex items-center justify-between border-t border-stone-800/80 pt-2">
                  <span>{preset.menu.dishes.length} Curated Dishes</span>
                  <span className="text-amber-400 font-semibold">Load Menu →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Text Parser / Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload / Text Area */}
        <div className="lg:col-span-7 bg-stone-900/80 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Upload or Paste Your Menu Text
            </h2>
            <label className="cursor-pointer text-xs font-medium text-stone-300 hover:text-amber-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 transition-colors border border-stone-700">
              <Upload className="w-3.5 h-3.5" />
              <span>Import .txt / .csv</span>
              <input type="file" accept=".txt,.csv,.json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <p className="text-xs text-stone-400 leading-relaxed">
            Paste any unstructured restaurant menu text, categories, descriptions, or prices. Gemini will extract every dish and formulate gourmet photography briefs automatically.
          </p>

          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            rows={9}
            placeholder={`Example:
L'Aura Bistro Menu
Starters:
- Pan-Seared Dayboat Scallops ($38): Sweet corn velouté, crispy pancetta lardons, watercress
Mains:
- Truffle Tagliatelle ($34): Foraged porcini, black winter truffle, browned butter, aged pecorino`}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3.5 text-xs sm:text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-mono resize-y"
          />

          {parseError && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-stone-500">
              {pastedText.length > 0 ? `${pastedText.split('\n').length} lines ready to parse` : 'No text entered'}
            </span>
            <button
              onClick={handleParse}
              disabled={isParsing || !pastedText.trim()}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                isParsing || !pastedText.trim()
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-900/30'
              }`}
            >
              {isParsing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Parsing Menu with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>Parse Menu with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Current Restaurant Info & Summary */}
        <div className="lg:col-span-5 bg-stone-900/80 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Restaurant Profile
              </h3>
              <button
                onClick={() => {
                  setEditingDish(null);
                  setNewDishName('');
                  setNewDishDesc('');
                  setNewDishIngredients('');
                  setNewDishNotes('');
                  setShowAddDishModal(true);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 border border-amber-500/20 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Dish
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={menuData.restaurantName}
                  onChange={(e) =>
                    setMenuData((prev) => ({ ...prev, restaurantName: e.target.value }))
                  }
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                  Cuisine Classification
                </label>
                <input
                  type="text"
                  value={menuData.cuisineType}
                  onChange={(e) =>
                    setMenuData((prev) => ({ ...prev, cuisineType: e.target.value }))
                  }
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-center">
                <span className="text-2xl font-bold font-serif text-amber-400">
                  {menuData.dishes.length}
                </span>
                <span className="text-[11px] text-stone-400 block mt-0.5">Total Dishes</span>
              </div>
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-center">
                <span className="text-2xl font-bold font-serif text-emerald-400">
                  {menuData.dishes.filter((d) => d.generatedPhoto).length}
                </span>
                <span className="text-[11px] text-stone-400 block mt-0.5">Photos Taken</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-800">
            <button
              onClick={onGoToStudio}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all"
            >
              <span>Enter Photo Shoot Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dish Inventory List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-stone-100 flex items-center gap-2">
            <span>Dishes Ready for Photography</span>
            <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">
              {menuData.dishes.length} Items
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuData.dishes.map((dish, idx) => (
            <div
              key={dish.id}
              className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-4 hover:border-stone-700 transition-all flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-500 font-mono">#{idx + 1}</span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                      {dish.category}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                        dish.suggestedStyle === 'rustic'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800/50'
                          : dish.suggestedStyle === 'bright'
                          ? 'bg-blue-950/60 text-blue-300 border border-blue-800/50'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                      }`}
                    >
                      {dish.suggestedStyle} Style
                    </span>
                  </div>
                  <span className="font-serif font-bold text-amber-400 text-sm">{dish.price}</span>
                </div>

                <h3 className="font-serif text-base font-bold text-stone-100 mt-2">{dish.name}</h3>
                <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                  {dish.description}
                </p>

                {dish.ingredients.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {dish.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-stone-950 text-stone-400 px-2 py-0.5 rounded-full border border-stone-800"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 text-xs">
                <div className="flex items-center gap-2">
                  {dish.generatedPhoto ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-medium text-[11px]">
                      <Check className="w-3.5 h-3.5" /> Photo Generated
                    </span>
                  ) : (
                    <span className="text-stone-500 text-[11px]">No photo yet</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(dish)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                    title="Edit Dish Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteDish(dish.id)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-stone-800 transition-colors"
                    title="Remove Dish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      {showAddDishModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-100">
                {editingDish ? 'Edit Dish' : 'Add New Dish to Shoot'}
              </h3>
              <button
                onClick={() => setShowAddDishModal(false)}
                className="text-stone-400 hover:text-stone-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 font-semibold block mb-1">Dish Name *</label>
                <input
                  type="text"
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="e.g. Pan-Seared Wagyu Ribeye"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-semibold block mb-1">Category</label>
                  <input
                    type="text"
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    placeholder="Mains, Starters, etc."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-semibold block mb-1">Price</label>
                  <input
                    type="text"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    placeholder="$28"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-semibold block mb-1">Description</label>
                <textarea
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  rows={2}
                  placeholder="Describe plating, textures, flavors, garnishes..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-stone-300 font-semibold block mb-1">Ingredients (comma-separated)</label>
                <input
                  type="text"
                  value={newDishIngredients}
                  onChange={(e) => setNewDishIngredients(e.target.value)}
                  placeholder="Wagyu beef, rosemary, maldon salt, truffle butter"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-stone-300 font-semibold block mb-1">Recommended Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['rustic', 'bright', 'social'] as PhotographyStyle[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewDishStyle(st)}
                      className={`py-1.5 px-2 rounded-lg capitalize font-medium text-xs border ${
                        newDishStyle === st
                          ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                          : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-semibold block mb-1">Photography Styling Notes</label>
                <input
                  type="text"
                  value={newDishNotes}
                  onChange={(e) => setNewDishNotes(e.target.value)}
                  placeholder="e.g. Cast iron skillet, rising steam, coarse salt"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setShowAddDishModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDish}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-md"
              >
                Save Dish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
