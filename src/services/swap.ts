import { type Address, erc20Abi } from "viem";
import { fraxtal } from "viem/chains";
import {
	AGENT_ROUTER_ADDRESS,
	BASE_TOKEN_ADDRESS,
	DEV_AGENT_ROUTER_ADDRESS,
	DEV_BASE_TOKEN_ADDRESS,
} from "../constants.js";
import { ROUTER_ABI } from "../lib/router.abi.js";
import { DEV_ROUTER_ABI } from "../lib/router.abi.dev.js";
import type { WalletService } from "./wallet.js";

export class SwapService {
	private walletService: WalletService;
	private routerAddress: Address;
	private baseTokenAddress: Address;
	private routerAbi;

	constructor(walletService: WalletService) {
		this.walletService = walletService;
		this.routerAddress = (
			process.env.ATP_USE_DEV ? DEV_AGENT_ROUTER_ADDRESS : AGENT_ROUTER_ADDRESS
		) as Address;
		this.baseTokenAddress = (
			process.env.ATP_USE_DEV ? DEV_BASE_TOKEN_ADDRESS : BASE_TOKEN_ADDRESS
		) as Address;
		this.routerAbi = process.env.ATP_USE_DEV ? DEV_ROUTER_ABI : ROUTER_ABI;
	}

	async buy({
		tokenContract,
		amount,
	}: { tokenContract: Address; amount: string }) {
		const walletClient = this.walletService.getWalletClient();
		const publicClient = this.walletService.getPublicClient();

		if (!walletClient || !walletClient.account) {
			throw new Error(
				"Wallet client or account is not available. Ensure the wallet is properly initialized with a private key.",
			);
		}

		const amountInWei = BigInt(Number(amount) * 1e18);

		// Approve base token
		const approveTx = await walletClient.writeContract({
			address: this.baseTokenAddress,
			abi: erc20Abi,
			functionName: "approve",
			args: [this.routerAddress, amountInWei],
			chain: fraxtal,
			account: walletClient.account,
		});
		await publicClient.waitForTransactionReceipt({ hash: approveTx });

		// Execute buy
		const buyTx = await walletClient.writeContract({
			address: this.routerAddress,
			abi: this.routerAbi,
			functionName: "buy",
			args: process.env.ATP_USE_DEV
				? [tokenContract, amountInWei]
				: [tokenContract, amountInWei, 0n],
			chain: fraxtal,
			account: walletClient.account,
		});
		await publicClient.waitForTransactionReceipt({ hash: buyTx });

		return { txHash: buyTx };
	}

	async sell({
		tokenContract,
		amount,
	}: { tokenContract: Address; amount: string }) {
		const walletClient = this.walletService.getWalletClient();
		const publicClient = this.walletService.getPublicClient();

		if (!walletClient || !walletClient.account) {
			throw new Error(
				"Wallet client or account is not available. Ensure the wallet is properly initialized with a private key.",
			);
		}

		const amountInWei = BigInt(Number(amount) * 1e18);
		// Approve agent token
		const approveTx = await walletClient.writeContract({
			address: tokenContract,
			abi: erc20Abi,
			functionName: "approve",
			args: [this.routerAddress, amountInWei],
			chain: fraxtal,
			account: walletClient.account,
		});
		await publicClient.waitForTransactionReceipt({ hash: approveTx });

		// Execute sell
		const sellTx = await walletClient.writeContract({
			address: this.routerAddress,
			abi: this.routerAbi,
			functionName: "sell",
			args: process.env.ATP_USE_DEV
				? [tokenContract, amountInWei]
				: [tokenContract, amountInWei, 0n],
			chain: fraxtal,
			account: walletClient.account,
		});
		await publicClient.waitForTransactionReceipt({ hash: sellTx });

		return { txHash: sellTx };
	}
}
