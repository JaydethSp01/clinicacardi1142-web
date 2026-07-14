import type { Config } from 'tailwindcss';
const config: Config = { darkMode: "class",
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: { colors: { brand: { DEFAULT: "#db2777", dark: "#9d1c55" }, },} },
  plugins: [],
};
export default config;
