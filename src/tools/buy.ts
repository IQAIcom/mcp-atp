import { z } from "zod";
import { SwapService } from "../services/swap.js";
import { WalletService } from "../services/wallet.js";
import type { Address } from "viem";

const BuyAgentParamsSchema = z.object({
	tokenContract: z
		.string()
		.startsWith("0x", {
			message:
				"Token contract must be a valid Ethereum address starting with 0x.",
		})
		.length(42, {
			message: "Token contract address must be 42 characters long.",
		})
		.describe("The contract address of the agent token to buy."),
	amount: z
		.string()
		.regex(/^\d+(\.\d+)?$/, { message: "Amount must be a valid number." })
		.describe(
			"The amount of base currency (IQ) to spend for buying the agent token.",
		),
});

export const buyAgentTool = {
	name: "ATP_BUY_AGENT",
	description: "Buy AI agent tokens using IQ as the base currency.",
	parameters: BuyAgentParamsSchema,
	execute: async (args: z.infer<typeof BuyAgentParamsSchema>) => {
		const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
		if (!walletPrivateKey) {
			throw new Error(
				"WALLET_PRIVATE_KEY is not set in the environment. This is required to execute trades.",
			);
		}

		console.log(
			`[ATP_BUY_AGENT] Called with token ${args.tokenContract}, amount: ${args.amount}`,
		);

		try {
			const walletService = new WalletService(walletPrivateKey);
			const swapService = new SwapService(walletService);

			const result = await swapService.buy({
				tokenContract: args.tokenContract as Address,
				amount: args.amount,
			});

			return `✅ Successfully bought tokens for agent ${args.tokenContract}. Transaction Hash: ${result.txHash}`;
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred during the buy transaction.";
			console.error(`[ATP_BUY_AGENT] Error: ${message}`);
			throw new Error(`Failed to buy agent tokens: ${message}`);
		}
	},
};
