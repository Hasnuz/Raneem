import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { ink: "#071526", navy: "#0b2445", royal: "#174ea6", gold: "#b58a48", mist: "#f4f7fa" }, boxShadow: { soft: "0 20px 60px rgba(7,21,38,.09)" } } }, plugins: [] } satisfies Config;
