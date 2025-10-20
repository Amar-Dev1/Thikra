/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#F8EFD4",
        bgColor: "#FFFDF8",
        accent: "#F5C97B",
        dark: "#222222",
        light: "#FFFFFF",
      },
      fontFamily: {
        cairo: ["Cairo-Regular"],
        "cairo-bold": ["Cairo-Bold"],
        "cairo-light": ["Cairo-Light"],
        amiri:["Amiri-Regular"],
        "amiri-bold":["Amiri-Bold"],
      },
    },
  },
  plugins: [],
};
