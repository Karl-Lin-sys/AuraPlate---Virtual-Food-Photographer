import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, History, Download, ArrowLeft, ArrowRight, Check, AlertCircle, Eye, Sliders, CornerDownLeft } from 'lucide-react';
import { Dish, ImageModel, ImageResolution, PhotoHistoryEntry } from '../types';
import { getSampleSvgForDish } from '../data/presets';
import { downloadImage } from '../utils/helpers';

interface AIRetouchTabProps {
  dishes: Dish[];
  activeDishId: string | null;
  setActiveDishId: (id: string) => void;
  onEditPhoto: (dishId: string, instruction: string, model: ImageModel) => Promise<void>;
  onCreateNewPhotoFromPrompt: (dishId: string, prompt: string, model: ImageModel) => Promise<void>;
  isEditing: boolean;
  editError: string | null;
  resolution: ImageResolution;
}

const QUICK_RETOUCH_PRESETS = [
  { label: '🌿 Add fresh herb & coarse salt garnish', prompt: 'Add fresh sprigs of micro-herbs, thyme leaves, and sprinkled coarse sea salt crystals over the dish.' },
  { label: '🔥 Add appetizing rising steam', prompt: 'Add delicate, realistic translucent steam gently wafting up from the hot plated dish.' },
  { label: '🍷 Add glass of red wine in soft background', prompt: 'In the soft background bokeh, place an elegant stemmed glass of deep ruby red wine on the table.' },
  { label: '🧀 Sprinkle microplaned parmesan snow', prompt: 'Dust the dish with delicate, freshly grated parmesan cheese shavings and cracked black peppercorns.' },
  { label: '✨ Make sauce glossy & intensify sear marks', prompt: 'Enhance the rich glossy sheen of the pan sauce reduction and sharpen the golden caramelized sear marks.' },
  { label: '🍽️ Swap plate to dark artisan ceramic', prompt: 'Change the tableware to a handcrafted matte charcoal ceramic plate with organic curved edges.' },
];

export const AIRetouchTab: React.FC<AIRetouchTabProps> = ({
  dishes,
  activeDishId,
  setActiveDishId,
  onEditPhoto,
  onCreateNewPhotoFromPrompt,
  isEditing,
  editError,
  resolution,
}) => {
  const currentDish = dishes.find((d) => d.id === activeDishId) || dishes[0];
  const [instruction, setInstruction] = useState('');
  const [model, setModel] = useState<ImageModel>('gemini-3.1-flash-image-preview');
  const [viewMode, setViewMode] = useState<'current' | 'split' | 'history'>('current');
  const [selectedHistoryImage, setSelectedHistoryImage] = useState<string | null>(null);

  if (!currentDish) {
    return (
      <div className="text-center py-16 bg-stone-900/60 rounded-3xl border border-stone-800 max-w-xl mx-auto p-6">
        <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h3 className="font-serif text-xl font-bold text-stone-100">No Dishes Available</h3>
        <p className="text-xs text-stone-400 mt-2">
          Upload or parse a menu first to begin AI photo editing and retouching.
        </p>
      </div>
    );
  }

  const currentPhoto = currentDish.generatedPhoto;
  const currentPhotoUrl =
    currentPhoto?.url || getSampleSvgForDish(currentDish.name, currentDish.suggestedStyle);

  const editHistory = currentPhoto?.editHistory || [];

  const handleApplyInstruction = async (textToApply?: string) => {
    const text = textToApply || instruction;
    if (!text.trim()) return;

    if (currentPhoto?.url) {
      await onEditPhoto(currentDish.id, text.trim(), model);
    } else {
      // Create new photo using prompt
      await onCreateNewPhotoFromPrompt(currentDish.id, text.trim(), model);
    }
    setInstruction('');
  };

  const handleDownloadActive = () => {
    const url = selectedHistoryImage || currentPhotoUrl;
    const filename = `${currentDish.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_retouched.png`;
    downloadImage(url, filename);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Retouch Studio Header */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-amber-900/30">
              <Wand2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">
                  AI Culinary Retouch Studio
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Text-to-Edit Engine
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Directly instruct the AI photographer to modify props, steam, garnishes, lighting, and plating using natural language prompts.
              </p>
            </div>
          </div>

          {/* Model & Dish Pickers */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Dish selector */}
            <div className="flex items-center space-x-2">
              <label className="text-xs text-stone-400 font-semibold">Active Dish:</label>
              <select
                value={currentDish.id}
                onChange={(e) => {
                  setActiveDishId(e.target.value);
                  setSelectedHistoryImage(null);
                }}
                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              >
                {dishes.map((dish) => (
                  <option key={dish.id} value={dish.id}>
                    {dish.name} ({dish.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Model switcher */}
            <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-800">
              <button
                type="button"
                onClick={() => setModel('gemini-3.1-flash-image-preview')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  model === 'gemini-3.1-flash-image-preview'
                    ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="gemini-3.1-flash-image-preview: Specialized for text-prompted photo retouching & iteration"
              >
                3.1-Flash (Fast Edit)
              </button>
              <button
                type="button"
                onClick={() => setModel('gemini-3-pro-image-preview')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  model === 'gemini-3-pro-image-preview'
                    ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="gemini-3-pro-image-preview: High-resolution pro generation"
              >
                3-Pro (1K-4K)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Canvas & Editor Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Display (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900/80 border border-stone-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
          {/* Canvas Controls Header */}
          <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                {currentDish.category} • {currentDish.price}
              </span>
              <h2 className="font-serif text-lg font-bold text-stone-100">{currentDish.name}</h2>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
                <button
                  onClick={() => {
                    setViewMode('current');
                    setSelectedHistoryImage(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    viewMode === 'current'
                      ? 'bg-stone-800 text-amber-300 font-bold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Latest
                </button>
                {editHistory.length > 0 && (
                  <button
                    onClick={() => setViewMode('history')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      viewMode === 'history'
                        ? 'bg-stone-800 text-amber-300 font-bold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    History ({editHistory.length})
                  </button>
                )}
              </div>

              <button
                onClick={handleDownloadActive}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                title="Download Photo"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image Display */}
          <div className="relative aspect-square w-full bg-stone-950 rounded-2xl overflow-hidden flex items-center justify-center border border-stone-800/60 shadow-inner">
            <img
              src={selectedHistoryImage || currentPhotoUrl}
              alt={currentDish.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Editing loading overlay */}
            {isEditing && (
              <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                <span className="text-sm font-bold text-amber-300">
                  Retouching with {model}...
                </span>
                <span className="text-xs text-stone-400 mt-1 max-w-xs">
                  Modifying culinary lighting, steam, garnishes, and tableware as requested
                </span>
              </div>
            )}

            {/* Watermark/Status Pill */}
            <div className="absolute bottom-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-stone-800 text-[11px] text-stone-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>
                {selectedHistoryImage
                  ? 'Historical Version'
                  : currentPhoto
                  ? `Active Shot (${currentPhoto.imageSize || resolution})`
                  : 'Sample Visual (Edit to Generate)'}
              </span>
            </div>
          </div>

          {/* History Timeline thumbnail row */}
          {editHistory.length > 0 && (
            <div className="pt-2 border-t border-stone-800">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-amber-400" />
                Retouch History Timeline
              </label>
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {editHistory.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedHistoryImage(item.url);
                      setViewMode('history');
                    }}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-transform hover:scale-105 relative ${
                      selectedHistoryImage === item.url
                        ? 'border-amber-400 ring-2 ring-amber-500/30'
                        : 'border-stone-800 opacity-70 hover:opacity-100'
                    }`}
                    title={item.instruction}
                  >
                    <img
                      src={item.url}
                      alt={`Edit ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0.5 right-0.5 text-[9px] bg-stone-950/90 text-stone-200 px-1 rounded font-bold font-mono">
                      #{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Retouch Prompt & Presets Panel (5 cols) */}
        <div className="lg:col-span-5 bg-stone-900/80 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Prompt Retouching Instructions
              </h3>
              <span className="text-[11px] font-mono text-stone-400">
                {model === 'gemini-3.1-flash-image-preview' ? 'gemini-3.1-flash' : 'gemini-3-pro'}
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Describe any culinary adjustment in plain English. The AI food photographer will modify the image while keeping the dish delicious and authentic.
            </p>

            {/* Prompt Text Input */}
            <div className="space-y-2">
              <div className="relative">
                <textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleApplyInstruction();
                    }
                  }}
                  rows={4}
                  placeholder="e.g. Add a generous dusting of shaved black winter truffle and enhance the golden sear on the meat..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3.5 text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-y leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-500">
                  Tip: Press <kbd className="bg-stone-800 px-1 py-0.5 rounded text-[10px]">Ctrl+Enter</kbd> to submit
                </span>
                <button
                  type="button"
                  disabled={isEditing || !instruction.trim()}
                  onClick={() => handleApplyInstruction()}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isEditing || !instruction.trim()
                      ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md shadow-amber-950/30'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Retouching...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Apply Edit</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            {/* Quick 1-Click Retouch Presets */}
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block">
                Popular Chef Retouch Ideas:
              </label>
              <div className="space-y-2">
                {QUICK_RETOUCH_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isEditing}
                    onClick={() => {
                      setInstruction(preset.prompt);
                      handleApplyInstruction(preset.prompt);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-stone-950/70 border border-stone-800/80 hover:border-amber-500/40 hover:bg-stone-950 text-stone-300 text-xs transition-all flex items-center justify-between group"
                  >
                    <span className="font-medium group-hover:text-amber-300">
                      {preset.label}
                    </span>
                    <span className="text-[10px] text-amber-500/80 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Apply →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-800/80 text-center">
            <span className="text-[11px] text-stone-500">
              Model: <strong className="text-stone-300">{model}</strong> • Target: {resolution}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
