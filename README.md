# MCP-ATP: Model Context Protocol Server for IQ AI Agent Tokenization Platform

This project implements a Model Context Protocol (MCP) server to interact with the IQ AI Agent Tokenization Platform (ATP). It allows MCP-compatible clients (like AI assistants, IDE extensions, or custom applications) to access ATP functionalities such as viewing agent statistics, managing token positions, trading agent tokens, and handling agent logs.

This server is built using TypeScript and `fastmcp`.

## Features (MCP Tools)

The server exposes the following tools that MCP clients can utilize:

* **`ATP_AGENT_STATS`**: Fetch statistics and details for a specific AI agent.
  * Parameters: `tokenContract` (string)
* **`ATP_GET_AGENT_POSITIONS`**: Retrieve the user's current holdings in ATP AI tokens.
  * Requires `WALLET_PRIVATE_KEY` in the environment.
* **`ATP_BUY_AGENT`**: Purchase AI agent tokens using IQ as the base currency.
  * Parameters: `tokenContract` (string), `amount` (string)
  * Requires `WALLET_PRIVATE_KEY` in the environment.
* **`ATP_SELL_AGENT`**: Sell AI agent tokens back to the protocol.
  * Parameters: `tokenContract` (string), `amount` (string)
  * Requires `WALLET_PRIVATE_KEY` in the environment.
* **`ATP_GET_AGENT_LOGS`**: Retrieve logs for a specific AI agent, with pagination.
  * Parameters: `agentTokenContract` (string), `page` (number, optional), `limit` (number, optional)
* **`ATP_ADD_AGENT_LOG`**: Add a new log entry for a specific AI agent.
  * Parameters: `agentTokenContract` (string), `content` (string), `apiKey` (string), `txHash` (string, optional), `chainId` (number, optional)
  * Note: The `apiKey` for this tool is passed as a parameter directly by the calling client, not from the server's environment.
* **(Coming Soon)** `ATP_GET_AGENTS`: List available AI agents for trading.

## Prerequisites

* Node.js (v18 or newer recommended)
* npm (comes with Node.js)

## Installation & Building

1. **Clone the repository (if applicable):**

    ```bash
    git clone https://github.com/IQAIcom/mcp-atp.git
    cd mcp-atp
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Build the server:**
    This compiles the TypeScript code to JavaScript in the `dist` directory.

    ```bash
    npm run build
    ```

    The `prepare` script also runs `npm run build`, so dependencies are built upon installation.

## Configuration (Environment Variables)

This MCP server requires certain environment variables to be set by the MCP client that runs it. These are typically configured in the client's MCP server definition (e.g., in a `mcp.json` file for Cursor, or similar for other clients).

* **`WALLET_PRIVATE_KEY`**: (Required for `ATP_GET_AGENT_POSITIONS`, `ATP_BUY_AGENT`, `ATP_SELL_AGENT`)
  * The private key of the wallet to be used for interacting with the ATP platform (e.g., fetching positions, signing transactions for buying/selling tokens).
  * **Security Note:** Handle this private key with extreme care. Ensure it is stored securely and only provided to trusted MCP client configurations.

* **`ATP_API_KEY`**: (Potentially required for some services, e.g., if `AgentStatsService` or other services need it for their backend API calls – currently, `ATP_ADD_AGENT_LOG` takes it as a direct parameter).
  * An API key for accessing certain IQ ATP backend services.

* **`ATP_USE_DEV`**: (Optional, defaults to production if not set or not `'true'`)
  * Set to `"true"` to use the development API endpoints and contract addresses for ATP.
  * Any other value or if omitted will use production endpoints.

## Running the Server with an MCP Client

MCP clients (like AI assistants, IDE extensions, etc.) will run this server as a background process. You need to configure the client to tell it how to start your server.

Below is an example configuration snippet that an MCP client might use (e.g., in a `mcp_servers.json` or similar configuration file). This example shows how to run the server using `tsx` for live TypeScript development, but similar configurations can be made for running the built JavaScript version.

```json
{
  "mcpServers": {
    "iq-atp-mcp-server": { // A unique name for your server instance
      "command": "npx",
      "args": [
        "tsx",
        "/path/to/your/mcp-atp/src/index.ts" // Absolute path to the server's entry point (for tsx)
        // For built version: "node", "/path/to/your/mcp-atp/dist/index.js"
        // Or if globally linked/published: "mcp-atp"
      ],
      "env": {
        "WALLET_PRIVATE_KEY": "your_ethereum_private_key_here",
        "ATP_API_KEY": "your_iq_atp_api_key_if_needed_by_server_env",
        "ATP_USE_DEV": "false" // or "true"
      },
      "workingDirectory": "/path/to/your/mcp-atp" // Absolute path to the project's root directory
    }
    // ... other MCP server configurations
  }
}
```

**Explanation of Client Configuration Fields:**

* **`command`**: The executable to run (e.g., `npx`, `node`, or the server's binary name if installed globally).
* **`args`**: An array of arguments to pass to the command.
  * For `tsx`: `["tsx", "/path/to/src/index.ts"]`
  * For `node` (built version): `["/path/to/dist/index.js"]`
  * If your package is linked (`npm link`) or installed globally and the `bin` entry in `package.json` is `mcp-atp`: The command could be `mcp-atp` with empty `args` (or `npm start` from the project directory).
* **`env`**: An object containing environment variables to be set when the server process starts. This is where you provide `WALLET_PRIVATE_KEY`, `ATP_API_KEY` (if needed by the server env), and `ATP_USE_DEV`.
* **`workingDirectory`**: The directory from which the command should be executed. This should be the root of your `mcp-atp` project.

### Development

* **Watch mode:** `npm run watch` (compiles TypeScript on changes).
* **Run directly with tsx (requires `tsx` to be available):**

    ```bash
    # Ensure environment variables are set appropriately for your shell if testing this way
    WALLET_PRIVATE_KEY="your_key" ATP_USE_DEV="true" npx tsx src/index.ts
    ```

## Publishing to `npx`

Once the server is stable and built:

1. Ensure your `package.json` has the correct `bin` field pointing to `dist/index.js` and the `files` array includes `"dist"`.
2. Publish to npm:

    ```bash
    npm publish
    ```

After publishing, users should be able to run your server via `npx mcp-atp` (if `mcp-atp` is the name in your `bin` field and matches your package name or is a unique command defined in `bin`). The MCP client configuration would then simply use `"command": "npx", "args": ["mcp-atp"]` (or your chosen package name).

---
*This README provides a general guide. Specifics of client configuration may vary between different MCP-compatible applications.*
