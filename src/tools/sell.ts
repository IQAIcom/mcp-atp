import type { Address } from "viem";
import { z } from "zod";
import { env } from "../config.js";
import { SwapService } from "../services/swap.js";
import { WalletService } from "../services/wallet.js";

const SellAgentParamsSchema = z.object({
	tokenContract: z
		.string()
		.startsWith("0x", {
			message:
				"Token contract must be a valid Ethereum address starting with 0x.",
		})
		.length(42, {
			message: "Token contract address must be 42 characters long.",
		})
		.describe("The contract address of the agent token to sell."),
	amount: z
		.string()
		.regex(/^\d+$/, { message: "Amount must be a valid integer in wei." })
		.describe(
			"The amount of agent tokens to sell, specified in wei units (e.g., '1000000000000000000' for 1 token).",
		),
});

export const sellAgentTool = {
	name: "ATP_SELL_AGENT",
	description: "Sell AI agent tokens back to the protocol.",
	parameters: SellAgentParamsSchema,
	execute: async (args: z.infer<typeof SellAgentParamsSchema>) => {
		const walletPrivateKey = env.ATP_WALLET_PRIVATE_KEY;
		if (!walletPrivateKey) {
			throw new Error(
				"WALLET_PRIVATE_KEY is not set in the environment. This is required to execute trades.",
			);
		}

		console.log(
			`[ATP_SELL_AGENT] Called with token ${args.tokenContract}, amount: ${args.amount}`,
		);

		try {
			const walletService = new WalletService(walletPrivateKey);
			const swapService = new SwapService(walletService);

			const result = await swapService.sell({
				tokenContract: args.tokenContract as Address,
				amount: args.amount,
			});

			return `
			✅ Successfully sold tokens for agent ${args.tokenContract}.
			Transaction Hash: ${result.txHash}
			`;
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred during the sell transaction.";
			console.error(`[ATP_SELL_AGENT] Error: ${message}`);
			throw new Error(`Failed to sell agent tokens: ${message}`);
		}
	},
};
