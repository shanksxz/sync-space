import { env } from "@/env.js";
import { convexAdapter } from "@better-auth-kit/convex";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { ConvexHttpClient } from "convex/browser";

const convexClient = new ConvexHttpClient(env.CONVEX_URL);

export const auth = betterAuth({
	database: convexAdapter(convexClient),
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
					image: profile.avatar_url,
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
