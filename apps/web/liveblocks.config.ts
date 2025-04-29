import { LiveObject, LiveList, LiveMap } from "@liveblocks/client";

declare global {
    interface Liveblocks {
        Presence: {
            cursor: { x: number; y: number };
            selection?: { start: number; end: number };
            activeFile?: string; // Current file path user is editing
            status?: "editing" | "reviewing" | "idle";
        };

        Storage: {
            files: LiveMap<
                string,
                LiveObject<{
                    content: string;
                    sha: string;
                    lastSynced: number;
                    isDirectory?: boolean;
                }>
            >;
            repoMeta: LiveObject<{
                owner: string;
                name: string;
                defaultBranch: string;
            }>;
        };

        UserMeta: {
            id: string;
            info: {
                githubId: string;
                name: string;
                avatar: string;
                email?: string;
            };
        };

        RoomEvent:
            | {
                  type: "SYNC_COMPLETE";
                  stats: { added: number; modified: number };
              }
            | { type: "FILE_EDIT"; path: string; delta: any }
            | {
                  type: "FILE_CONFLICT";
                  path: string;
                  ours: string;
                  theirs: string;
              }
            | { type: "FILE_RENAME"; oldPath: string; newPath: string }
            | { type: "USER_JOINED"; userId: string }
            | { type: "USER_LEFT"; userId: string };

        ThreadMetadata: {
            path: string; // file path
            line?: number; // line number (optional)
            resolved: boolean;
            severity?: "note" | "warning" | "error";
        };

        RoomInfo: {
            workspaceId: string;
            repository: {
                url: string;
                owner: string;
                name: string;
                branch: string;
            };
            title: string;
            lastSync: number;
            activeUsers: number;
        };
    }
}

export {};
