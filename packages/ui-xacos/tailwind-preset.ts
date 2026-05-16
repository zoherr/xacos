import type { Config } from "tailwindcss";

/** App `tailwind.config`: `presets: [preset]` importing `@xacos/ui/tailwind-preset`. */
const xacosUIPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
        xacos: {
          bg: "#0f0f0f",
          surface: "#1a1a1a",
          border: "#2a2a2a",
          text: "#e5e5e5",
          muted: "#888888",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        xacos: "6px",
      },
    },
  },
  plugins: [],
};

export default xacosUIPreset;

