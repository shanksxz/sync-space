import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    account: defineTable({
        accessToken: v.string(),
        accountId: v.string(),
        providerId: v.string(),
        scope: v.string(),
        updatedAt: v.string(),
        userId: v.id("user"),
    }),
    session: defineTable({
        expiresAt: v.string(),
        ipAddress: v.string(),
        token: v.string(),
        updatedAt: v.string(),
        userAgent: v.string(),
        userId: v.id("user"),
    }),
    user: defineTable({
        email: v.string(),
        emailVerified: v.boolean(),
        image: v.string(),
        name: v.string(),
        updatedAt: v.string(),
        username: v.string(),
    }),
    teams: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        ownerId: v.id("user"),
        avatarUrl: v.optional(v.string()),
        createdAt: v.number(),
    }),

    teamMembers: defineTable({
        teamId: v.id("teams"),
        userId: v.id("user"),
        role: v.string(),
        joinedAt: v.number(),
    })
        .index("by_team", ["teamId"])
        .index("by_user", ["userId"]),

    workspaces: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        teamId: v.id("teams"),
        repoUrl: v.optional(v.string()),
        isPublic: v.boolean(),
        createdAt: v.number(),
    }).index("by_team", ["teamId"]),

    files: defineTable({
        workspaceId: v.id("workspaces"),
        name: v.string(),
        path: v.string(),
        storageId: v.string(),
        size: v.number(),
        language: v.optional(v.string()),
        lastModified: v.number(),
        lastEditedBy: v.id("user"),
        version: v.number(),
    })
        .index("by_workspace", ["workspaceId"])
        .index("by_path", ["workspaceId", "path"]),

    activeEdits: defineTable({
        fileId: v.id("files"),
        content: v.string(),
        userId: v.id("user"),
        timestamp: v.number(),
    }).index("by_file", ["fileId"]),

    cursors: defineTable({
        fileId: v.id("files"),
        userId: v.id("user"),
        position: v.object({
            line: v.number(),
            column: v.number(),
        }),
        selection: v.optional(
            v.object({
                startLine: v.number(),
                startColumn: v.number(),
                endLine: v.number(),
                endColumn: v.number(),
            })
        ),
        lastUpdated: v.number(),
    }).index("by_file", ["fileId"]),
});
