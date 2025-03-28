"use client";

import { cn } from "@/lib/utils";
import { Briefcase, Home, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarNavItem = {
	title: string;
	href: string;
	icon: React.ReactNode;
};

const sidebarNavItems: SidebarNavItem[] = [
	{
		title: "Dashboard",
		href: "/dashboard",
		icon: <Home className="h-5 w-5" />,
	},
	{
		title: "Workspaces",
		href: "/dashboard/workspaces",
		icon: <Briefcase className="h-5 w-5" />,
	},
	{
		title: "Teams",
		href: "/dashboard/teams",
		icon: <Users className="h-5 w-5" />,
	},
	{
		title: "Settings",
		href: "/dashboard/settings",
		icon: <Settings className="h-5 w-5" />,
	},
];

type SidebarProps = {
	className?: string;
};

export function Sidebar({ className }: SidebarProps) {
	const pathname = usePathname();

	return (
		<aside className={cn("border-r h-screen flex flex-col", className)}>
			<div className="p-6">
				<h2 className="text-2xl font-bold">CodeCollab</h2>
			</div>
			<nav className="flex-1 px-4 py-2">
				<ul className="space-y-2">
					{sidebarNavItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<li key={item.href}>
								<Link
									href={item.href}
									className={cn(
										"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
										isActive
											? "bg-accent text-accent-foreground"
											: "hover:bg-accent/50 hover:text-accent-foreground",
									)}
								>
									{item.icon}
									{item.title}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
			<div className="p-4 border-t">
				<div className="flex items-center gap-3 px-3 py-2">
					<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
						<span className="text-xs font-medium">US</span>
					</div>
					<div>
						<p className="text-sm font-medium">User Name</p>
						<p className="text-xs text-muted-foreground">user@example.com</p>
					</div>
				</div>
			</div>
		</aside>
	);
}
