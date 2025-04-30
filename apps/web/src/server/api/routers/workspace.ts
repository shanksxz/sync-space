import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { eq, workspaces } from "@syncspace/database";
import { z } from "zod";

export const workspaceRouter = createTRPCRouter({
	createWorkspace: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				description: z.string(),
				repoUrl: z.string(),
				branch: z.string(),
				teamId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { name, description, repoUrl, branch, teamId } = input;
			const workspace = await ctx.db.insert(workspaces).values({
				name,
				description,
				githubRepoUrl: repoUrl,
				githubBranch: branch,
				teamId,
				ownerId: ctx.session.user.id,
			});
			return workspace;
		}),
	getWorkspaces: protectedProcedure.query(async ({ ctx }) => {
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
	}),
	//TODO: This is a temporary function to get the repo name for the workspace
	getRepoName: protectedProcedure
		.input(
			z.object({
				workspaceId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const workspace = await ctx.db.query.workspaces.findFirst({
				where: eq(workspaces.id, input.workspaceId),
			});
			return workspace;
		}),
	deleteWorkspace: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id } = input;
			const workspace = await ctx.db
				.delete(workspaces)
				.where(eq(workspaces.id, id));
			return workspace;
		}),
	getWorkspaceById: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { id } = input;
			const workspace = await ctx.db.query.workspaces.findFirst({
				where: eq(workspaces.id, id),
			});
			return workspace;
		}),
	updateWorkspace: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string(),
				description: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, name, description } = input;
			const workspace = await ctx.db
				.update(workspaces)
				.set({
					name,
					description,
				})
				.where(eq(workspaces.id, id));
			return workspace;
		}),
});
