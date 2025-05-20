import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../constants.js";
import { API_URLS, DEV_API_URLS } from "../constants.js";
import {
	type GetLogsParams,
	type GetLogsResponse,
	type LogEntry,
	LogType,
	type PostLogParams,
} from "../types.js";

export class AgentLogsService {
	async getLogs({
		agentTokenContract,
		page = DEFAULT_PAGE,
		limit = DEFAULT_LIMIT,
	}: GetLogsParams): Promise<GetLogsResponse> {
		try {
			const endPoint = process.env.ATP_USE_DEV
				? DEV_API_URLS.LOGS
				: API_URLS.LOGS;
			const queryParams = new URLSearchParams({
				agentTokenContract,
				page: page.toString(),
				limit: limit.toString(),
			});

			const response = await fetch(`${endPoint}?${queryParams.toString()}`);

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			return (await response.json()) as GetLogsResponse;
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw new Error(`Failed to fetch agent logs: ${error.message}`);
			}
			throw new Error("Failed to fetch agent logs due to an unknown error.");
		}
	}

	async addLog({
		agentTokenContract,
		content,
		apiKey,
		txHash,
		chainId,
	}: PostLogParams): Promise<LogEntry> {
		try {
			const endPoint = process.env.ATP_USE_DEV
				? DEV_API_URLS.LOGS
				: API_URLS.LOGS;
			const response = await fetch(endPoint, {
				method: "POST",
				headers: {
					apiKey,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					agentTokenContract,
					content,
					txHash,
					chainId,
					type: LogType.Agent,
				}),
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			return (await response.json()) as LogEntry;
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw new Error(`Failed to add agent log: ${error.message}`);
			}
			throw new Error("Failed to add agent log due to an unknown error.");
		}
	}
	formatLogs(data: GetLogsResponse): string {
		if (!data.logs.length) {
			return "No logs found for this agent.";
		}

		const logsText = data.logs
			.map((log) => {
				const date = new Date(log.createdAt).toLocaleString();
				return `[${date}] [${log.type}] ${log.content} \n Tx Hash: ${log.txHash} \n Chain ID: ${log.chainId}`;
			})
			.join("\n");

		return `Agent Logs (Page ${data.page} of ${data.totalPages}, showing ${data.logs.length} of ${data.total} logs):\n${logsText}`;
	}
}
