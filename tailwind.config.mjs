/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				primary: "#3b82f6",
				success: "#22c55e",
				warning: "#facc15",
			},
		},
	},
	plugins: [],
};
