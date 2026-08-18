/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 50: '#e8f5e9', 100: '#c8e6c9', 200: '#a5d6a7', 300: '#81c784', 400: '#66bb6a', 500: '#4caf50', 600: '#2e7d32', 700: '#1b5e20', 800: '#145214', 900: '#0d3b0d' },
        cream: '#FFF8E7',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], heading: ['Poppins', 'sans-serif'], devanagari: ['Noto Sans Devanagari', 'sans-serif'] },
      animation: { 'fade-in': 'fadeIn 0.5s ease-out', 'slide-up': 'slideUp 0.5s ease-out', 'slide-down': 'slideDown 0.3s ease-out', 'scale-in': 'scaleIn 0.3s ease-out', 'float': 'float 6s ease-in-out infinite' },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
      },
      backgroundImage: { 'hero-pattern': "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" },
    },
  },
  plugins: [],
};
