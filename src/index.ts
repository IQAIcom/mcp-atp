import { FastMCP } from "fastmcp";
import { addAgentLogTool } from "./tools/add-agent-log.js";
import { buyAgentTool } from "./tools/buy.js";
import { getAgentLogsTool } from "./tools/get-agent-logs.js";
import { getAgentPositionsTool } from "./tools/get-agent-positions.js";
import { getAgentStatsTool } from "./tools/get-agent-stats.js";
import { sellAgentTool } from "./tools/sell.js";
async function main() {
	console.log("Initializing MCP ATP Server...");

	const server = new FastMCP({
		name: "IQAI ATP MCP Server",
		version: "0.0.1",
	});

	server.addTool(getAgentStatsTool);
	server.addTool(getAgentLogsTool);
	server.addTool(addAgentLogTool);
	server.addTool(buyAgentTool);
	server.addTool(sellAgentTool);
	server.addTool(getAgentPositionsTool);

	try {
		await server.start({
			transportType: "stdio",
		});
		console.log("✅ IQ ATP MCP Server started successfully over stdio.");
		console.log("You can now connect to it using an MCP client.");
	} catch (error) {
		console.error("❌ Failed to start IQ ATP MCP Server:", error);
		process.exit(1);
	}
}

main().catch((error) => {
	console.error("❌ An unexpected error occurred:", error);
	process.exit(1);
});
