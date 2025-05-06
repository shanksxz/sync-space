import { env } from "@/env";
import { createClient } from "@liveblocks/client";
import { Liveblocks } from "@liveblocks/node";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import * as Y from "yjs";

export const liveblocksClient = createClient({
	// publicApiKey: env.LIVE_BLOCKS_PUBLIC_KEY,
	authEndpoint: "/api/liveblocks",
});

// export const createLiveblocksYjsProvider = (roomId: string) => {
//     // @ts-ignore //TODO: fix this
//     const room = liveblocksClient.enter(roomId)
//     const yDoc = new Y.Doc();
//     const provider = new LiveblocksYjsProvider(room, yDoc);
//     return { yDoc, provider, room };
// };
