import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { and, eq, teamMembers, teams } from "@syncspace/database";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const teamRouter = createTRPCRouter({
	createTeam: protectedProcedure
		.input(
			z.object({
				name: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { name } = input;
			const userId = ctx.session.user.id;

			const team = await ctx.db.transaction(async (tx) => {
				const [team] = await tx
					.insert(teams)
					.values({
						name,
						ownerId: userId,
					})
					.returning();

				if (!team) {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Failed to create team",
					});
				}

				await tx.insert(teamMembers).values({
					teamId: team.id,
					userId,
				});

				return team;
			});

			return team;
		}),
	getTeamsWithMembers: protectedProcedure.query(async ({ ctx }) => {
		const teams = await ctx.db.query.teams.findMany({
			with: {
				owner: {
					columns: {
						name: true,
					},
				},
				teamMembers: {
					with: {
						user: true,
					},
				},
			},
		});
		return teams;
	}),
	getTeams: protectedProcedure.query(async ({ ctx }) => {
		const [team] = await ctx.db.query.teams.findMany({
			where: eq(teams.ownerId, ctx.session.user.id),
		});
		return team;
	}),
	getTeamById: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { id } = input;
			const team = await ctx.db.query.teams.findFirst({
				where: eq(teams.id, id),
			});
			return team;
		}),
	addTeamMember: protectedProcedure
		.input(
			z.object({
				teamId: z.string(),
				userId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { teamId, userId } = input;

			//     if (!team) {
			//         throw new TRPCError({
			//             code: "INTERNAL_SERVER_ERROR",
			//             message: "Failed to add team member",
			//         });
			//     }

			//     return team;
			// });
			const team = await ctx.db.insert(teamMembers).values({
				teamId,
				userId,
			});
			return team;
		}),
	removeTeamMember: protectedProcedure
		.input(
			z.object({
				teamId: z.string(),
				userId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { teamId, userId } = input;
			const team = await ctx.db
				.delete(teamMembers)
				.where(
					and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)),
				);
			return team;
		}),
	getTeamMembers: protectedProcedure
		.input(
			z.object({
				teamId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { teamId } = input;
			const team_members = await ctx.db.query.teamMembers.findMany({
				where: eq(teamMembers.teamId, teamId),
			});
			return team_members;
		}),
});
