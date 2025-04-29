import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc";
import { accounts, and, eq, users } from "@syncspace/database";
import { TRPCError } from "@trpc/server";
import { Octokit } from "octokit";

export const userRouter = createTRPCRouter({
	getUserRepos: protectedProcedure.query(async ({ ctx }) => {
		const user = ctx.session.user;
		const userAccount = await ctx.db.query.accounts.findFirst({
			where: and(
				eq(accounts.userId, user.id),
				eq(accounts.providerId, "github"),
			),
		});

		if (!userAccount || !userAccount.accessToken) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "GitHub account not connected or missing access token",
			});
		}

		const octokit = new Octokit({
			auth: userAccount.accessToken,
		});

		try {
			const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser(
				{
					sort: "pushed",
					per_page: 10,
					visibility: "all",
				},
			);
			return repos.map((repo) => ({
				id: repo.id,
				name: repo.name,
				fullName: repo.full_name,
				private: repo.private,
				description: repo.description,
				url: repo.html_url,
				updatedAt: repo.updated_at,
				language: repo.language,
				defaultBranch: repo.default_branch,
			}));
		} catch (error) {
			console.error("Error fetching GitHub repositories:", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch GitHub repositories",
			});
		}
	}),
	//TODO: This is a temporary function to get the user's access token
	getUserAccessToken: protectedProcedure.query(async ({ ctx }) => {
		const user = ctx.session.user;
		const userAccount = await ctx.db.query.accounts.findFirst({
			where: and(
				eq(accounts.userId, user.id),
				eq(accounts.providerId, "github"),
			),
		});
		return userAccount?.accessToken;
	}),
});