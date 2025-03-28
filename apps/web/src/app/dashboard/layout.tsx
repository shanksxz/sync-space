import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="bg-background sticky inset-x-0 top-0 isolate z-10 flex shrink-0 items-center gap-2 border-b">
					<div className="flex h-14 w-full items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1.5" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<AppHeader />
					</div>
				</header>
				<main className="p-6">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
