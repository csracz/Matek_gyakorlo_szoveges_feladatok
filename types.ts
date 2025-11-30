
export enum MathTopic {
  ADDITION = 'Összeadás',
  SUBTRACTION = 'Kivonás',
  MULTIPLICATION = 'Szorzás',
  DIVISION = 'Osztás',
  ROUNDING_10 = 'Kerekítés 10-esre',
  ROUNDING_100 = 'Kerekítés 100-asra',
  MIXED = 'Vegyes Feladatok'
}

export interface Question {
  id: string;
  questionText: string;
  options: number[];
  correctAnswer: number;
  explanation?: string;
}

export interface Sticker {
  id: string;
  url: string;
  name: string;
  unlockedAt?: number; // timestamp
}

export interface UserStats {
  correctAnswers: number;
  wrongAnswers: number;
  gamesPlayed: number;
  stickersCollected: string[]; // List of Sticker IDs
  albumThemeId?: string; // ID of the selected background theme
  stickerOrder?: string[]; // Custom order of stickers (IDs)
  customStickerImages?: Record<string, string>; // Map sticker ID to base64 image data string
}

export type AppDesignTheme = 'boy' | 'girl';

export interface Player {
  name: string;
  avatar: string; // Emoji character
  designTheme: AppDesignTheme;
  stats: UserStats;
}

export interface AdventureTheme {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bgGradient: string; // Tailwind classes
  accentColor: string; // Text color class
}

export interface AlbumTheme {
  id: string;
  name: string;
  bgClass: string; // Tailwind classes
  previewColor: string; // For the selector circle
}

export type GameState = 'THEME_SELECTION' | 'WELCOME' | 'DASHBOARD' | 'ADVENTURE_SELECT' | 'PLAYING' | 'RESULT' | 'STICKER_BOOK';
