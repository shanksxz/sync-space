"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";

export function Room({ children, workspaceId }: { children: React.ReactNode, workspaceId: string }) {
    return (
        <RoomProvider id={workspaceId} initialPresence={{cursor: {
            x: 0,
            y: 0,
        }}}
        initialStorage={{
            // @ts-ignore
            files: {},
            // @ts-ignore
            repoMeta: {
                // @ts-ignore
                owner: "",
                name: "",
                defaultBranch: "",
            },
        }}>
            <ClientSideSuspense fallback={<div>Loading...</div>}>
                {children}
            </ClientSideSuspense>
        </RoomProvider>
    )
}
