
import { Sticker, AdventureTheme, AlbumTheme, UserStats } from "./types";

// Using DiceBear for consistent cartoon style images
export const STICKERS: Sticker[] = [
  { id: 's1', name: 'Bátor Felfedező', url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alex' },
  { id: 's2', name: 'Okos Robot', url: 'https://api.dicebear.com/9.x/bottts/svg?seed=Gizmo' },
  { id: 's3', name: 'Varázsló', url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Merlin' },
  { id: 's4', name: 'Űrhajós', url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Astro' },
  { id: 's5', name: 'Boldog Láng', url: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Fire' },
  { id: 's6', name: 'Hegyi Túrázó', url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Climber' },
  { id: 's7', name: 'Mélytengeri Búvár', url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Diver' },
  { id: 's8', name: 'Cuki Szellem', url: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Ghost' },
  { id: 's9', name: 'Szivárvány', url: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Rainbow' },
  { id: 's10', name: 'Ninja Macska', url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Cat' },
  { id: 's11', name: 'Zöld Szörnyike', url: 'https://api.dicebear.com/9.x/bottts/svg?seed=Monster' },
  { id: 's12', name: 'Győztes Kupa', url: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Trophy' },
];

export const ALBUM_THEMES: AlbumTheme[] = [
  { id: 'classic', name: 'Klasszikus', bgClass: 'bg-white', previewColor: 'bg-white border-gray-300' },
  { id: 'blue', name: 'Kék Ég', bgClass: 'bg-blue-50', previewColor: 'bg-blue-200' },
  { id: 'yellow', name: 'Napfény', bgClass: 'bg-yellow-50', previewColor: 'bg-yellow-200' },
  { id: 'dark', name: 'Éjszaka', bgClass: 'bg-slate-800 text-white', previewColor: 'bg-slate-800 border-white' },
  { id: 'green', name: 'Erdő', bgClass: 'bg-green-50', previewColor: 'bg-green-200' },
  { id: 'grid', name: 'Matek Füzet', bgClass: 'bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]', previewColor: 'bg-gray-100' },
];

export const INITIAL_STATS: UserStats = {
  correctAnswers: 0,
  wrongAnswers: 0,
  gamesPlayed: 0,
  stickersCollected: [],
  albumThemeId: 'classic',
  stickerOrder: STICKERS.map(s => s.id),
  customStickerImages: {}
};

export const AVATARS = [
  '🦊', '🦁', '🦄', '🐸', '🐼', '🐯', '🤖', '👾', '👽', '🦸', '🧚', '🐱', '🐶', '🚀'
];

export const ADVENTURE_THEMES: AdventureTheme[] = [
  { 
    id: 'space', 
    name: 'Űrutazás', 
    emoji: '🚀', 
    description: 'Számolj a csillagok között!', 
    bgGradient: 'from-slate-900 via-purple-900 to-slate-900',
    accentColor: 'text-cyan-300'
  },
  { 
    id: 'dino', 
    name: 'Dínó Föld', 
    emoji: '🦖', 
    description: 'Barátkozz össze a T-Rex-szel!', 
    bgGradient: 'from-green-800 via-emerald-700 to-teal-900',
    accentColor: 'text-yellow-300'
  },
  { 
    id: 'ocean', 
    name: 'Tenger Alatt', 
    emoji: '🐬', 
    description: 'Merülj le a kincsekért!', 
    bgGradient: 'from-blue-600 via-cyan-500 to-blue-800',
    accentColor: 'text-white'
  },
  { 
    id: 'magic', 
    name: 'Varázslat', 
    emoji: '🧙‍♂️', 
    description: 'Bájitalok és varázsigék.', 
    bgGradient: 'from-fuchsia-600 via-purple-600 to-pink-600',
    accentColor: 'text-yellow-200'
  },
  { 
    id: 'zoo', 
    name: 'Állatkert', 
    emoji: '🦁', 
    description: 'Segíts az állatgondozóknak!', 
    bgGradient: 'from-yellow-400 via-orange-400 to-red-400',
    accentColor: 'text-brown-800'
  }
];

export const THEME_CONFIG = {
  boy: {
    id: 'boy',
    bgClass: 'bg-slate-900', // Base fallback
    bgGradient: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950',
    textClass: 'text-white',
    subTextClass: 'text-slate-300',
    cardClass: 'bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 shadow-xl shadow-cyan-500/10',
    buttonPrimary: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50',
    buttonSecondary: 'bg-slate-700/50 text-white border border-slate-600 hover:bg-slate-700',
    accentText: 'text-cyan-400',
    inputClass: 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500/30',
    iconBg: 'bg-slate-700/50 text-cyan-300'
  },
  girl: {
    id: 'girl',
    bgClass: 'bg-rose-50', // Base fallback
    bgGradient: 'bg-gradient-to-br from-rose-100 via-purple-100 to-indigo-100',
    textClass: 'text-slate-800',
    subTextClass: 'text-slate-500',
    cardClass: 'bg-white/60 backdrop-blur-xl border border-white/60 shadow-xl shadow-purple-500/5',
    buttonPrimary: 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50',
    buttonSecondary: 'bg-white/50 text-slate-700 border border-white/60 hover:bg-white/80',
    accentText: 'text-pink-600',
    inputClass: 'bg-white/50 border-pink-200 text-slate-800 placeholder-slate-400 focus:border-pink-400 focus:ring-pink-400/30',
    iconBg: 'bg-pink-100 text-pink-500'
  }
};
