import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Get initial theme
    const getInitialTheme = (): Theme => {
      // Check localStorage first
      const savedTheme = localStorage.getItem('mentorai-theme') as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
      }
      
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      
      return 'light';
    };

    const initialTheme = getInitialTheme();
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setIsInitialized(true);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('mentorai-theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    const body = document.body;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      body.style.backgroundColor = '#0f172a';
      body.style.color = '#f8fafc';
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#1f2937';
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('mentorai-theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Don't render until theme is initialized to prevent flash
  if (!isInitialized) {
    return <div className="fixed inset-0 bg-white dark:bg-dark-bg" />;
  }

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
