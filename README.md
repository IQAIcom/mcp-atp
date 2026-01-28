# 🤖 MCP-ATP: Agent Tokenization Platform

[![npm version](https://img.shields.io/npm/v/@iqai/mcp-atp.svg)](https://www.npmjs.com/package/@iqai/mcp-atp)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## 📖 Overview

The MCP-ATP Server enables AI agents to interact with IQ AI's [Agent Tokenization Platform (ATP)](https://agents.iq.wiki). This server provides comprehensive access to agent statistics, token positions, trading functionalities, and agent logs.

By implementing the Model Context Protocol (MCP), this server allows Large Language Models (LLMs) to discover AI agents, analyze agent performance, trade agent tokens, and manage agent logs directly through their context window, bridging the gap between AI and decentralized agent tokenization.

## ✨ Features

*   **Agent Discovery**: Search and retrieve AI agent statistics and details.
*   **Portfolio Tracking**: Monitor user holdings in ATP AI tokens.
*   **Token Trading**: Buy and sell AI agent tokens using IQ as the base currency.
*   **Log Management**: Retrieve and add logs for specific AI agents.

## 📦 Installation

### 🚀 Using pnpm dlx (Recommended)

To use this server without installing it globally:

```bash
pnpm dlx @iqai/mcp-atp
```

### 🔧 Build from Source

```bash
git clone https://github.com/IQAIcom/mcp-atp.git
cd mcp-atp
pnpm install
pnpm run build
```

## ⚡ Running with an MCP Client

Add the following configuration to your MCP client settings (e.g., `claude_desktop_config.json`).

### 📋 Minimal Configuration

```json
{
  "mcpServers": {
    "atp": {
      "command": "pnpm",
      "args": ["dlx", "@iqai/mcp-atp"],
      "env": {
        "ATP_WALLET_PRIVATE_KEY": "your_wallet_private_key_here"
      }
    }
  }
}
```

### ⚙️ Advanced Configuration (Local Build)

```json
{
  "mcpServers": {
    "atp": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-atp/dist/index.js"],
      "env": {
        "ATP_WALLET_PRIVATE_KEY": "your_wallet_private_key_here",
        "ATP_API_KEY": "your_atp_api_key_if_needed"
      }
    }
  }
}
```

## 🔐 Configuration (Environment Variables)

| Variable | Required | Description | Default |
| :--- | :--- | :--- | :--- |
| `ATP_WALLET_PRIVATE_KEY` | Yes* | Wallet private key for trading and position queries | - |
| `ATP_API_KEY` | No | API key for certain backend services | - |

*Required for `ATP_GET_AGENT_POSITIONS`, `ATP_BUY_AGENT`, `ATP_SELL_AGENT` tools.

**Security Note:** Handle the private key with extreme care. Ensure it is stored securely and only provided to trusted MCP client configurations.

## 💡 Usage Examples

### 🔍 Agent Discovery
*   "What are the top AI agents on ATP?"
*   "Get statistics for agent with token contract 0x123..."
*   "Search for AI agents by name or category."

### 📊 Portfolio Management
*   "What are my current positions in ATP AI tokens?"
*   "Show me my holdings in wallet 0xabc..."

### 💹 Trading
*   "Buy 100 IQ worth of agent tokens for 0x123..."
*   "Sell my position in agent 0x456..."

### 📝 Log Management
*   "Get the latest logs for agent 0x123..."
*   "Add a new log entry for my agent."

## 🛠️ MCP Tools

<!-- AUTO-GENERATED TOOLS START -->

### `ATP_ADD_AGENT_LOG`
Add a new log entry for a specific AI agent. Requires API key as a parameter.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `agentTokenContract` | string | Yes | The contract address of the agent token. |
| `content` | string | Yes | The content of the log message. |
| `txHash` | string | No | Optional transaction hash associated with this log entry. |
| `chainId` | integer | No | Optional chain ID associated with this log entry. |

### `ATP_AGENT_STATS`
Get statistics and details of a given AI agent on the ATP platform.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tokenContract` | string | Yes | The contract address of the agent token (e.g., 0x123...abc). |

### `ATP_BUY_AGENT`
Buy AI agent tokens using IQ as the base currency.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tokenContract` | string | Yes | The contract address of the agent token to buy. |
| `amount` | string | Yes | The amount of base currency (IQ) to spend for buying the agent token, specified in wei units (e.g., '1000000000000000000' for 1 IQ). |

### `ATP_GET_AGENT_LOGS`
Retrieve logs for a specific AI agent, with pagination.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `agentTokenContract` | string | Yes | The contract address of the agent token. |
| `page` | integer | No | Page number for pagination. Defaults to 1. |
| `limit` | integer | No | Number of logs per page. Defaults to 10. |

### `ATP_GET_AGENT_POSITIONS`
Retrieve the positions of the user

_No parameters_

### `ATP_GET_AGENTS`
Retrieve a list of AI agents from the ATP platform with optional sorting and limiting.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sort` | enum | No | Sort agents by market cap, holders count, or inference count. Available options are: - mcap: Sort by market cap - holders: Sort by holders count - inferences: Sort by inference count Defaults to market cap if not specified. |

### `ATP_SELL_AGENT`
Sell AI agent tokens back to the protocol.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tokenContract` | string | Yes | The contract address of the agent token to sell. |
| `amount` | string | Yes | The amount of agent tokens to sell, specified in wei units (e.g., '1000000000000000000' for 1 token). |

<!-- AUTO-GENERATED TOOLS END -->

## 👨‍💻 Development

### 🏗️ Build Project
```bash
pnpm run build
```

### 👁️ Development Mode (Watch)
```bash
pnpm run watch
```

### ✅ Linting & Formatting
```bash
pnpm run lint
pnpm run format
```

### 📁 Project Structure
*   `src/tools/`: Individual tool definitions
*   `src/services/`: API client and business logic
*   `src/lib/`: Shared utilities
*   `src/index.ts`: Server entry point

## 📚 Resources

*   [IQ AI Agents Platform](https://agents.iq.wiki)
*   [Model Context Protocol (MCP)](https://modelcontextprotocol.io)
*   [IQ Wiki](https://iq.wiki)

## ⚠️ Disclaimer

This project interacts with blockchain-based financial operations. Users should exercise caution and verify all transactions independently. Trading in agent tokens involves risk.

## 📄 License

[ISC](LICENSE)
