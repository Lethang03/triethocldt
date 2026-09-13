/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#071426',
        secondary: '#0B1930',
        card: '#10243D',
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1d4ed8'
        },
        cyan: '#06B6D4',
        indigo: '#6366F1',
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#F59E0B'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Be Vietnam Pro', 'sans-serif'],
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(to right, #06B6D4, #2563EB, #6366F1)',
      }
    },
  },
  plugins: [],
}
