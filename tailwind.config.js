/* eslint-env node */
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#fdf2f8',   // Very light pink
          100: '#fce7f3',  // Light pink
          200: '#fbcfe8',  // Lighter pink
          300: '#f9a8d4',  // Light pink
          400: '#f472b6',  // Medium pink
          500: '#ec4899',  // Primary pink
          600: '#db2777',  // Darker pink
          700: '#be185d',  // Dark pink
          800: '#9d174d',  // Very dark pink
          900: '#831843',  // Darkest pink
        },
        neutral: {
          50: '#fafafa',   // Almost white
          100: '#f5f5f5',  // Very light gray
          200: '#e5e5e5',  // Light gray
          300: '#d4d4d4',  // Medium light gray
          400: '#a3a3a3',  // Medium gray
          500: '#737373',  // Gray
          600: '#525252',  // Dark gray
          700: '#404040',  // Darker gray
          800: '#262626',  // Very dark gray
          900: '#171717',  // Almost black
        },
        // Dark Mode Specific Colors
        dark: {
          bg: '#0f172a',     // Dark background
          surface: '#1e293b', // Dark surface
          border: '#334155',  // Dark border
        }
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(135deg, #f0f9ff 0%, #fdf2f8 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'gradient-primary': 'linear-gradient(135deg, #0ea5e9 0%, #ec4899 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,249,255,0.9) 100%)',
        'gradient-card-dark': 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.9) 100%)',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-dark': '0 2px 15px -3px rgba(0, 0, 0, 0.3), 0 10px 20px -2px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 20px rgba(14, 165, 233, 0.15)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
