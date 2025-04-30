"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { authClient } from "@/server/auth/auth-client";
import { Home, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";
import Link from "next/link";

const navigationItems = [
	{ title: "Dashboard", url: "/dashboard", icon: Home },
	{ title: "Workspaces", url: "/dashboard/workspaces", icon: LayoutDashboard },
	{ title: "Teams", url: "/dashboard/teams", icon: Users },
	{ title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { state } = useSidebar();
	const { data: session } = authClient.useSession();
	const isCollapsed = state === "collapsed";

	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild className="mt-1">
							<Link href="/" className="flex items-center space-x-3">
								<LayoutDashboard className="h-6 w-6" />
								<span className="text-lg font-semibold">SyncSpace</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu className="space-y-2">
						{navigationItems.map((item) => (
							<SidebarMenuItem
								key={item.url}
								className={cn("transition-colors")}
							>
								<SidebarMenuButton
									asChild
									className="w-full justify-start"
									tooltip={isCollapsed ? item.title : undefined}
								>
									<Link href={item.url} className="flex items-center space-x-3">
										<item.icon className="h-4 w-4" />
										<span className="text-sm font-medium">{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="">
				{state === "expanded" ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="flex w-full items-center gap-2 rounded-lg p-2 hover:bg-sidebar-muted"
							>
								<Avatar className="size-8">
									<AvatarImage src={session?.user?.image || ""} alt="Admin" />
									<AvatarFallback>
										{session?.user?.name?.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-1 flex-col items-start text-left">
									<span className="text-sm font-medium leading-none">
										{session?.user?.name}
									</span>
									<span className="text-xs text-sidebar-muted-foreground">
										{session?.user?.email}
									</span>
								</div>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuItem>
								<LogOut className="mr-2 h-4 w-4" />
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<div className="flex justify-center items-center">
						<Avatar className="size-7">
							<AvatarImage src={session?.user?.image || ""} alt="Admin" />
							<AvatarFallback>
								{session?.user?.name?.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
					</div>
				)}
			</SidebarFooter>
		</Sidebar>
	);
}
