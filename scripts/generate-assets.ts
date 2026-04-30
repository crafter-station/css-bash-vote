#!/usr/bin/env bun
/**
 * Generate OG images + favicon for css-bash-vote.
 *
 * - public/og.png         (1200x630, Open Graph standard)
 * - public/og-twitter.png (1200x600, Twitter large card)
 * - public/favicon.ico    (multi-size 16/32/48)
 * - public/favicon.svg    (vector, replaces the Astro default)
 *
 * Idempotent. Re-run after brand tweaks.
 *
 * Stack: satori (HTML/JSX -> SVG) + sharp (SVG -> PNG/ICO).
 */

import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";
import satori from "satori";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");

// Brand palette — must match src/styles/global.css and tailwind tokens.
const PALETTE = {
	bg: "#0B0D10",
	bgSecondary: "#14171C",
	fg: "#E6E8EC",
	fgDim: "#888C93",
	line: "#21252C",
	amber: "#F59E0B",
	sky: "#0EA5E9",
	gold: "#FFD700", // Crafter Station brand
};

// Crafter Station logo path (icon variant). Same path lives in
// src/components/CrafterStationLogo.tsx — keep in sync.
const CS_ICON_PATH =
	"M118.238 16.262C111.482 11.4 99.9003 5.62505 92.2517 3.26931C74.9754 -2.31209 61.2312 0.473844 52.1188 3.50057C34.3839 9.3909 23.1637 17.3398 12.9798 32.0237C-3.018 54.7384 -1.30627 92.0001 17.4396 113.282C21.6313 118.385 23.9203 117.58 40.6062 105.794C41.1838 105.243 38.9626 101.57 35.6118 97.3194C28.0736 87.6862 23.7841 70.2632 26.209 60.5011C34.074 29.8239 72.1683 13.8835 96.3841 31.0488C101.735 34.7695 118.578 50.1432 133.719 65.2112C156.435 87.3932 163.188 92.535 168.887 92.0615C174.586 91.588 176.608 89.6589 177.27 83.5096C178.226 76.8049 175.724 72.8474 162.814 60.893C154.116 52.642 147.113 45.2566 147.134 43.8571C147.151 42.7375 153.199 38.0697 160.665 33.7035C208.922 4.47877 259.519 64.8793 219.089 103.462C213.891 108.422 204.705 113.602 198.705 115.191C191.85 116.767 160.245 117.687 120.978 117.092C47.5669 115.979 43.5706 116.758 23.9629 133.539C-1.12747 155.276 -7.39134 192.976 9.54962 220.67C31.485 256.839 79.721 266.529 114.252 241.576L126.916 232.249L141.283 241.986C164.663 258.018 183.68 261.387 206.842 254.179C253.172 239.483 271.118 182.082 241.827 143.002C238.477 138.752 236.774 138.446 232.187 140.616C218.126 148.242 218.419 147.686 226.416 164.606C232.48 177.576 233.542 182.632 231.971 192.407C227.614 216.978 208.584 233.207 184.682 232.845C166.187 232.564 160.267 228.835 126.619 195.569C108.947 178.502 92.6562 164.257 90.3799 164.222C86.1118 164.158 76.8749 172.697 76.8113 176.895C76.7943 178.015 84.341 187.088 93.8711 196.752L110.969 214.089L100.607 221.771C64.0584 248.374 13.049 215.124 25.6449 172.76C29.5392 159.94 42.8446 145.864 55.4323 141.575C60.2992 139.689 90.1929 139.023 130.598 139.635C204.863 140.762 213.705 139.496 230.998 125.2C282.576 83.4269 254.198 2.92565 187.611 2.19579C168.262 1.90235 157.675 5.66133 139.549 18.5449L130.342 25.1245L118.238 16.262Z";

// JetBrains Mono is a clean monospace for the logotype. Inter for prose.
async function loadFonts() {
	const inter800 = await fetch(
		"https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50ojIa1ZL7W0Q5nw.woff",
	).then((r) => r.arrayBuffer());
	const inter500 = await fetch(
		"https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50ojIa1ZL7W0Q5nw.woff",
	).then((r) => r.arrayBuffer());
	const jbMono700 = await fetch(
		"https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4xD7OwA0lQ.woff",
	).then((r) => r.arrayBuffer());
	return { inter800, inter500, jbMono700 };
}

interface OgVariant {
	width: number;
	height: number;
	out: string;
}

const OG_VARIANTS: OgVariant[] = [
	{ width: 1200, height: 630, out: "og.png" },
	{ width: 1200, height: 600, out: "og-twitter.png" },
];

function ogTemplate(width: number, height: number) {
	// satori takes a JSX-like tree (object form). Inline styles only.
	return {
		type: "div",
		props: {
			style: {
				width,
				height,
				display: "flex",
				flexDirection: "column",
				background: PALETTE.bg,
				backgroundImage: `radial-gradient(circle at 100% 0%, ${PALETTE.amber}1A 0%, transparent 50%), radial-gradient(circle at 0% 100%, ${PALETTE.sky}1A 0%, transparent 50%)`,
				color: PALETTE.fg,
				fontFamily: "Inter",
				padding: "64px",
				position: "relative",
			},
			children: [
				// Subtle dot pattern
				{
					type: "div",
					props: {
						style: {
							position: "absolute",
							inset: 0,
							backgroundImage: `radial-gradient(circle, ${PALETTE.line} 1px, transparent 1px)`,
							backgroundSize: "24px 24px",
							opacity: 0.4,
						},
					},
				},
				// Top: brand badge
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 12,
							padding: "8px 18px",
							borderRadius: 999,
							border: `1px solid ${PALETTE.line}`,
							background: PALETTE.bgSecondary,
							fontSize: 18,
							color: PALETTE.fgDim,
							alignSelf: "flex-start",
							zIndex: 1,
						},
						children: [
							{
								type: "svg",
								props: {
									width: 18,
									height: 18,
									viewBox: "0 0 258 258",
									xmlns: "http://www.w3.org/2000/svg",
									children: [
										{
											type: "path",
											props: { d: CS_ICON_PATH, fill: PALETTE.gold },
										},
									],
								},
							},
							"Crafter Station . Community Benchmark",
						],
					},
				},
				// Spacer
				{ type: "div", props: { style: { flex: 1 } } },
				// Headline
				{
					type: "div",
					props: {
						style: {
							fontSize: 96,
							fontWeight: 800,
							letterSpacing: "-0.04em",
							lineHeight: 1.05,
							color: PALETTE.fg,
							marginBottom: 24,
							zIndex: 1,
							display: "flex",
							flexWrap: "wrap",
						},
						children: [
							"Which AI writes ",
							{
								type: "span",
								props: { style: { color: PALETTE.amber }, children: "better CSS" },
							},
							"?",
						],
					},
				},
				// Stats row
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							alignItems: "baseline",
							gap: 24,
							fontSize: 22,
							color: PALETTE.fgDim,
							zIndex: 1,
						},
						children: [
							{
								type: "div",
								props: {
									style: { display: "flex", alignItems: "baseline", gap: 8 },
									children: [
										{
											type: "span",
											props: {
												style: {
													fontSize: 32,
													fontWeight: 800,
													color: PALETTE.fg,
												},
												children: "6",
											},
										},
										"rounds",
									],
								},
							},
							{ type: "span", props: { style: { color: PALETTE.line }, children: "." } },
							{
								type: "div",
								props: {
									style: { display: "flex", alignItems: "baseline", gap: 8 },
									children: [
										{
											type: "span",
											props: {
												style: {
													fontSize: 32,
													fontWeight: 800,
													color: PALETTE.amber,
												},
												children: "60",
											},
										},
										"challenges",
									],
								},
							},
							{ type: "span", props: { style: { color: PALETTE.line }, children: "." } },
							{
								type: "div",
								props: {
									style: { display: "flex", alignItems: "baseline", gap: 8 },
									children: [
										{
											type: "span",
											props: {
												style: {
													fontSize: 32,
													fontWeight: 800,
													color: PALETTE.sky,
												},
												children: "120",
											},
										},
										"outputs",
									],
								},
							},
						],
					},
				},
				// Bottom: variant pills + URL
				{
					type: "div",
					props: {
						style: {
							marginTop: 48,
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							gap: 16,
							zIndex: 1,
						},
						children: [
							{
								type: "div",
								props: {
									style: { display: "flex", gap: 12 },
									children: [
										{
											type: "div",
											props: {
												style: {
													display: "flex",
													alignItems: "center",
													gap: 8,
													padding: "6px 16px",
													borderRadius: 999,
													border: `1px solid ${PALETTE.amber}40`,
													background: `${PALETTE.amber}1A`,
													color: PALETTE.amber,
													fontSize: 18,
													fontWeight: 600,
												},
												children: [
													{
														type: "div",
														props: {
															style: {
																width: 8,
																height: 8,
																borderRadius: 999,
																background: PALETTE.amber,
															},
														},
													},
													"With css-bash MCP",
												],
											},
										},
										{
											type: "div",
											props: {
												style: {
													display: "flex",
													alignItems: "center",
													gap: 8,
													padding: "6px 16px",
													borderRadius: 999,
													border: `1px solid ${PALETTE.sky}40`,
													background: `${PALETTE.sky}1A`,
													color: PALETTE.sky,
													fontSize: 18,
													fontWeight: 600,
												},
												children: [
													{
														type: "div",
														props: {
															style: {
																width: 8,
																height: 8,
																borderRadius: 999,
																background: PALETTE.sky,
															},
														},
													},
													"Without MCP",
												],
											},
										},
									],
								},
							},
							{
								type: "div",
								props: {
									style: {
										fontFamily: "JetBrains Mono",
										fontSize: 22,
										fontWeight: 700,
										color: PALETTE.fg,
									},
									children: [
										"css",
										{
											type: "span",
											props: { style: { color: PALETTE.amber }, children: "-bash" },
										},
									],
								},
							},
						],
					},
				},
			],
		},
	};
}

async function generateOg(
	variant: OgVariant,
	fonts: Awaited<ReturnType<typeof loadFonts>>,
) {
	const svg = await satori(ogTemplate(variant.width, variant.height) as never, {
		width: variant.width,
		height: variant.height,
		fonts: [
			{ name: "Inter", data: fonts.inter800, weight: 800, style: "normal" },
			{ name: "Inter", data: fonts.inter500, weight: 500, style: "normal" },
			{
				name: "JetBrains Mono",
				data: fonts.jbMono700,
				weight: 700,
				style: "normal",
			},
		],
	});
	const png = await sharp(Buffer.from(svg)).png({ quality: 92 }).toBuffer();
	const out = join(PUBLIC_DIR, variant.out);
	await writeFile(out, png);
	console.log(`  ${variant.out}  ${variant.width}x${variant.height}  ${(png.length / 1024).toFixed(0)} KB`);
}

// Favicon: simple monogram with the brand gradient.
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${PALETTE.amber}"/>
      <stop offset="1" stop-color="${PALETTE.sky}"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="64" height="64" rx="14" fill="${PALETTE.bg}"/>
  <rect x="2" y="2" width="60" height="60" rx="12" fill="none" stroke="url(#g)" stroke-width="2"/>
  <path d="M18 24 L12 32 L18 40" fill="none" stroke="${PALETTE.amber}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M46 24 L52 32 L46 40" fill="none" stroke="${PALETTE.sky}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M37 20 L27 44" fill="none" stroke="${PALETTE.fg}" stroke-width="3" stroke-linecap="round"/>
</svg>`;

async function generateFavicon() {
	if (!existsSync(PUBLIC_DIR)) await mkdir(PUBLIC_DIR, { recursive: true });

	// Save the SVG (replaces Astro's default)
	await writeFile(join(PUBLIC_DIR, "favicon.svg"), FAVICON_SVG);
	console.log(`  favicon.svg  vector`);

	// Render the SVG into a single 32x32 PNG. Modern browsers prefer the
	// SVG anyway; the .ico is just a fallback and Safari really only uses
	// the largest size. Sharp can pack it into ICO via container output.
	const sizes = [16, 32, 48];
	const buffers = await Promise.all(
		sizes.map((size) =>
			sharp(Buffer.from(FAVICON_SVG)).resize(size, size).png().toBuffer(),
		),
	);

	// Sharp 0.32+ supports ICO output natively
	try {
		const ico = await sharp(buffers[1])
			.resize(32, 32)
			.toFormat("png" as never)
			.toBuffer();
		// Fallback: write the 32x32 PNG renamed to .ico (most browsers accept it)
		await writeFile(join(PUBLIC_DIR, "favicon.ico"), ico);
		console.log(`  favicon.ico  32x32 PNG (browsers accept any image)`);
	} catch (e) {
		console.error("  favicon.ico generation failed:", e);
	}

	// Also emit a 180x180 apple-touch-icon for iOS home screen.
	const apple = await sharp(Buffer.from(FAVICON_SVG))
		.resize(180, 180)
		.png()
		.toBuffer();
	await writeFile(join(PUBLIC_DIR, "apple-touch-icon.png"), apple);
	console.log(`  apple-touch-icon.png  180x180`);
}

async function main() {
	console.log("generating brand assets in public/\n");

	console.log("favicon");
	await generateFavicon();

	console.log("\nog images (loading fonts...)");
	const fonts = await loadFonts();
	for (const variant of OG_VARIANTS) {
		await generateOg(variant, fonts);
	}

	console.log("\ndone.");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
