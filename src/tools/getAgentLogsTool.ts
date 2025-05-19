import { z } from "zod";
import { AgentLogsService } from "../services/agent-logs.js";
import { DEFAULT_PAGE, DEFAULT_LIMIT } from "../constants.js";

const GetAgentLogsParamsSchema = z.object({
	agentTokenContract: z
		.string()
		.startsWith("0x", {
			message:
				"Agent token contract must be a valid Ethereum address starting with 0x.",
		})
		.describe("The contract address of the agent token."),
	page: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(`Page number for pagination. Defaults to ${DEFAULT_PAGE}.`),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(`Number of logs per page. Defaults to ${DEFAULT_LIMIT}.`),
});

export const getAgentLogsTool = {
	name: "ATP_GET_AGENT_LOGS",
	description: "Retrieve logs for a specific AI agent, with pagination.",
	parameters: GetAgentLogsParamsSchema,
	execute: async (args: z.infer<typeof GetAgentLogsParamsSchema>) => {
		console.log(`[ATP_GET_AGENT_LOGS] Called with: ${JSON.stringify(args)}`);
		const agentLogsService = new AgentLogsService();

		try {
			const logsData = await agentLogsService.getLogs({
				agentTokenContract: args.agentTokenContract,
				page: args.page ?? DEFAULT_PAGE,
				limit: args.limit ?? DEFAULT_LIMIT,
			});
			return agentLogsService.formatLogs(logsData);
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred while fetching agent logs.";
			console.error(`[ATP_GET_AGENT_LOGS] Error: ${message}`);
			throw new Error(message);
		}
	},
};
