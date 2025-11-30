
import React, { useState } from 'react';
import { Sticker, UserStats, AlbumTheme, AppDesignTheme } from '../types';
import { STICKERS, ALBUM_THEMES, THEME_CONFIG } from '../constants';
import { Button } from './Button';
import { MagicEditor } from './MagicEditor';

interface StickerBookProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onBack: () => void;
  themeType: AppDesignTheme;
}

export const StickerBook: React.FC<StickerBookProps> = ({ stats, onUpdateStats, onBack, themeType }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingStickerId, setEditingStickerId] = useState<string | null>(null);

  const themeConfig = THEME_CONFIG[themeType];

  // Use the saved order or fallback to default sticker ID list
  const currentOrderIds = stats.stickerOrder && stats.stickerOrder.length === STICKERS.length 
    ? stats.stickerOrder 
    : STICKERS.map(s => s.id);

  const currentAlbumTheme = ALBUM_THEMES.find(t => t.id === stats.albumThemeId) || ALBUM_THEMES[0];
  const progress = Math.round((stats.stickersCollected.length / STICKERS.length) * 100);

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newOrder = [...currentOrderIds];
    const [movedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, movedItem);

    onUpdateStats({
      ...stats,
      stickerOrder: newOrder
    });
    setDraggedIndex(null);
  };

  const handleSaveMagicImage = (stickerId: string, newImage: string) => {
     onUpdateStats({
         ...stats,
         customStickerImages: {
             ...stats.customStickerImages,
             [stickerId]: newImage
         }
     });
  };

  const handleThemeSelect = (theme: AlbumTheme) => {
    onUpdateStats({
      ...stats,
      albumThemeId: theme.id
    });
  };

  return (
    <div className={`flex flex-col h-full min-h-screen ${currentAlbumTheme.bgClass} transition-colors duration-500 p-6 shadow-2xl w-full`}>
      {/* Magic Editor Modal */}
      {editingStickerId && (
          <MagicEditor 
            sticker={STICKERS.find(s => s.id === editingStickerId)!}
            currentImage={stats.customStickerImages?.[editingStickerId] || STICKERS.find(s => s.id === editingStickerId)!.url}
            onClose={() => setEditingStickerId(null)}
            onSave={(img) => handleSaveMagicImage(editingStickerId, img)}
            themeType={themeType}
          />
      )}

      {/* Header & Controls */}
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className={`text-4xl font-black ${currentAlbumTheme.id === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Matrica Albumom
          </h2>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onBack} themeType={themeType}>
               Vissza
            </Button>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm mb-6 flex flex-col items-center">
            <p className="text-xs text-gray-500 font-bold mb-2 uppercase tracking-wide">Album Háttér</p>
            <div className="flex gap-3 overflow-x-auto pb-2 w-full justify-center">
                {ALBUM_THEMES.map(t => (
                    <button
                        key={t.id}
                        onClick={() => handleThemeSelect(t)}
                        className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${t.previewColor} ${stats.albumThemeId === t.id ? 'ring-4 ring-brand-blue border-transparent' : 'border-gray-300'}`}
                        title={t.name}
                    />
                ))}
            </div>
        </div>

        {/* Progress */}
        <div className="mb-8 bg-white/50 p-4 rounded-xl">
          <div className="w-full bg-gray-200 rounded-full h-6 border-2 border-gray-300 overflow-hidden">
            <div 
              className="bg-brand-orange h-full rounded-full transition-all duration-1000 striped-bg" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className={`text-center mt-2 font-bold ${currentAlbumTheme.id === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {stats.stickersCollected.length} / {STICKERS.length} matrica megszerezve
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-10">
          {currentOrderIds.map((stickerId, index) => {
            const sticker = STICKERS.find(s => s.id === stickerId);
            if (!sticker) return null;
            
            const isUnlocked = stats.stickersCollected.includes(sticker.id);
            const isDragging = draggedIndex === index;
            const customImage = stats.customStickerImages?.[stickerId];
            const displayUrl = customImage || sticker.url;

            return (
              <div 
                key={sticker.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onClick={() => isUnlocked && setEditingStickerId(sticker.id)}
                className={`
                    relative aspect-square rounded-2xl border-4 transition-all duration-300 cursor-move
                    flex flex-col items-center justify-center group select-none
                    ${isDragging ? 'opacity-50 scale-90' : 'hover:scale-105 hover:z-10'}
                    ${isUnlocked 
                        ? 'border-brand-orange bg-white shadow-md cursor-pointer' 
                        : 'border-gray-200 bg-gray-100/50 border-dashed cursor-default'}
                `}
              >
                {isUnlocked ? (
                  <>
                    <img 
                      src={displayUrl} 
                      alt={sticker.name} 
                      className="w-full h-full object-contain p-2 pointer-events-none"
                    />
                    <div className="absolute -bottom-3 bg-yellow-300 px-3 py-1 rounded-full text-xs font-bold shadow-md border border-yellow-500 truncate max-w-[110%] group-hover:scale-110 transition-transform z-20 text-black">
                      {sticker.name}
                    </div>
                    {/* Magic Wand Icon Overlay */}
                    <div className="absolute top-2 right-2 bg-purple-500 text-white p-1 rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform">
                        ✨
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center opacity-30">
                    <span className="text-4xl mb-2 grayscale filter">❓</span>
                    <span className="text-xs font-bold text-gray-400">?</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <p className={`text-center text-sm font-medium opacity-60 mb-8 ${currentAlbumTheme.id === 'dark' ? 'text-white' : 'text-gray-500'}`}>
            Tipp: Húzd a matricákat a sorrendhez, vagy kattints rájuk a varázsláshoz!
        </p>

      </div>
    </div>
  );
};
