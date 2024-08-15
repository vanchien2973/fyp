/** @type {import('tailwindcss').Config} */
import withMT  from "@material-tailwind/react/utils/withMT";

module.exports = withMT({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
        Roboto: ["var(--font-Roboto)", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"],
      },
    extend: {
      // backgroundImage: {
      //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      //   "gradient-conic":
      //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      // },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
        onest: ['Onest', 'sans-serif'],
        robotoMono: ['Roboto Mono', 'monospace'],
        mooli: ['Mooli', 'sans-serif'],
        mavenPro: ['Maven Pro', 'sans-serif'],
        oxanium: ['Oxanium', 'cursive'],
        mPlusp: ['M PLUS 1p'],
        jaldi: ['Jaldi', 'sans-serif'],
        k2d: ['K2D', 'sans-serif'],
        sourceSans3: ['Source Sans 3', 'sans-serif']
      }
    },
    screens: {
        "1000px": "1000px",
        "1100px": "1100px",
        "1200px": "1200px",
        "1300px": "1300px",
        "1500px": "1500px",
        "800px": "800px",
        "400px": "400px",
      },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
});
