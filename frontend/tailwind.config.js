/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent:  '#e8f216',
        accent2: '#ff3c2e',
        dark:    '#111214',
        panel:   '#16181c',
        border:  '#2a2d35',
        muted:   '#6b7280',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%':       { transform: 'translateY(-18px) rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
}
