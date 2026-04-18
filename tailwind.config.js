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
          50:  '#faf9f7',
          100: '#f5f3ef',
          200: '#ede9e3',
          300: '#e0dbd2',
        },
        primary: {
          50:  '#eff3ff',
          100: '#dbe4ff',
          200: '#bac8ff',
          300: '#91a7ff',
          400: '#748ffc',
          500: '#5c7cfa',
          600: '#3b5bdb',
          700: '#2f4ac0',
          800: '#1c3fa0',
          900: '#1a2f7e',
        },
        gold: {
          400: '#d4a847',
          500: '#b8933a',
          600: '#9a7a2f',
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
      },
      boxShadow: {
        'soft-sm': '0 1px 3px 0 rgba(15,23,42,0.06), 0 1px 2px -1px rgba(15,23,42,0.04)',
        'soft':    '0 4px 12px -2px rgba(15,23,42,0.08), 0 2px 6px -2px rgba(15,23,42,0.05)',
        'soft-md': '0 8px 24px -4px rgba(15,23,42,0.10), 0 4px 10px -3px rgba(15,23,42,0.06)',
        'soft-lg': '0 20px 48px -8px rgba(15,23,42,0.12), 0 8px 20px -6px rgba(15,23,42,0.07)',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
}
