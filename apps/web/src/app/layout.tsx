import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/providers";

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
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						{children}
					</ThemeProvider>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
