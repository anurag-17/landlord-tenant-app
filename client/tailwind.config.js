/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      "theme-color": "#021729",
      "theme-secondary": "#f3f3f3",
      primary: "#0f3554",
      black: "#000",
      white:"#fff",
      ...colors,
    },
    extend: {},
  },
  plugins: [],
};
