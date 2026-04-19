/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          50:  '#f5f4ed',
          100: '#f0eee6',
          200: '#e8e6dc',
          300: '#dedad0',
          400: '#c8c4b8',
        },
        ivory: {
          DEFAULT: '#faf9f5',
          dark: '#f5f4ed',
        },
        primary: {
          50:  '#fdf3ef',
          100: '#fae3d8',
          200: '#f5c4aa',
          300: '#eda07e',
          400: '#e07c56',
          500: '#c96442',
          600: '#b5562f',
          700: '#974522',
          800: '#7a3719',
          900: '#5e2910',
        },
        warm: {
          100: '#f5f4ed',
          200: '#ede9e0',
          300: '#e0dbd0',
          400: '#c8c3b5',
          500: '#9e9889',
          600: '#6b6558',
          700: '#3d3a32',
          800: '#2a2720',
          900: '#141413',
        },
        success: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50:  '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      },
      boxShadow: {
        'soft-sm': '0 1px 3px 0 rgba(60,50,30,0.06), 0 1px 2px -1px rgba(60,50,30,0.04)',
        'soft':    '0 4px 12px -2px rgba(60,50,30,0.08), 0 2px 6px -2px rgba(60,50,30,0.05)',
        'soft-md': '0 8px 24px -4px rgba(60,50,30,0.09), 0 4px 10px -3px rgba(60,50,30,0.06)',
        'soft-lg': '0 20px 48px -8px rgba(60,50,30,0.10), 0 8px 20px -6px rgba(60,50,30,0.07)',
      },
    },
  },
  plugins: [],
}
