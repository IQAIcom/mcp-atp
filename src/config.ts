import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
	ATP_WALLET_PRIVATE_KEY: z.string().min(1).optional(),
	ATP_API_URL: z.string().url().default("https://app.iqai.com/api"),
	ATP_API_KEY: z.string().min(1).optional(),
	ATP_AGENT_ROUTER_ADDRESS: z
		.string()
		.startsWith("0x")
		.length(42)
		.default("0xb1460781f019548d81ced6eac239025c05dc92a7"),
	ATP_BASE_TOKEN_ADDRESS: z
		.string()
		.startsWith("0x")
		.length(42)
		.default("0x6efb84bda519726fa1c65558e520b92b51712101"),
});

export const env = envSchema.parse(process.env);

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;
