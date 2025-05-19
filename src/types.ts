export interface ATPActionParams {
	walletPrivateKey?: string;
	apiKey?: string;
}

export interface AgentHolding {
	tokenContract: string;
	tokenAmount: string;
	name: string;
	currentPriceInUsd: number;
}

export interface AgentPositionsResponse {
	count: number;
	holdings: AgentHolding[];
}

export interface AgentStats {
	currentPriceInIq: number;
	currentPriceInUSD: number;
	marketCap: number;
	changeIn24h: number;
	holdersCount: number;
	inferenceCount: number;
	category: string;
}

export interface Agent {
	tokenContract: string;
	agentContract: string;
	isActive: boolean;
	currentPriceInIq: number;
	holdersCount: number;
	inferenceCount: number;
	name: string;
	ticker: string;
	currentPriceInUSD: number;
}

//============ Logs Types ============

export enum LogType {
	Developer = "Developer",
	Agent = "Agent",
}

export interface GetLogsParams {
	agentTokenContract: string;
	page?: number;
	limit?: number;
}

export interface PostLogParams {
	agentTokenContract: string;
	content: string;
	txHash?: string | null;
	chainId?: number | null;
	apiKey: string;
}

export interface LogEntry {
	id: string;
	agentId: string;
	content: string;
	type: LogType;
	createdAt: string;
	chainId: number;
	txHash: string | null;
}

export interface GetLogsResponse {
	logs: LogEntry[];
	total: number;
	page: number;
	totalPages: number;
}
