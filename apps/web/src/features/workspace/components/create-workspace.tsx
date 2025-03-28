import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/server";
import type { Metadata } from "next";
import Link from "next/link";
import { RepositoryList } from "./repository-list";

export const metadata: Metadata = {
	title: "Create Workspace - CodeCollab",
	description: "Create a new collaborative workspace",
};

export default async function CreateWorkspace() {
	const repos = await api.user.getUserRepos();
	return (
		<div className="flex flex-col space-y-6">
			<div className="flex items-center gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
						Create a Workspace
					</h1>
					<p className="text-sm sm:text-base text-muted-foreground">
						Set up a new collaborative coding environment
					</p>
				</div>
			</div>

			<div className="w-full flex-1 flex flex-col">
				<Card className="border-border bg-card rounded-sm">
					<CardHeader className="pb-4 sm:pb-6">
						<CardTitle className="text-xl sm:text-2xl">
							Import GitHub Repository
						</CardTitle>
						<CardDescription className="text-sm">
							Connect to GitHub and select a repository to collaborate on
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<div className="h-full flex flex-col">
								<div className="flex-1 flex flex-col">
									<Label className="mb-2">GitHub Repository</Label>
									<RepositoryList repositories={repos} />
								</div>
							</div>

							<div className="space-y-4 sm:space-y-6">
								<div className="space-y-2">
									<Label htmlFor="name">Workspace Name</Label>
									<Input
										id="name"
										placeholder="My Awesome Project"
										className="bg-input"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										placeholder="Describe your workspace..."
										className="bg-input min-h-[120px] sm:min-h-[200px]"
									/>
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between">
						<Button variant="ghost" className="w-full sm:w-auto" asChild>
							<Link href="/dashboard/workspaces">Cancel</Link>
						</Button>
						<Button className="w-full sm:w-auto">Create Workspace</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
