"use client";

import AppHeader from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "@/providers";

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<Provider>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<div className="flex h-14 w-full items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1.5" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<AppHeader />
					</div>
					<main className="p-6">{children}</main>
				</SidebarInset>
			</SidebarProvider>
			<Toaster />
		</Provider>
	);
}
