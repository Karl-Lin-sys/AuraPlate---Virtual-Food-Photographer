import React from 'react';
import { X, Download, Sparkles, Sliders, CheckCircle } from 'lucide-react';
import { Dish } from '../types';
import { downloadImage } from '../utils/helpers';

interface PhotoZoomModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRetouch: (dish: Dish) => void;
}

export const PhotoZoomModal: React.FC<PhotoZoomModalProps> = ({
  dish,
  isOpen,
  onClose,
  onOpenRetouch,
}) => {
  if (!isOpen || !dish || !dish.generatedPhoto) return null;

  const photo = dish.generatedPhoto;

  const handleDownload = () => {
    const filename = `${dish.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${photo.imageSize}.png`;
    downloadImage(photo.url, filename);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-800 bg-stone-950/60">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
              {dish.category} • {photo.style} Aesthetic
            </span>
            <h3 className="font-serif text-xl font-bold text-stone-100">{dish.name}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onOpenRetouch(dish);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-amber-500/20 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Retouch</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ({photo.imageSize})</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image Display */}
        <div className="flex-1 bg-stone-950 flex items-center justify-center p-4 overflow-hidden relative">
          <img
            src={photo.url}
            alt={dish.name}
            referrerPolicy="no-referrer"
            className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-2xl"
          />
        </div>

        {/* Photo Metadata Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-800 bg-stone-900/90 text-xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3 text-stone-400">
            <div className="flex items-center gap-4">
              <span>
                Engine: <strong className="text-stone-200 font-mono">{photo.modelUsed}</strong>
              </span>
              <span>
                Resolution: <strong className="text-amber-400">{photo.imageSize}</strong>
              </span>
              <span>
                Aspect Ratio: <strong className="text-stone-200">{photo.aspectRatio}</strong>
              </span>
            </div>
            <span className="font-serif font-bold text-amber-400 text-base">{dish.price}</span>
          </div>

          <div className="text-[11px] text-stone-400 line-clamp-2 bg-stone-950 p-2.5 rounded-lg border border-stone-800/80">
            <span className="text-amber-400 font-semibold">Prompt: </span>
            {photo.promptUsed}
          </div>
        </div>
      </div>
    </div>
  );
};
