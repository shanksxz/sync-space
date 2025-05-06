import { LiveMap, LiveObject } from "@liveblocks/client";

// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
    interface Liveblocks {
        Presence: {
            cursor: { line: number; ch: number };
            selection: {
                anchor: { line: number; ch: number };
                head: { line: number; ch: number };
            } | null;
            isTyping: boolean;
        };

        // The Storage tree for the room, for , useStorage, etc.
        Storage: {
            fileTree: LiveObject<{
                files: LiveMap<
                    string,
                    {
                        id: string;
                        name: string;
                        content?: string;
                        path: string;
                        type: "file" | "directory";
                        children?: string[];
                        yDocId?: string;
                        language?: string;
                        lastModified?: number;
                    }
                >;
                activeFileId: string;
                rootDirId: string;
                isInitialized: boolean;
            }>;
        };

        // Custom user info set when authenticating with a secret key
        UserMeta: {
            id: string;
            info: {
                githubUsername: string;
                name: string;
                email: string;
                avatar: string;
                color: string;
            };
        };

        // Custom events, for useBroadcastEvent, useEventListener
        RoomEvent: {};
        // Example has two events, using a union
        // | { type: "PLAY" }
        // | { type: "REACTION"; emoji: "🔥" };

        // Custom metadata set on threads, for useThreads, useCreateThread, etc.
        ThreadMetadata: {
            // Example, attaching coordinates to a thread
            // x: number;
            // y: number;
        };

        // Custom room info set with resolveRoomsInfo, for useRoomInfo
        RoomInfo: {
            workspaceId: string;
            name: string;
            description?: string;
            githubRepo?: {
                owner: string;
                name: string;
            };
            activeUsers: number;
        };
    }
}

export {};
