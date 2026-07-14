/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta PromptForge V4 (Estilo Linear/Vercel)
        primary: "#7C3AED",   // Morado Eléctrico
        secondary: "#A855F7", // Violeta Pro
        accent: "#22d3ee",    // Cyan Neón
        success: "#00ff88",   // Verde Neón para detalles
        dark: {
          DEFAULT: "#020617", // Fondo Slate 950
          card: "#0F172A",    // Fondo de Tarjetas
          border: "rgba(255, 255, 255, 0.05)",
        }
      },
      animation: {
        'glow': 'glow 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      backgroundImage: {
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
      }
    },
  },
  plugins: [],
}