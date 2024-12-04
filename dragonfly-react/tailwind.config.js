module.exports = {
  purge: ['./src/**/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        success: "rgba(36, 179, 75, 1)"
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
