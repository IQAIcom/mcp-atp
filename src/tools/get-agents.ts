import { elizaLogger } from "@elizaos/core";
import { z } from "zod";
import { GetAgentsService } from "../services/get-agents.js";

const GetAgentsParamsSchema = z.object({
	sort: z
		.enum(["mcap", "holders", "inferences"])
		.optional()
		.describe(
			`
        Sort agents by market cap, holders count, or inference count.
        Available options are:
        - mcap: Sort by market cap
        - holders: Sort by holders count
        - inferences: Sort by inference count
        Defaults to market cap if not specified.
      `,
		),
	limit: z.number().int().min(1).max(100).optional().default(100),
});

export const getAgentsTool = {
	name: "ATP_GET_AGENTS",
	description:
		"Retrieve a list of AI agents from the ATP platform with optional sorting and limiting.",
	parameters: GetAgentsParamsSchema,
	execute: async (params: z.infer<typeof GetAgentsParamsSchema>) => {
		try {
			elizaLogger.info("🤖 Executing ATP_GET_AGENTS tool", { params });

			const validatedParams = GetAgentsParamsSchema.parse(params);

			const agentsService = new GetAgentsService();
			const agents = await agentsService.getAgents(validatedParams);

			const formattedAgents = agentsService.formatAgents(agents);

			elizaLogger.info("✅ Successfully retrieved agents", {
				count: agents.length,
				sort: validatedParams.sort,
				limit: validatedParams.limit,
			});

			return formattedAgents;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			elizaLogger.error("❌ Failed to get agents", { error: errorMessage });
			throw new Error(`Failed to retrieve agents: ${errorMessage}`);
		}
	},
} as const;
