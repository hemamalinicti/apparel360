/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Chocolate Brown scale (Deep cocoa, rich leather, warm espresso)
        chocolate: {
          50: '#FAF6F3',
          100: '#F2E8E1',
          200: '#E4D0C1',
          300: '#D0B199',
          400: '#A87A57',
          500: '#845736',
          600: '#643F25',
          700: '#4D2F1A',
          800: '#3A2213',
          900: '#2A170C',
          950: '#1B0E06',
        },
        // Warm Cream & Linen scale (Rich warm custard cream)
        cream: {
          50: '#FAF5EB',
          100: '#F4EBD9',
          200: '#EBDBC3',
          300: '#DEC5A6',
          400: '#CDB18B',
          500: '#B8976C',
          600: '#9E7E54',
          700: '#7E633F',
          800: '#5E482C',
          900: '#3E2F1B',
        },
        // Burnt Orange & Rust / Terracotta accent scale
        burnt: {
          50: '#FFF7F2',
          100: '#FEECE2',
          200: '#FCD7C4',
          300: '#FAB899',
          400: '#F58E5E',
          500: '#E86526',
          600: '#CB4E14',
          700: '#A73B0C',
          800: '#862F0D',
          900: '#6C280E',
          950: '#3C1104',
        },
        // Alias brand to burnt/chocolate for harmony
        brand: {
          50: '#FFF7F2',
          100: '#FEECE2',
          200: '#FCD7C4',
          300: '#FAB899',
          400: '#F58E5E',
          500: '#E86526',
          600: '#CB4E14',
          700: '#A73B0C',
          800: '#862F0D',
          900: '#6C280E',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
