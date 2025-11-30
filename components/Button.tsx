
import React from 'react';
import { playClick } from '../services/soundService';
import { THEME_CONFIG } from '../constants';
import { AppDesignTheme } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disableSound?: boolean;
  themeType?: AppDesignTheme; // Make generic theme available
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disableSound = false,
  onClick,
  themeType = 'girl', // default fallback
  ...props 
}) => {
  const theme = THEME_CONFIG[themeType];
  
  const baseStyles = "font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Dynamic styles based on passed theme config or hardcoded for specific states (success/danger)
  const variants = {
    primary: theme.buttonPrimary,
    secondary: theme.buttonSecondary,
    danger: "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30",
    success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-2xl w-full",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disableSound) {
        playClick();
    }
    if (onClick) {
        onClick(e);
    }
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};
