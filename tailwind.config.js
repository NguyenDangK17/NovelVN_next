/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      phone: "431px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      transitionProperty: {
        max_height: "max-height",
      },
      colors: {
        primary: {
          50: '#fff1e8',
          100: '#ffdccf',
          200: '#ffb49b',
          300: '#ff8b67',
          400: '#ff673b',
          500: '#ff5722',
          600: '#e64e1e',
          700: '#b83e18',
          800: '#8a2f12',
          900: '#66240d',
        },
      },
    },
  },
  plugins: [],
}

