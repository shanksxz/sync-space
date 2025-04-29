"use client";

import { LiveblocksProvider } from "@liveblocks/react";
import { ThemeProviderProps } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { PropsWithChildren } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState, useEffect } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}


export function Providers({ children }: PropsWithChildren) {
	return (
		<LiveblocksProvider authEndpoint={`/api/liveblocks-auth`}>
				<NuqsAdapter>{children}</NuqsAdapter>
		</LiveblocksProvider>
	);
}
