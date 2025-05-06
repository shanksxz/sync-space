import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { GitHubService } from "@/services/github";
import { accounts, eq, teamMembers, workspaces } from "@syncspace/database";
import { and, inArray } from "@syncspace/database";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const workspaceRouter = createTRPCRouter({
	importRepository: protectedProcedure
		.input(
			z.object({
				workspaceId: z.string().min(1, "Workspace ID is required"),
				repoOwner: z.string().min(1, "Repository owner is required"),
				repoName: z.string().min(1, "Repository name is required"),
				branch: z.string().min(1, "Branch name is required"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const { workspaceId, repoOwner, repoName, branch } = input;

				const workspace = await ctx.db.query.workspaces.findFirst({
					where: eq(workspaces.id, workspaceId),
					with: {
						team: {
							with: {
								teamMembers: {
									where: eq(teamMembers.userId, ctx.session.user.id),
								},
							},
						},
					},
				});

				if (!workspace) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Workspace not found",
					});
				}

				if (!workspace.team?.teamMembers.length) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "You don't have access to this workspace",
					});
				}

				const account = await ctx.db.query.accounts.findFirst({
					where: and(
						eq(accounts.userId, ctx.session.user.id),
						eq(accounts.providerId, "github"),
					),
				});

				if (!account || !account.accessToken) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "GitHub account not connected or missing access token",
					});
				}

				const githubService = new GitHubService(
					account.accessToken,
					env.LIVE_BLOCKS_SECRET_KEY,
				);

				const repo = await githubService.importRepository(
					repoOwner,
					repoName,
					branch,
					workspaceId,
				);

				if (!repo) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Repository not found",
					});
				}

				return {
					message: "Repository imported successfully",
					repo,
				};
			} catch (error) {
				console.error(error);
				if (error instanceof TRPCError) {
					throw error;
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to import repository",
				});
			}
		}),
	createWorkspace: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1, "Name is required"),
				description: z.string(),
				repoUrl: z.string().url("Must be a valid URL"),
				branch: z.string().min(1, "Branch is required"),
				teamId: z.string().min(1, "Team ID is required"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const { name, description, repoUrl, branch, teamId } = input;

				const teamMember = await ctx.db.query.teamMembers.findFirst({
					where: and(
						eq(teamMembers.teamId, teamId),
						eq(teamMembers.userId, ctx.session.user.id),
					),
				});

				if (!teamMember) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "You are not a member of this team",
					});
				}

				const [workspace] = await ctx.db
					.insert(workspaces)
					.values({
						name,
						description,
						githubRepoUrl: repoUrl,
						githubBranch: branch,
						teamId,
						ownerId: ctx.session.user.id,
					})
					.returning();

				if (!workspace) {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Failed to create workspace",
					});
				}

				return workspace;
			} catch (error) {
				console.error(error);
				if (error instanceof TRPCError) {
					throw error;
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create workspace",
				});
			}
		}),
	getWorkspaces: protectedProcedure.query(async ({ ctx }) => {
		try {
			const workspaces = await ctx.db.query.workspaces.findMany({
				with: {
					team: {
						columns: {
							name: true,
						},
					},
				},
			});
			return workspaces;
		} catch (error) {
			console.error(error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch workspaces",
			});
		}
	}),
	getRepoName: protectedProcedure
		.input(
			z.object({
				workspaceId: z.string().min(1, "Workspace ID is required"),
			}),
		)
		.query(async ({ ctx, input }) => {
			try {
				const workspace = await ctx.db.query.workspaces.findFirst({
					where: eq(workspaces.id, input.workspaceId),
				});

				if (!workspace) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Workspace not found",
					});
				}

				return workspace;
			} catch (error) {
				console.error(error);
				if (error instanceof TRPCError) {
					throw error;
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to get repository information",
				});
			}
		}),
	deleteWorkspace: protectedProcedure
		.input(
			z.object({
				id: z.string().min(1, "Workspace ID is required"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const { id } = input;

				const workspace = await ctx.db.query.workspaces.findFirst({
					where: eq(workspaces.id, id),
				});

				if (!workspace) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Workspace not found",
					});
				}

				if (workspace.ownerId !== ctx.session.user.id) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Only the workspace owner can delete a workspace",
					});
				}

				const result = await ctx.db
					.delete(workspaces)
					.where(eq(workspaces.id, id));

				return { success: true };
			} catch (error) {
				console.error(error);
				if (error instanceof TRPCError) {
					throw error;
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete workspace",
				});
			}
		}),
	getWorkspaceById: protectedProcedure
		.input(
			z.object({
				id: z.string().min(1, "Workspace ID is required"),
			}),
		)
		.query(async ({ ctx, input }) => {
			try {
				const { id } = input;
				const workspace = await ctx.db.query.workspaces.findFirst({
					where: eq(workspaces.id, id),
					with: {
						owner: {
							columns: {
								name: true,
								email: true,
								username: true,
								image: true,
							},
						},
					},
				});

				if (!workspace) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Workspace not found",
					});
				}

				return workspace;
			} catch (error) {
				console.error(error);
				if (error instanceof TRPCError) {
					throw error;
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch workspace",
				});
			}
		}),
	getUserWorkspaces: protectedProcedure.query(async ({ ctx }) => {
		try {
			const userTeamMembers = await ctx.db.query.teamMembers.findMany({
				where: eq(teamMembers.userId, ctx.session.user.id),
				columns: {
					teamId: true,
				},
			});

			const teamIds = userTeamMembers.map((tm) => tm.teamId);

			if (teamIds.length === 0) {
				return [];
			}

			const allUserWorkspaces = await ctx.db.query.workspaces.findMany({
				where: inArray(workspaces.teamId, teamIds),
				with: {
					team: {
						columns: {
							name: true,
						},
					},
					owner: {
						columns: {
							name: true,
							email: true,
						},
					},
				},
			});

			return allUserWorkspaces;
		} catch (error) {
			console.error(error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch user workspaces",
			});
		}
	}),
	updateWorkspace: protectedProcedure
		.input(
			z.object({
				id: z.string().min(1, "Workspace ID is required"),
				name: z.string().min(1, "Name is required"),
				description: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const { id, name, description } = input;

				const existingWorkspace = await ctx.db.query.workspaces.findFirst({
					where: eq(workspaces.id, id),
				});

				if (!existingWorkspace) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Workspace not found",
					});
				}

				if (existingWorkspace.ownerId !== ctx.session.user.id) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Only the workspace owner can update a workspace",
					});
				}

				await ctx.db
					.update(workspaces)
					.set({
						name,
						description,
					})
					.where(eq(workspaces.id, id));

				return {
					...existingWorkspace,
					name,
					description,
				};
			} catch (error) {
				console.error(error);
				if (error instanceof TRPCError) {
					throw error;
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update workspace",
				});
			}
		}),
});
