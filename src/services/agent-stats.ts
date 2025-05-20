import dedent from "dedent";
import { API_URLS, DEV_API_URLS } from "../constants.js";
import formatNumber from "../lib/format-number.js";
import type { AgentStats } from "../types.js";

async function fetchAgentStatsFromAPI(
	agentAddress: string,
): Promise<AgentStats> {
	const useDev = process.env.ATP_USE_DEV === "true";
	const statsUrl = useDev ? DEV_API_URLS.AGENTS_STATS : API_URLS.AGENTS_STATS;

	const url = new URL(statsUrl);
	url.searchParams.append("address", agentAddress);

	console.log(
		`[AgentStatsService] Fetching agent stats from: ${url.toString()}`,
	);

	const response = await fetch(url.toString(), {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorBody = await response.text();
		console.error(
			`[AgentStatsService] API Error ${response.status}: ${errorBody}`,
		);
		throw new Error(
			`Failed to fetch agent stats (${response.status}): ${response.statusText}. Details: ${errorBody}`,
		);
	}
	const data = await response.json();
	return data as AgentStats;
}

export class AgentStatsService {
	public async getStats(tokenContract: string): Promise<AgentStats> {
		if (
			!tokenContract ||
			typeof tokenContract !== "string" ||
			!tokenContract.startsWith("0x")
		) {
			throw new Error(
				"Invalid or missing token contract address. Expected a string starting with '0x'.",
			);
		}
		try {
			console.log(`[AgentStatsService] getStats called for: ${tokenContract}`);
			const stats = await fetchAgentStatsFromAPI(tokenContract);
			return stats;
		} catch (error: unknown) {
			console.error(
				`[AgentStatsService] Error in getStats for ${tokenContract}:`,
				error,
			);
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred while fetching stats.";
			throw new Error(message);
		}
	}

	public formatStats(stats: AgentStats): string {
		return dedent`
      📊 *Agent Statistics*

      💰 Price: ${formatNumber(stats.currentPriceInUSD)} USD (${formatNumber(stats.currentPriceInIq)} IQ)
      📈 Market Cap: ${formatNumber(stats.marketCap)} USD
      📊 24h Change: ${formatNumber(stats.changeIn24h)}%
      👥 Holders: ${stats.holdersCount}
      🤖 Inferences: ${stats.inferenceCount}
      🏷️ Category: ${stats.category}
    `;
	}
}
