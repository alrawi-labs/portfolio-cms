import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ana mor renk paleti
        primary: {
          DEFAULT: '#8750f7',      // --gradient-end / --text-color2 / --border-color
          50: '#f5f0ff',
          100: '#ede5ff',
          200: '#dcceff',
          300: '#c3a6ff',
          400: '#a574ff',
          500: '#8750f7',
          600: '#7343d2',          // --purple-light
          700: '#6b2fb5',          // --purple-medium
          800: '#5f35b0',
          900: '#4a1d7a',          // --purple-dark
          950: '#2a1454',          // --gradient-start
        },
        
        // Arka plan renkleri
        dark: {
          DEFAULT: '#140c1c',      // --bg-primary
          secondary: '#0e0714',    // --bg-secondary
        },
        
        // Border renkleri
        border: {
          DEFAULT: '#8750f7',      // --border-color (mor)
          subtle: 'rgb(31, 41, 55)', // --border-color-subtle (gri)
        },
        
        // Text renkleri
        text: {
          DEFAULT: 'rgb(221, 221, 221)', // --text-color
          hover: 'rgb(192, 132, 252)',   // --text-hover
          muted: 'rgb(156, 163, 175)',
        },
        
        // Hover/Background
        hover: {
          DEFAULT: 'rgb(31, 41, 55)',    // --bg-hover
        }
      },
      
      backgroundImage: {
        'gradient-primary': 'linear-gradient(260deg, #2a1454, #8750f7)',
        'gradient-primary-reverse': 'linear-gradient(200deg, #8750f7, #2a1454)',
        'gradient-hero': 'linear-gradient(260deg, #fff, #8750f7)',
      },

      fontFamily: {
        sora: ['Sora', 'sans-serif'],
      },
    }
  },
  plugins: [
    require('tailwindcss-rtl'),
  ],
};

export default config;