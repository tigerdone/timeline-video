import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'gray-800/50': 'rgba(31, 41, 55, 0.5)',
        'gray-800/80': 'rgba(31, 41, 55, 0.8)',
      },
    },
  },
  plugins: [],
} satisfies Config;
