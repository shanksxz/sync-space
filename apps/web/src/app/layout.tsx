import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
	title: "SyncSpace",
	description: "Collaborate on code in real-time. Share ideas. Build together.",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${GeistSans.variable}`}>
			<body>
				<TRPCReactProvider>
					{children}
				</TRPCReactProvider>
			</body>
		</html>
	);
}
