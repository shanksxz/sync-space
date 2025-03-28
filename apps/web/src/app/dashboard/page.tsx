import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Briefcase, Users } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
	return (
		<div className="flex flex-col space-y-6">
			<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card className="border-border bg-card">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-xl">Recent Workspaces</CardTitle>
							<Briefcase className="h-5 w-5 text-muted-foreground" />
						</div>
						<CardDescription>
							Your recent workspaces and collaborations
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground">
								You have no workspaces yet.
							</p>
							<Link
								href="/dashboard/workspaces"
								className="text-sm font-medium text-primary hover:underline"
							>
								View all workspaces
							</Link>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border bg-card">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-xl">Your Teams</CardTitle>
							<Users className="h-5 w-5 text-muted-foreground" />
						</div>
						<CardDescription>Teams you belong to or manage</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground">
								You are not part of any teams yet.
							</p>
							<Link
								href="/dashboard/teams"
								className="text-sm font-medium text-primary hover:underline"
							>
								View all teams
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
