import { env } from "@/env.js";
import {
	accounts,
	db,
	sessions,
	users,
	verifications,
} from "@syncspace/database";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user: users,
			session: sessions,
			account: accounts,
			verification: verifications,
		},
	}),
	socialProviders: {
		github: {
			clientId: env.GITHUB_ID,
			clientSecret: env.GITHUB_SECRET,
			scope: ["read:user", "user:email", "repo"],
			mapProfileToUser(profile) {
				return {
					name: profile.name,
					email: profile.email,
					username: profile.login,
					avatar: profile.avatar_url,
				};
			},
		},
	},
	user: {
		additionalFields: {
			username: {
				type: "string",
				unique: true,
			},
		},
	},
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
