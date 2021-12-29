const colors = require("tailwindcss/colors");

console.log(colors.sky);

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        // tailwindcss sky
        primary: colors.sky,
        secondary: colors.teal,
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // ...
  ],
};
