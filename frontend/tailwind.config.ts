import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))",
        destructive: "hsl(var(--destructive))"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16, 24, 40, .06), 0 8px 24px rgba(16, 24, 40, .06)"
      }
    }
  },
  plugins: []
} satisfies Config;
