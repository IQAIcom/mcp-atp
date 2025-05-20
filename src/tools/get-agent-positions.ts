import z from "zod";
import { AgentPositionsService } from "../services/agent-positions.js";
import { WalletService } from "../services/wallet.js";

export const getAgentPositionsTool = {
	name: "ATP_GET_AGENT_POSITIONS",
	description: "Retrieve the positions of the user's agent tokens.",
	execute: async () => {
		const walletPrivateKey = process.env.ATP_WALLET_PRIVATE_KEY;
		if (!walletPrivateKey) {
			throw new Error(
				"ATP_WALLET_PRIVATE_KEY is not set. Please set it in your environment variables.",
			);
		}
		const walletService = new WalletService(walletPrivateKey);
		const agentPositionsService = new AgentPositionsService(walletService);

		try {
			const positions = await agentPositionsService.getPositions();
			const formattedPositions =
				agentPositionsService.formatPositions(positions);
			return formattedPositions;
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred while fetching user's agent positions.";
			console.error(`[ATP_GET_AGENT_POSITIONS] Error: ${message}`);
			throw new Error(message);
		}
	},
};
