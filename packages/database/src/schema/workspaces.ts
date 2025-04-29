import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { teams } from "./teams";
import { users } from "./users";

export const workspaces = pgTable("workspaces", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	ownerId: varchar("owner_id", { length: 255 })
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	githubRepoUrl: varchar("github_repo_url", { length: 255 }),
	githubBranch: varchar("github_branch", { length: 255 }),
	lastSyncedAt: timestamp("last_synced_at"),
	teamId: uuid("team_id")
		.notNull()
		.references(() => teams.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const workspacesRelations = relations(workspaces, ({ one }) => ({
	owner: one(users, {
		fields: [workspaces.ownerId],
		references: [users.id],
		relationName: "owner",
	}),
	team: one(teams, {
		fields: [workspaces.teamId],
		references: [teams.id],
		relationName: "team",
	}),
}));
