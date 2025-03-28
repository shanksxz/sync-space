import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";

type DashboardLayoutProps = {
	children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<div className="flex h-screen overflow-hidden">
			<Sidebar className="w-64 hidden md:flex" />
			<div className="flex-1 overflow-auto">
				<main className="p-6">{children}</main>
			</div>
		</div>
	);
}
