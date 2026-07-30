/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#050505",
          secondary: "#0B0B0B",
        },
        card: "#111111",
        border: "rgba(255, 255, 255, 0.08)",
        primary: {
          DEFAULT: "#00E5FF",
          glow: "rgba(0, 229, 255, 0.15)",
        },
        secondary: {
          DEFAULT: "#37dff5ff",
          glow: "rgba(0, 255, 149, 0.15)",
        },
        accent: {
          DEFAULT: "#16cf98ff",
          glow: "rgba(108, 99, 255, 0.15)",
        },
        danger: "#FF4D6D",
        warning: "#FFC857",
        success: "#00FF95",
        text: {
          DEFAULT: "#FFFFFF",
          muted: "#9CA3AF",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        grotesk: ["Space Grotesk", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': 'left center' },
          '50%': { 'background-position': 'right center' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.5, filter: 'brightness(0.8)' },
          '50%': { opacity: 1, filter: 'brightness(1.2)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'marquee': {
          '0%': { 'stroke-dashoffset': '0' },
          '100%': { 'stroke-dashoffset': '-20' }
        }
      }
    },
  },
  plugins: [],
}
