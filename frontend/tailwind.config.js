/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dde6ff',
          200: '#c3d0fe',
          300: '#9fb1fd',
          400: '#7b8efb',
          500: '#5c6ef7',
          600: '#4452ec',
          700: '#3640d1',
          800: '#2e37a8',
          900: '#2c3585'
        }
      }
    }
  },
  plugins: []
}
