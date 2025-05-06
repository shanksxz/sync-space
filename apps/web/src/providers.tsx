"use client";

import { LiveMap, LiveObject } from "@liveblocks/client";
import {
	ClientSideSuspense,
	LiveblocksProvider,
	RoomProvider,
} from "@liveblocks/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function WorkspaceProvider({
	children,
	roomId,
}: {
	children: React.ReactNode;
	roomId: string;
}) {
	return (
		<LiveblocksProvider authEndpoint="/api/liveblocks">
			<RoomProvider
				id={roomId}
				initialPresence={{
					cursor: { ch: 0, line: 0 },
					selection: null,
					isTyping: false,
				}}
				initialStorage={{
					fileTree: new LiveObject({
						//? will be replaced with the actual file tree
						files: new LiveMap([
							[
								"1",
								{
									id: "1",
									name: "index.js",
									content: "",
									path: "index.js",
									type: "file",
								},
							],
						]),
						activeFileId: "",
						rootDirId: "",
						isInitialized: false,
					}),
				}}
			>
				<ClientSideSuspense
					fallback={
						<div className="flex items-center justify-center h-dvh">
							Initializing workspace...
						</div>
					}
				>
					{children}
				</ClientSideSuspense>
			</RoomProvider>
		</LiveblocksProvider>
	);
}
