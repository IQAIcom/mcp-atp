import { z } from "zod";
import { AgentLogsService } from "../services/agent-logs.js";

const AddAgentLogParamsSchema = z.object({
	agentTokenContract: z
		.string()
		.startsWith("0x", {
			message:
				"Agent token contract must be a valid Ethereum address starting with 0x.",
		})
		.describe("The contract address of the agent token."),
	content: z
		.string()
		.min(1, { message: "Log content cannot be empty." })
		.describe("The content of the log message."),
	txHash: z
		.string()
		.optional()
		.describe("Optional transaction hash associated with this log entry."),
	chainId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe("Optional chain ID associated with this log entry."),
});

export const addAgentLogTool = {
	name: "ATP_ADD_AGENT_LOG",
	description:
		"Add a new log entry for a specific AI agent. Requires API key as a parameter.",
	parameters: AddAgentLogParamsSchema,
	execute: async (args: z.infer<typeof AddAgentLogParamsSchema>) => {
		const apiKey = process.env.ATP_API_KEY;
		if (!apiKey) {
			throw new Error(
				"ATP_API_KEY is not set. Please set it in your environment variables.",
			);
		}
		console.log(`[ATP_ADD_AGENT_LOG] Called with: ${JSON.stringify(args)}`);
		const agentLogsService = new AgentLogsService();

		try {
			const newLogEntry = await agentLogsService.addLog({
				agentTokenContract: args.agentTokenContract,
				content: args.content,
				apiKey: apiKey,
				txHash: args.txHash,
				chainId: args.chainId,
			});
			return `✅ Log added successfully for agent ${args.agentTokenContract}. Log ID: ${newLogEntry.id}`;
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred while adding agent log.";
			console.error(`[ATP_ADD_AGENT_LOG] Error: ${message}`);
			throw new Error(message);
		}
	},
};
