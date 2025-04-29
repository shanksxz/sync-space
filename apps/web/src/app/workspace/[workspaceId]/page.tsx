import { CollaborativeEditor } from "@/features/editor/components/collaborative-editor";
import { Room } from "@/features/editor/components/room";
import { RoomProvider } from "@liveblocks/react";
import { ClientSideSuspense } from "@liveblocks/react/suspense";

export default async function Page({ params }: { params: Promise<{ workspaceId: string }> }) {
    const { workspaceId } = await params;
    return (
        <Room workspaceId={workspaceId}>
            <CollaborativeEditor />
        </Room>
    )
}

