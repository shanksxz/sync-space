import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { accounts, and, eq, ne, users } from "@syncspace/database";
import { TRPCError } from "@trpc/server";
import { Octokit } from "octokit";
import { z } from "zod";

export const userRouter = createTRPCRouter({
	getUserRepos: protectedProcedure.query(async ({ ctx }) => {
		try {
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
				const { data: repos } =
					await octokit.rest.repos.listForAuthenticatedUser({
						sort: "pushed",
						per_page: 10,
						visibility: "all",
					});
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
		} catch (error) {
			console.error(error);
			if (error instanceof TRPCError) {
				throw error;
			}
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch repositories",
			});
		}
	}),
	getUserAccessToken: protectedProcedure.query(async ({ ctx }) => {
		try {
			const user = ctx.session.user;
			const userAccount = await ctx.db.query.accounts.findFirst({
				where: and(
					eq(accounts.userId, user.id),
					eq(accounts.providerId, "github"),
				),
			});

			if (!userAccount) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "GitHub account not connected",
				});
			}

			return {
				hasToken: !!userAccount.accessToken,
			};
		} catch (error) {
			console.error(error);
			if (error instanceof TRPCError) {
				throw error;
			}
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch user access token",
			});
		}
	}),

	//TODO: fix this
	getAllUsers: protectedProcedure.query(async ({ ctx }) => {
		try {
			const allUsers = await ctx.db.query.users.findMany({
				limit: 100,
				orderBy: (users, { desc }) => [desc(users.createdAt)],
			});

			return allUsers.map((user) => ({
				id: user.id,
				name: user.name,
				email: user.email,
				image: user.image,
			}));
		} catch (error) {
			console.error(error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch users",
			});
		}
	}),

	getUserById: protectedProcedure
		.input(
			z.object({
				id: z.string().min(1, "User ID is required"),
			}),
		)
		.query(async ({ ctx, input }) => {
			try {
				const { id } = input;
				const user = await ctx.db.query.users.findFirst({
					where: eq(users.id, id),
				});

				if (!user) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "User not found",
					});
				}

				return {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
					username: user.username,
				};
			} catch (error) {
				console.error(error);
				if (error instanceof TRPCError) {
					throw error;
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch user",
				});
			}
		}),
	//? in future we might add authentication other than github
	updateProfile: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1, "Name is required"),
				username: z.string().min(1, "Username is required"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const { name, username } = input;
				const userId = ctx.session.user.id;

				const existingUser = await ctx.db.query.users.findFirst({
					where: and(eq(users.username, username), ne(users.id, userId)),
				});

				if (existingUser) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Username is already taken",
					});
				}

				await ctx.db
					.update(users)
					.set({
						name,
						username,
					})
					.where(eq(users.id, userId));

				return {
					success: true,
				};
			} catch (error) {
				console.error(error);
				if (error instanceof TRPCError) {
					throw error;
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update profile",
				});
			}
		}),
});
