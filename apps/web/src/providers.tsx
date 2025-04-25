"use client";

import { LiveblocksProvider } from "@liveblocks/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
	return (
		<LiveblocksProvider authEndpoint={`/api/liveblocks-auth`}>
			<NuqsAdapter>{children}</NuqsAdapter>
		</LiveblocksProvider>
	);
}
