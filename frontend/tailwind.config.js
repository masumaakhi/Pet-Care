export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5A7F5C",
        accent: "#E38B3A",
        bg: "#F6F3EE",
      },
    },
  },
  plugins: [],
  safelist: ["bg-orange-500", "bg-green-500"]
};
