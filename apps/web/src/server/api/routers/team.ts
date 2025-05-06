import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { and, eq, teamMembers, teams, workspaces } from "@syncspace/database";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const teamRouter = createTRPCRouter({
	createTeam: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1, "Team name is required"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
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
			} catch (error) {
				console.error(error);
				if (error instanceof TRPCError) {
					throw error;
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create team",
				});
			}
		}),
	getTeamsWithMembers: protectedProcedure.query(async ({ ctx }) => {
		try {
			const teamsList = await ctx.db.query.teams.findMany({
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
			return teamsList;
		} catch (error) {
			console.error(error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch teams with members",
			});
		}
	}),
	getTeams: protectedProcedure.query(async ({ ctx }) => {
		try {
			const teamsList = await ctx.db.query.teams.findMany({
				where: eq(teams.ownerId, ctx.session.user.id),
			});
			return teamsList.length > 0 ? teamsList[0] : null;
		} catch (error) {
			console.error(error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch teams",
			});
		}
	}),
	getTeamById: protectedProcedure
		.input(
			z.object({
				id: z.string().min(1, "Team ID is required"),
			}),
		)
		.query(async ({ ctx, input }) => {
			try {
				const { id } = input;
				const team = await ctx.db.query.teams.findFirst({
					where: eq(teams.id, id),
				});

				if (!team) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Team not found",
					});
				}

				const isMember = await ctx.db.query.teamMembers.findFirst({
					where: and(
						eq(teamMembers.teamId, id),
						eq(teamMembers.userId, ctx.session.user.id),
					),
				});

				if (!isMember) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "You are not a member of this team",
					});
				}

				return team;
			} catch (error) {
				console.error(error);
				if (error instanceof TRPCError) {
					throw error;
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch team",
				});
			}
		}),
	addTeamMember: protectedProcedure
		.input(
			z.object({
				teamId: z.string().min(1, "Team ID is required"),
				userId: z.string().min(1, "User ID is required"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const { teamId, userId } = input;

				const team = await ctx.db.query.teams.findFirst({
					where: eq(teams.id, teamId),
				});

				if (!team) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Team not found",
					});
				}

				if (team.ownerId !== ctx.session.user.id) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Only the team owner can add members",
					});
				}

				const existingMember = await ctx.db.query.teamMembers.findFirst({
					where: and(
						eq(teamMembers.teamId, teamId),
						eq(teamMembers.userId, userId),
					),
				});

				if (existingMember) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "User is already a member of this team",
					});
				}

				const [result] = await ctx.db
					.insert(teamMembers)
					.values({
						teamId,
						userId,
					})
					.returning();

				return result;
			} catch (error) {
				console.error(error);
				if (error instanceof TRPCError) {
					throw error;
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to add team member",
				});
			}
		}),
	removeTeamMember: protectedProcedure
		.input(
			z.object({
				teamId: z.string().min(1, "Team ID is required"),
				userId: z.string().min(1, "User ID is required"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const { teamId, userId } = input;

				const team = await ctx.db.query.teams.findFirst({
					where: eq(teams.id, teamId),
				});

				if (!team) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Team not found",
					});
				}

				if (
					team.ownerId !== ctx.session.user.id &&
					userId !== ctx.session.user.id
				) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Only the team owner can remove other members",
					});
				}

				const member = await ctx.db.query.teamMembers.findFirst({
					where: and(
						eq(teamMembers.teamId, teamId),
						eq(teamMembers.userId, userId),
					),
				});

				if (!member) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "User is not a member of this team",
					});
				}

				if (userId === team.ownerId) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Cannot remove the team owner. Transfer ownership first.",
					});
				}

				const result = await ctx.db
					.delete(teamMembers)
					.where(
						and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)),
					);

				return { success: true };
			} catch (error) {
				console.error(error);
				if (error instanceof TRPCError) {
					throw error;
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to remove team member",
				});
			}
		}),
	getUserTeams: protectedProcedure.query(async ({ ctx }) => {
		try {
			const userTeamsData = await ctx.db.query.teamMembers.findMany({
				where: eq(teamMembers.userId, ctx.session.user.id),
				with: {
					team: {
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
					},
				},
			});

			const teams = userTeamsData.map((teamMember) => ({
				id: teamMember.team.id,
				name: teamMember.team.name,
				ownerId: teamMember.team.ownerId,
				owner: teamMember.team.owner,
				createdAt: teamMember.team.createdAt,
				updatedAt: teamMember.team.updatedAt,
				teamMembers: teamMember.team.teamMembers,
			}));

			return teams;
		} catch (error) {
			console.error(error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch user teams",
			});
		}
	}),
	getTeamMembers: protectedProcedure
		.input(
			z.object({
				teamId: z.string().min(1, "Team ID is required"),
			}),
		)
		.query(async ({ ctx, input }) => {
			try {
				const { teamId } = input;

				const team = await ctx.db.query.teams.findFirst({
					where: eq(teams.id, teamId),
				});

				if (!team) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Team not found",
					});
				}

				const isMember = await ctx.db.query.teamMembers.findFirst({
					where: and(
						eq(teamMembers.teamId, teamId),
						eq(teamMembers.userId, ctx.session.user.id),
					),
				});

				if (!isMember) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "You are not a member of this team",
					});
				}

				const team_members = await ctx.db.query.teamMembers.findMany({
					where: eq(teamMembers.teamId, teamId),
					with: {
						user: {
							columns: {
								id: true,
								name: true,
								email: true,
								image: true,
							},
						},
					},
				});

				return team_members;
			} catch (error) {
				console.error(error);
				if (error instanceof TRPCError) {
					throw error;
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch team members",
				});
			}
		}),
	deleteTeam: protectedProcedure
		.input(z.object({ id: z.string().min(1, "Team ID is required") }))
		.mutation(async ({ ctx, input }) => {
			try {
				const { id } = input;

				const team = await ctx.db.query.teams.findFirst({
					where: eq(teams.id, id),
				});

				if (!team) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Team not found",
					});
				}

				if (team.ownerId !== ctx.session.user.id) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Only the team owner can delete the team",
					});
				}

				const teamWorkspaces = await ctx.db.query.workspaces.findMany({
					where: eq(workspaces.teamId, id),
				});

				if (teamWorkspaces.length > 0) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message:
							"Cannot delete team with existing workspaces. Delete all workspaces first.",
					});
				}

				await ctx.db.transaction(async (tx) => {
					await tx.delete(teamMembers).where(eq(teamMembers.teamId, id));
					await tx.delete(teams).where(eq(teams.id, id));
				});

				return { success: true };
			} catch (error) {
				console.error(error);
				if (error instanceof TRPCError) {
					throw error;
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete team",
				});
			}
		}),
	leaveTeam: protectedProcedure
		.input(z.object({ teamId: z.string().min(1, "Team ID is required") }))
		.mutation(async ({ ctx, input }) => {
			try {
				const { teamId } = input;
				const userId = ctx.session.user.id;

				const team = await ctx.db.query.teams.findFirst({
					where: eq(teams.id, teamId),
				});

				if (!team) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Team not found",
					});
				}

				const isMember = await ctx.db.query.teamMembers.findFirst({
					where: and(
						eq(teamMembers.teamId, teamId),
						eq(teamMembers.userId, userId),
					),
				});

				if (!isMember) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "You are not a member of this team",
					});
				}

				if (team.ownerId === userId) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Team owner cannot leave. Transfer ownership first.",
					});
				}

				await ctx.db
					.delete(teamMembers)
					.where(
						and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)),
					);

				return { success: true };
			} catch (error) {
				console.error(error);
				if (error instanceof TRPCError) {
					throw error;
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to leave team",
				});
			}
		}),
});
