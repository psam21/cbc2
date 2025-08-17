/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Earthy Color Palette - Based on CultureBridge theming guide
        earth: {
          50: '#faf7f2',    // Light off-white with warm undertone
          100: '#f5f0e6',   // Very light warm beige
          200: '#ebe0cc',   // Light warm beige
          300: '#d4c4a3',   // Medium warm beige
          400: '#b5a375',   // Medium brown
          500: '#8b6f47',   // Rich brown
          600: '#6b5535',   // Dark brown
          700: '#554428',   // Very dark brown
          800: '#3d3120',   // Deep brown
          900: '#2a2217',   // Almost black brown
        },
        // Natural Greens - Growth and vitality
        nature: {
          50: '#f0f7f0',    // Very light green
          100: '#e0f0e0',   // Light green
          200: '#c4e0c4',   // Medium light green
          300: '#9bc09b',   // Medium green
          400: '#659965',   // Rich green
          500: '#4a7c4a',   // Dark green
          600: '#3a623a',   // Very dark green
          700: '#2f4f2f',   // Deep green
          800: '#253f25',   // Darker green
          900: '#1e331e',   // Almost black green
        },
        // Warm Accents - Subtle highlights
        accent: {
          50: '#fef7f7',    // Very light warm pink
          100: '#fdeeee',   // Light warm pink
          200: '#fbdcdc',   // Medium light warm pink
          300: '#f7c2c2',   // Medium warm pink
          400: '#f09a9a',   // Rich warm pink
          500: '#e67272',   // Dark warm pink
          600: '#d45454',   // Very dark warm pink
          700: '#b13f3f',   // Deep warm pink
          800: '#8f3333',   // Darker warm pink
          900: '#752a2a',   // Almost black warm pink
        },
        // Neutral Grays - Clean backgrounds
        neutral: {
          50: '#fafafa',    // Very light gray
          100: '#f5f5f5',   // Light gray
          200: '#e5e5e5',   // Medium light gray
          300: '#d4d4d4',   // Medium gray
          400: '#a3a3a3',   // Medium dark gray
          500: '#737373',   // Dark gray
          600: '#525252',   // Very dark gray
          700: '#404040',   // Deep gray
          800: '#262626',   // Darker gray
          900: '#171717',   // Almost black gray
        },
        // Legacy colors for backward compatibility
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ac',
          300: '#f6ba77',
          400: '#f1933d',
          500: '#ed7516',
          600: '#de5a0c',
          700: '#b8440c',
          800: '#933612',
          900: '#762e12',
        },
        secondary: {
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
        cultural: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        // Modern orange palette
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // New color scheme
        navy: {
          50: '#f8faff',
          100: '#f1f4ff',
          200: '#e4e9ff',
          300: '#c7d4ff',
          400: '#a3b8ff',
          500: '#7c94ff',
          600: '#5b6bff',
          700: '#4a55ff',
          800: '#3d45e6',
          900: '#1A1A2E',
        },
        charcoal: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#9aa0a6',
          600: '#80868b',
          700: '#5f6368',
          800: '#3c4043',
          900: '#202124',
        }
      },
      fontFamily: {
        // CultureBridge Typography - Based on theming guide
        sans: ['Plus Jakarta Sans', 'Noto Sans', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        'heading': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Noto Sans', 'system-ui', 'sans-serif'],
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'sans-extrabold': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'sans-light': ['Noto Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      }
    },
  },
  plugins: [],
}
