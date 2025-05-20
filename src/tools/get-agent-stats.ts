import { z } from "zod";
import { AgentStatsService } from "../services/agent-stats.js";

const GetAgentStatsParams = z.object({
	tokenContract: z
		.string()
		.startsWith("0x", {
			message:
				"Token contract must be a valid Ethereum address starting with 0x.",
		})
		.describe("The contract address of the agent token (e.g., 0x123...abc)."),
});

export const getAgentStatsTool = {
	name: "ATP_AGENT_STATS",
	description:
		"Get statistics and details of a given AI agent on the ATP platform.",
	parameters: GetAgentStatsParams,
	execute: async (args: z.infer<typeof GetAgentStatsParams>) => {
		console.log(`[ATP_AGENT_STATS] Called with: ${JSON.stringify(args)}`);
		const statsService = new AgentStatsService();

		try {
			const stats = await statsService.getStats(args.tokenContract);
			const formattedStats = statsService.formatStats(stats);

			return formattedStats;
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred while fetching agent stats.";
			console.error(`[ATP_AGENT_STATS] Error: ${message}`);
			throw new Error(message);
		}
	},
};
