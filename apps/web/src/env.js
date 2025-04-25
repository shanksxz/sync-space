import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		BETTER_AUTH_SECRET:
			process.env.NODE_ENV === "production"
				? z.string()
				: z.string().optional(),
		BETTER_AUTH_URL: z.string().url(),
		GITHUB_ID: z.string(),
		GITHUB_SECRET: z.string(),
		CONVEX_URL: z.string().url(),
		DATABASE_URL: z.string().url(),
		LIVE_BLOCKS_SECRET_KEY: z.string(),
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
	},
	client: {
		NEXT_PUBLIC_LIVE_BLOCKS_PUBLIC_KEY: z.string(),
	},
	runtimeEnv: {
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
		GITHUB_ID: process.env.GITHUB_ID,
		GITHUB_SECRET: process.env.GITHUB_SECRET,
		CONVEX_URL: process.env.CONVEX_URL,
		DATABASE_URL: process.env.DATABASE_URL,
		LIVE_BLOCKS_SECRET_KEY: process.env.LIVE_BLOCKS_SECRET_KEY,
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_LIVE_BLOCKS_PUBLIC_KEY:
			process.env.NEXT_PUBLIC_LIVE_BLOCKS_PUBLIC_KEY,
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
