
import React, { useState } from 'react';
import { Sticker, AppDesignTheme } from '../types';
import { editStickerImage } from '../services/geminiService';
import { THEME_CONFIG } from '../constants';
import { Button } from './Button';

interface MagicEditorProps {
  sticker: Sticker;
  currentImage: string; // Base64 or URL
  onSave: (newImageBase64: string) => void;
  onClose: () => void;
  themeType: AppDesignTheme;
}

export const MagicEditor: React.FC<MagicEditorProps> = ({ sticker, currentImage, onSave, onClose, themeType }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const theme = THEME_CONFIG[themeType];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    // If currentImage is a URL, we might need to handle it. 
    // Ideally we convert URL to base64 here if it's not already.
    // For now, assuming if it's external URL, Gemini might not take it directly as inline data easily without fetch.
    // Let's assume we can fetch it.
    let base64ToSend = currentImage;

    if (currentImage.startsWith('http')) {
        try {
            const response = await fetch(currentImage);
            const blob = await response.blob();
            base64ToSend = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            console.error("Failed to fetch source image", e);
        }
    }

    const result = await editStickerImage(base64ToSend, prompt);
    setGeneratedImage(result);
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-lg p-6 rounded-3xl shadow-2xl ${theme.cardClass} relative`}>
        <button 
            onClick={onClose}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center ${theme.buttonSecondary} font-bold`}
        >
            ✕
        </button>

        <h2 className={`text-3xl font-black mb-1 ${theme.textClass}`}>Varázsműhely ✨</h2>
        <p className={`mb-6 ${theme.subTextClass}`}>Változtasd át {sticker.name}-t!</p>

        <div className="flex justify-center gap-6 mb-8 items-center">
            <div className="flex flex-col items-center">
                <span className={`text-xs font-bold mb-2 uppercase ${theme.subTextClass}`}>Eredeti</span>
                <div className="w-24 h-24 p-2 bg-white rounded-xl border-2 border-dashed border-gray-300">
                    <img src={sticker.url} alt="Original" className="w-full h-full object-contain" />
                </div>
            </div>

            <span className="text-2xl text-gray-400">➔</span>

            <div className="flex flex-col items-center relative">
                <span className={`text-xs font-bold mb-2 uppercase ${theme.subTextClass}`}>Varázsolt</span>
                <div className="w-32 h-32 p-2 bg-white rounded-xl shadow-inner flex items-center justify-center relative overflow-hidden">
                    {isGenerating ? (
                        <div className="animate-spin text-4xl">🔮</div>
                    ) : (
                        <img 
                            src={generatedImage || currentImage} 
                            alt="Result" 
                            className="w-full h-full object-contain" 
                        />
                    )}
                </div>
            </div>
        </div>

        <div className="mb-6">
            <label className={`block text-sm font-bold mb-2 ${theme.textClass}`}>Mit változtassunk rajta?</label>
            <input 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Pl. Adj rá napszemüveget, vagy legyen kék..."
                className={`w-full p-4 rounded-xl outline-none border-2 transition-all ${theme.inputClass}`}
            />
        </div>

        <div className="flex gap-3">
            {generatedImage ? (
                <>
                     <Button 
                        themeType={themeType} 
                        variant="secondary" 
                        onClick={() => setGeneratedImage(null)}
                        className="flex-1"
                    >
                        Újra
                    </Button>
                    <Button 
                        themeType={themeType} 
                        variant="success" 
                        onClick={() => { onSave(generatedImage); onClose(); }}
                        className="flex-1"
                    >
                        Mentés
                    </Button>
                </>
            ) : (
                <Button 
                    themeType={themeType} 
                    onClick={handleGenerate} 
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full"
                >
                    {isGenerating ? 'Varázsolok...' : 'Átváltoztatás! ✨'}
                </Button>
            )}
        </div>

      </div>
    </div>
  );
};
