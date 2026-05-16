import type { Config } from "tailwindcss";
import xacosUIPreset from "./tailwind-preset";

export default {
  content: ["./src/**/*.{tsx,ts}"],
  presets: [xacosUIPreset],
} satisfies Config;

