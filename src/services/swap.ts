import { type Address, erc20Abi } from "viem";
import { fraxtal } from "viem/chains";
import { env } from "../config.js";
import { ROUTER_MINIMAL_ABI } from "../lib/router.abi.minimal.js";
import type { WalletService } from "./wallet.js";

export class SwapService {
	private walletService: WalletService;
	private routerAddress: Address;
	private baseTokenAddress: Address;
	private routerAbi;

	constructor(walletService: WalletService) {
		this.walletService = walletService;
		this.routerAddress = env.ATP_AGENT_ROUTER_ADDRESS as Address;
		this.baseTokenAddress = env.ATP_BASE_TOKEN_ADDRESS as Address;
		this.routerAbi = ROUTER_MINIMAL_ABI;
	}

	private async approveTokenAllowance(amount: bigint, tokenContract: Address) {
		const walletClient = this.walletService.getWalletClient();
		const publicClient = this.walletService.getPublicClient();

		if (!walletClient || !walletClient.account) {
			throw new Error(
				"Wallet client or account is not available. Ensure the wallet is properly initialized with a private key.",
			);
		}

		// Approve base token
		const approveTx = await walletClient.writeContract({
			address: tokenContract,
			abi: erc20Abi,
			functionName: "approve",
			args: [this.routerAddress, amount],
			chain: fraxtal,
			account: walletClient.account,
		});
		await publicClient.waitForTransactionReceipt({ hash: approveTx });
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
		const amountInWei = BigInt(amount);

		await this.approveTokenAllowance(amountInWei, this.baseTokenAddress);

		// Execute buy (using 3-arg overload, minAmountOut = 0n)
		const buyTx = await walletClient.writeContract({
			address: this.routerAddress,
			abi: this.routerAbi,
			functionName: "buy",
			args: [tokenContract, amountInWei, 0n],
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
		const amountInWei = BigInt(amount);

		await this.approveTokenAllowance(amountInWei, tokenContract);

		const sellTx = await walletClient.writeContract({
			address: this.routerAddress,
			abi: this.routerAbi,
			functionName: "sell",
			args: [tokenContract, amountInWei, 0n],
			chain: fraxtal,
			account: walletClient.account,
		});
		await publicClient.waitForTransactionReceipt({ hash: sellTx });

		return { txHash: sellTx };
	}
}
