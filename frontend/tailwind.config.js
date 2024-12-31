/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      
      colors: {
        customPink: 'rgba(252, 246, 249, 0.78)', // Add your custom color here
      },
      animation: {
        slideIn: 'slideIn 0.5s ease-out',
        fadeOut: 'fadeOut 0.5s 2.5s forwards',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
    },
  },
  plugins: [],
}
}