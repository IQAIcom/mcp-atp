export const ROUTER_MINIMAL_ABI = [
	{
		inputs: [
			{ internalType: "address", name: "_agentToken", type: "address" },
			{ internalType: "uint256", name: "_amountIn", type: "uint256" },
			{ internalType: "uint256", name: "_minAmountOut", type: "uint256" },
		],
		name: "buy",
		outputs: [{ internalType: "uint256", name: "_amountOut", type: "uint256" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_agentToken", type: "address" },
			{ internalType: "uint256", name: "_amountIn", type: "uint256" },
			{ internalType: "uint256", name: "_minAmountOut", type: "uint256" },
		],
		name: "sell",
		outputs: [{ internalType: "uint256", name: "_amountOut", type: "uint256" }],
		stateMutability: "nonpayable",
		type: "function",
	},
] as const;
