import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-3 rounded-xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border shadow-card dark:shadow-card-dark hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 group"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-500 ${
            !isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-75'
          }`} 
        />
        <Moon 
          className={`absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-500 ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
          }`} 
        />
      </div>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
    </button>
  );
};

export default ThemeToggle;
