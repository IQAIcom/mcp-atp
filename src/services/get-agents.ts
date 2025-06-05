import dedent from "dedent";
import { env } from "../config.js";
import formatNumber from "../lib/format-number.js";
import type { Agent } from "../types.js";

export interface GetAgentsParams {
	sort?: "mcap" | "holders" | "inferences";
	limit?: number;
}

interface GetAgentsResponse {
	agents: Agent[];
}

export class GetAgentsService {
	async getAgents(params: GetAgentsParams): Promise<Agent[]> {
		try {
			const url = new URL(`${env.ATP_API_URL}/agents/top`);
			if (params.sort) url.searchParams.append("sort", params.sort);
			if (params.limit)
				url.searchParams.append("limit", params.limit.toString());
			console.info("🔍 Fetching agents", { url });

			const response = await fetch(url.toString(), {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch agents: ${response.statusText}`);
			}
			const data = (await response.json()) as GetAgentsResponse;
			return data.agents;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Failed to fetch agents: ${errorMessage}`);
		}
	}

	formatAgents(agents: Agent[]) {
		if (agents.length === 0) {
			return "📊 No Agents found";
		}
		const formattedAgents = agents
			.map((agent) => {
				return dedent`
      🏷️ *${agent.name}* $(${agent.ticker})
      💰 Price: $${formatNumber(agent.currentPriceInUSD)} (${formatNumber(agent.currentPriceInIq)} IQ)
      👥 Holders: ${formatNumber(agent.holdersCount)}
      🔄 Inferences: ${formatNumber(agent.inferenceCount)}
      ⚡ Status: ${agent.isActive ? "Alive" : "Latent"}
      📝 Token: ${agent.tokenContract}
      🤖 Agent: ${agent.agentContract}
    `;
			})
			.join("\n\n");

		return `🤖 *Agents*\n\n${formattedAgents}`;
	}
}
