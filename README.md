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
* pnpm (See <https://pnpm.io/installation>)

## Installation

There are a few ways to use `mcp-atp`:

**1. Using `pnpm dlx` (Recommended for most MCP client setups):**

   You can run the server directly using `pnpm dlx` without needing a global installation. This is often the easiest way to integrate with MCP clients. See the "Running the Server with an MCP Client" section for examples.
   (`pnpm dlx` is pnpm's equivalent of `npx`)

**2. Global Installation from npm (via pnpm):**

   Install the package globally to make the `mcp-atp` command available system-wide:

   ```bash
   pnpm add -g @iqai/mcp-atp
   ```

**3. Building from Source (for development or custom modifications):**

   1. **Clone the repository:**

      ```bash
      git clone https://github.com/IQAIcom/mcp-atp.git
      cd mcp-atp
      ```

   2. **Install dependencies:**

      ```bash
      pnpm install
      ```

   3. **Build the server:**
      This compiles the TypeScript code to JavaScript in the `dist` directory.

      ```bash
      pnpm run build
      ```

      The `prepare` script also runs `pnpm run build`, so dependencies are built upon installation if you clone and run `pnpm install`.

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

Below is an example configuration snippet that an MCP client might use (e.g., in a `mcp_servers.json` or similar configuration file). This example shows how to run the server using the published npm package via `pnpm dlx`.

```json
{
  "mcpServers": {
    "iq-atp-mcp-server": {
      "command": "pnpm",
      "args": [
        "dlx",
        "@iqai/mcp-atp"
      ],
      "env": {
        "WALLET_PRIVATE_KEY": "your_wallet_private_key_here",
        "ATP_API_KEY": "your_iq_atp_api_key_if_needed_by_server_env",
        "ATP_USE_DEV": "false"
      }
    }
  }
}
```

**Alternative if Globally Installed:**

If you have installed `mcp-atp` globally (`pnpm add -g @iqai/mcp-atp`), you can simplify the `command` and `args`:

```json
{
  "mcpServers": {
    "iq-atp-mcp-server": {
      "command": "mcp-atp",
      "args": [],
      "env": {
        "WALLET_PRIVATE_KEY": "your_wallet_private_key_here",
        "ATP_API_KEY": "your_iq_atp_api_key_if_needed_by_server_env",
        "ATP_USE_DEV": "false"
      }
    }
  }
}
```

* **`command`**: The executable to run.
  * For `pnpm dlx`: `"pnpm"` (with `"dlx"` as the first arg)
  * For global install: `"mcp-atp"`
* **`args`**: An array of arguments to pass to the command.
  * For `pnpm dlx`: `["dlx", "@iqai/mcp-atp"]`
  * For global install: `[]`
* **`env`**: An object containing environment variables to be set when the server process starts. This is where you provide `WALLET_PRIVATE_KEY`, `ATP_API_KEY` (if needed by the server env), and `ATP_USE_DEV`.
* **`workingDirectory`**: Generally not required when using the published package via `pnpm dlx` or a global install, as the package should handle its own paths correctly. If you were running from source (`node dist/index.js`), then setting `workingDirectory` to the project root would be important.
