module.exports = {
  purge: ["./**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        borderRadius: "border-radius",
      },
      spaces: {
        96: "24rem",
        120: "30rem",
      },
      colors: {
        gray: {
          900: "#202225",
          800: "#313238",
          700: "#36393F",
          600: "#34373C",
          500: "#40444B",
          300: "#DCDDDE",
          200: "#DCDDDE",
          100: "#FFFFF3",
        },
      },
    },
  },
  variants: {
    extend: {
      borderRadius: ["group-hover", "hover", "focus"],
    },
  },
  plugins: [],
};
