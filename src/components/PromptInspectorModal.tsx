import React, { useState } from 'react';
import { Sparkles, Camera, Sliders, RefreshCw, X, Check, Lightbulb } from 'lucide-react';
import { Dish, PhotographyStyle, ImageResolution, AspectRatio, ImageModel } from '../types';

interface PromptInspectorModalProps {
  dish: Dish;
  isOpen: boolean;
  onClose: () => void;
  onShootDish: (dishId: string, customPrompt?: string, styleOverride?: PhotographyStyle) => Promise<void>;
  globalStyle: PhotographyStyle;
  resolution: ImageResolution;
  model: ImageModel;
  aspectRatio: AspectRatio;
  isShooting: boolean;
}

export const PromptInspectorModal: React.FC<PromptInspectorModalProps> = ({
  dish,
  isOpen,
  onClose,
  onShootDish,
  globalStyle,
  resolution,
  model,
  aspectRatio,
  isShooting,
}) => {
  const [styleOverride, setStyleOverride] = useState<PhotographyStyle>(dish.suggestedStyle || globalStyle);
  const [customPrompt, setCustomPrompt] = useState<string>(() => {
    // Generate default photography prompt
    const desc = dish.description || dish.name;
    const notes = dish.photographyNotes ? ` Special plating notes: ${dish.photographyNotes}.` : '';
    return `Professional Michelin-star culinary photography of ${dish.name}. Plating: ${desc}.${notes} Ultra-high texture detail, mouth-watering appetizing food presentation.`;
  });

  const [suggestedIdeas, setSuggestedIdeas] = useState<
    Array<{ title: string; stylingProps: string[]; lighting: string; prompt: string }>
  >([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);

  if (!isOpen) return null;

  const handleFetchAiSuggestions = async () => {
    try {
      setIsFetchingSuggestions(true);
      const res = await fetch('/api/photo/suggest-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dishName: dish.name,
          description: dish.description,
          style: styleOverride,
        }),
      });
      const data = await res.json();
      if (data.ideas && Array.isArray(data.ideas)) {
        setSuggestedIdeas(data.ideas);
      }
    } catch (err) {
      console.error('Failed to get styling suggestions:', err);
    } finally {
      setIsFetchingSuggestions(false);
    }
  };

  const handleApplyIdea = (idea: { title: string; prompt: string }) => {
    setCustomPrompt(idea.prompt);
  };

  const handleConfirmShoot = async () => {
    await onShootDish(dish.id, customPrompt, styleOverride);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                <span>Culinary Photography Brief</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-sans font-normal">
                  {dish.name}
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Engine: <span className="text-amber-400 font-mono">{model}</span> • Size:{' '}
                <span className="text-amber-400 font-bold">{resolution}</span> • Aspect:{' '}
                <span className="text-stone-300">{aspectRatio}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Style Selector for this specific shot */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            Select Aesthetic for this Dish:
          </label>
          <div className="grid grid-cols-3 gap-2 bg-stone-950 p-1.5 rounded-xl border border-stone-800">
            {(['rustic', 'bright', 'social'] as PhotographyStyle[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStyleOverride(st)}
                className={`py-2 px-3 rounded-lg text-xs font-medium capitalize transition-all ${
                  styleOverride === st
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                {st === 'rustic'
                  ? '🌙 Rustic / Dark'
                  : st === 'bright'
                  ? '☀️ Bright / Modern'
                  : '📱 Social Media'}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-stone-300">
              Photographer Instructions & Plating Details
            </label>
            <button
              type="button"
              onClick={handleFetchAiSuggestions}
              disabled={isFetchingSuggestions}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
            >
              {isFetchingSuggestions ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Styling Ideas...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Suggest Creative Ideas</span>
                </>
              )}
            </button>
          </div>

          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={4}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs sm:text-sm text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 leading-relaxed font-sans resize-y"
          />
        </div>

        {/* AI Suggested Styling Concepts */}
        {suggestedIdeas.length > 0 && (
          <div className="space-y-2.5 pt-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              Creative Styling Ideas from Gemini:
            </label>
            <div className="grid grid-cols-1 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {suggestedIdeas.map((idea, idx) => (
                <div
                  key={idx}
                  onClick={() => handleApplyIdea(idea)}
                  className="p-3 rounded-xl bg-stone-950/70 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-950 cursor-pointer transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-stone-200 group-hover:text-amber-300">
                      {idea.title}
                    </span>
                    <span className="text-[10px] text-amber-400 font-medium">Click to use</span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1 line-clamp-2">
                    {idea.lighting} • Props: {idea.stylingProps.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-stone-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isShooting}
            onClick={handleConfirmShoot}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-950/40 flex items-center gap-2 transition-all"
          >
            {isShooting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Shooting Photo...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 font-bold" />
                <span>Shoot with this Brief</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
