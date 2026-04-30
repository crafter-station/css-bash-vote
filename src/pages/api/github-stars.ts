import type { APIRoute } from "astro";

const REPO = "crafter-station/css-bash";

let cached: { stars: number; at: number } | null = null;
const TTL_MS = 5 * 60 * 1000;

export const GET: APIRoute = async () => {
	const now = Date.now();
	if (cached && now - cached.at < TTL_MS) {
		return new Response(JSON.stringify({ stars: cached.stars }), {
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const res = await fetch(`https://api.github.com/repos/${REPO}`, {
			headers: {
				Accept: "application/vnd.github+json",
				"User-Agent": "css-bash-vote",
			},
		});
		if (!res.ok) throw new Error(`GitHub API ${res.status}`);
		const json = (await res.json()) as { stargazers_count?: number };
		const stars = json.stargazers_count ?? 0;
		cached = { stars, at: now };
		return new Response(JSON.stringify({ stars }), {
			headers: { "Content-Type": "application/json" },
		});
	} catch {
		// Fall back to last cached value or zero so the UI never breaks
		const stars = cached?.stars ?? 0;
		return new Response(JSON.stringify({ stars }), {
			headers: { "Content-Type": "application/json" },
		});
	}
};
