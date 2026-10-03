/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { GlobalShootControls } from './components/GlobalShootControls';
import { MenuUploadTab } from './components/MenuUploadTab';
import { PhotoStudioTab } from './components/PhotoStudioTab';
import { AIRetouchTab } from './components/AIRetouchTab';
import { DigitalMenuTab } from './components/DigitalMenuTab';
import { ExportStudioTab } from './components/ExportStudioTab';
import { PRESET_MENUS, getSampleSvgForDish } from './data/presets';
import { AspectRatio, Dish, ImageModel, ImageResolution, MenuData, PhotographyStyle } from './types';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'menu' | 'studio' | 'retouch' | 'digital-menu' | 'export'>('studio');

  // Menu State (Initialized with Tuscan Trattoria preset)
  const [menuData, setMenuData] = useState<MenuData>(PRESET_MENUS[0].menu);

  // Global Shoot Controls
  const [activeStyle, setActiveStyle] = useState<PhotographyStyle>('rustic');
  const [activeResolution, setActiveResolution] = useState<ImageResolution>('1K');
  const [activeModel, setActiveModel] = useState<ImageModel>('gemini-3-pro-image-preview');
  const [activeAspectRatio, setActiveAspectRatio] = useState<AspectRatio>('1:1');

  // Retouch Studio Active Selection
  const [activeRetouchDishId, setActiveRetouchDishId] = useState<string | null>(menuData.dishes[0]?.id || null);

  // Async Operation States
  const [isParsingMenu, setIsParsingMenu] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const [isBatchShooting, setIsBatchShooting] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // 1. Parse Menu API handler
  const handleParseMenuText = async (text: string) => {
    try {
      setIsParsingMenu(true);
      setParseError(null);

      const response = await fetch('/api/menu/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuText: text }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to parse menu text');
      }

      if (data.dishes && Array.isArray(data.dishes)) {
        setMenuData({
          restaurantName: data.restaurantName || menuData.restaurantName,
          cuisineType: data.cuisineType || menuData.cuisineType,
          dishes: data.dishes.map((dish: any) => ({
            ...dish,
            status: 'idle',
            suggestedStyle: dish.suggestedStyle || activeStyle,
          })),
        });

        if (data.dishes[0]) {
          setActiveRetouchDishId(data.dishes[0].id);
        }

        showToast(`Successfully parsed ${data.dishes.length} dishes for ${data.restaurantName}!`, 'success');
        setActiveTab('studio');
      }
    } catch (err: any) {
      console.error('Menu parse failure:', err);
      setParseError(err.message || 'Error parsing menu');
      showToast(err.message || 'Error parsing menu', 'error');
    } finally {
      setIsParsingMenu(false);
    }
  };

  // 2. Shoot Single Dish Photo
  const handleShootDish = async (dishId: string, customPrompt?: string, styleOverride?: PhotographyStyle) => {
    const targetDish = menuData.dishes.find((d) => d.id === dishId);
    if (!targetDish) return;

    // Mark as generating
    setMenuData((prev) => ({
      ...prev,
      dishes: prev.dishes.map((d) =>
        d.id === dishId ? { ...d, status: 'generating', error: undefined } : d
      ),
    }));

    const styleToUse = styleOverride || targetDish.suggestedStyle || activeStyle;

    try {
      const response = await fetch('/api/photo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dishName: targetDish.name,
          description: targetDish.description,
          style: styleToUse,
          customPrompt,
          model: activeModel,
          imageSize: activeResolution,
          aspectRatio: activeAspectRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.imageUrl) {
        throw new Error(data.error || 'Photo capture failed');
      }

      setMenuData((prev) => ({
        ...prev,
        dishes: prev.dishes.map((d) => {
          if (d.id === dishId) {
            return {
              ...d,
              status: 'done',
              generatedPhoto: {
                url: data.imageUrl,
                modelUsed: data.modelUsed || activeModel,
                imageSize: activeResolution,
                aspectRatio: activeAspectRatio,
                style: styleToUse,
                promptUsed: data.promptUsed || customPrompt || targetDish.name,
                editHistory: [
                  {
                    url: data.imageUrl,
                    instruction: `Initial shoot (${activeResolution}, ${styleToUse} style)`,
                    timestamp: Date.now(),
                    modelUsed: data.modelUsed || activeModel,
                  },
                ],
              },
            };
          }
          return d;
        }),
      }));

      showToast(`Captured high-res photo for "${targetDish.name}"!`, 'success');
    } catch (err: any) {
      console.error('Shoot error:', err);
      const isQuota = String(err.message || '').includes('quota') || String(err.message || '').includes('429');
      const errorMsg = isQuota
        ? 'Gemini Image Quota reached. Using culinary styling preview.'
        : err.message || 'Generation failed';

      // Fallback to high-fidelity SVG illustration if quota limit
      const fallbackUrl = getSampleSvgForDish(targetDish.name, styleToUse);

      setMenuData((prev) => ({
        ...prev,
        dishes: prev.dishes.map((d) => {
          if (d.id === dishId) {
            return {
              ...d,
              status: 'done',
              error: isQuota ? 'API quota limit: fallback applied' : errorMsg,
              generatedPhoto: {
                url: fallbackUrl,
                modelUsed: `${activeModel} (Styling Simulation)`,
                imageSize: activeResolution,
                aspectRatio: activeAspectRatio,
                style: styleToUse,
                promptUsed: `Culinary styling of ${targetDish.name} in ${styleToUse} aesthetic`,
                editHistory: [
                  {
                    url: fallbackUrl,
                    instruction: `Styling preview (${styleToUse})`,
                    timestamp: Date.now(),
                    modelUsed: 'AuraPlate Engine',
                  },
                ],
              },
            };
          }
          return d;
        }),
      }));

      showToast(isQuota ? 'Quota limit: simulated culinary visual loaded.' : errorMsg, 'info');
    }
  };

  // 3. Batch Shoot Entire Menu
  const handleBatchShoot = async () => {
    if (menuData.dishes.length === 0 || isBatchShooting) return;

    setIsBatchShooting(true);
    setBatchProgress({ current: 0, total: menuData.dishes.length });

    for (let i = 0; i < menuData.dishes.length; i++) {
      const dish = menuData.dishes[i];
      setBatchProgress({ current: i, total: menuData.dishes.length });
      await handleShootDish(dish.id, undefined, activeStyle);
      // Brief pause between requests to prevent aggressive throttling
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setIsBatchShooting(false);
    showToast(`Completed photo shoot for all ${menuData.dishes.length} dishes!`, 'success');
  };

  // 4. AI Retouching API handler (gemini-3.1-flash-image-preview)
  const handleEditPhoto = async (dishId: string, instruction: string, model: ImageModel) => {
    const targetDish = menuData.dishes.find((d) => d.id === dishId);
    if (!targetDish || !targetDish.generatedPhoto?.url) return;

    setIsEditingPhoto(true);
    setEditError(null);

    try {
      const response = await fetch('/api/photo/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Image: targetDish.generatedPhoto.url,
          instruction,
          model,
          imageSize: activeResolution,
          aspectRatio: activeAspectRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.imageUrl) {
        throw new Error(data.error || 'Failed to retouch image');
      }

      setMenuData((prev) => ({
        ...prev,
        dishes: prev.dishes.map((d) => {
          if (d.id === dishId && d.generatedPhoto) {
            const newHistory = [
              ...d.generatedPhoto.editHistory,
              {
                url: data.imageUrl,
                instruction,
                timestamp: Date.now(),
                modelUsed: data.modelUsed || model,
              },
            ];

            return {
              ...d,
              generatedPhoto: {
                ...d.generatedPhoto,
                url: data.imageUrl,
                modelUsed: data.modelUsed || model,
                editHistory: newHistory,
              },
            };
          }
          return d;
        }),
      }));

      showToast(`Retouch complete: "${instruction.slice(0, 35)}..."!`, 'success');
    } catch (err: any) {
      console.error('Retouch error:', err);
      setEditError(err.message || 'Retouching failed');
      showToast(err.message || 'Retouching failed', 'error');
    } finally {
      setIsEditingPhoto(false);
    }
  };

  // 5. Create new photo from scratch using text prompt
  const handleCreateNewPhotoFromPrompt = async (dishId: string, prompt: string, model: ImageModel) => {
    await handleShootDish(dishId, prompt, activeStyle);
  };

  const handleOpenRetouch = (dish: Dish) => {
    setActiveRetouchDishId(dish.id);
    setActiveTab('retouch');
  };

  const shotDishesCount = menuData.dishes.filter((d) => d.generatedPhoto).length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        restaurantName={menuData.restaurantName}
        cuisineType={menuData.cuisineType}
        totalDishes={menuData.dishes.length}
        shotDishesCount={shotDishesCount}
        activeModel={activeModel}
        activeResolution={activeResolution}
        activeStyle={activeStyle}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Persistent Global Shoot Controls Bar (Shown on Studio, Retouch, and Menu tabs) */}
        {['studio', 'retouch', 'menu'].includes(activeTab) && (
          <GlobalShootControls
            style={activeStyle}
            setStyle={setActiveStyle}
            resolution={activeResolution}
            setResolution={setActiveResolution}
            model={activeModel}
            setModel={setActiveModel}
            aspectRatio={activeAspectRatio}
            setAspectRatio={setActiveAspectRatio}
            onBatchShoot={handleBatchShoot}
            isBatchShooting={isBatchShooting}
            batchProgress={batchProgress}
            totalDishes={menuData.dishes.length}
            shotCount={shotDishesCount}
          />
        )}

        {/* Tab 1: Menu Input & Parser */}
        {activeTab === 'menu' && (
          <MenuUploadTab
            menuData={menuData}
            setMenuData={setMenuData}
            onGoToStudio={() => setActiveTab('studio')}
            onParseMenuText={handleParseMenuText}
            isParsing={isParsingMenu}
            parseError={parseError}
          />
        )}

        {/* Tab 2: Photo Studio & Shoot */}
        {activeTab === 'studio' && (
          <PhotoStudioTab
            dishes={menuData.dishes}
            globalStyle={activeStyle}
            resolution={activeResolution}
            model={activeModel}
            aspectRatio={activeAspectRatio}
            onShootDish={handleShootDish}
            onOpenRetouch={handleOpenRetouch}
            isBatchShooting={isBatchShooting}
          />
        )}

        {/* Tab 3: AI Retouch Studio (gemini-3.1-flash-image-preview) */}
        {activeTab === 'retouch' && (
          <AIRetouchTab
            dishes={menuData.dishes}
            activeDishId={activeRetouchDishId}
            setActiveDishId={setActiveRetouchDishId}
            onEditPhoto={handleEditPhoto}
            onCreateNewPhotoFromPrompt={handleCreateNewPhotoFromPrompt}
            isEditing={isEditingPhoto}
            editError={editError}
            resolution={activeResolution}
          />
        )}

        {/* Tab 4: Digital Menu Experience */}
        {activeTab === 'digital-menu' && (
          <DigitalMenuTab
            menuData={menuData}
            onOpenRetouch={handleOpenRetouch}
            onGoToExport={() => setActiveTab('export')}
          />
        )}

        {/* Tab 5: Export Studio & Print Layout */}
        {activeTab === 'export' && (
          <ExportStudioTab
            menuData={menuData}
            activeResolution={activeResolution}
          />
        )}
      </main>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center space-x-3 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-400'
                : toastMessage.type === 'error'
                ? 'bg-red-400'
                : 'bg-amber-400'
            }`}
          />
          <span className="text-stone-200 font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Minimal Footer */}
      <footer className="border-t border-stone-900 bg-stone-950/80 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AuraPlate • Virtual Food Photographer for Restaurants</span>
          <span>Powered by Gemini 3-Pro & 3.1-Flash Image Engines</span>
        </div>
      </footer>
    </div>
  );
}
