/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0F1B33',
          50: '#EEF1F7',
          100: '#D6DCEA',
          200: '#AEB9D4',
          300: '#8695BC',
          400: '#5C6C9C',
          500: '#3A477A',
          600: '#26305C',
          700: '#1A2344',
          800: '#131A34',
          900: '#0F1B33',
          950: '#090F1F',
        },
        paper: {
          DEFAULT: '#F7F4EC',
          50: '#FFFFFF',
          100: '#FBFAF6',
          200: '#F7F4EC',
          300: '#EFE9DA',
        },
        brass: {
          DEFAULT: '#C69A3C',
          50: '#FBF3E1',
          100: '#F5E4BC',
          200: '#EACB7E',
          300: '#DEB458',
          400: '#C69A3C',
          500: '#A87D2C',
          600: '#886321',
          700: '#674A18',
        },
        teal: {
          DEFAULT: '#1F6F63',
          50: '#E7F3F1',
          100: '#C4E2DC',
          200: '#8FC7BC',
          300: '#5AAB99',
          400: '#2F8B78',
          500: '#1F6F63',
          600: '#175A50',
          700: '#11433C',
        },
        clay: {
          DEFAULT: '#B5533C',
          50: '#FBEAE5',
          400: '#C96C51',
          500: '#B5533C',
          600: '#933F2C',
        },
        slate: {
          DEFAULT: '#3D4457',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        'display-ar': ['"Noto Kufi Arabic"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        'body-ar': ['"Cairo"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(15, 27, 51, 0.12)',
        card: '0 2px 12px -4px rgba(15, 27, 51, 0.10)',
        lifted: '0 16px 40px -12px rgba(15, 27, 51, 0.22)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleIn: {
          '0%': { opacity: 0, transform: 'scale(0.96)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        dash: {
          '0%': { strokeDashoffset: 283 },
          '100%': { strokeDashoffset: 'var(--gauge-offset, 283)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease both',
        fadeIn: 'fadeIn 0.4s ease both',
        scaleIn: 'scaleIn 0.2s ease both',
        dash: 'dash 1.1s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
