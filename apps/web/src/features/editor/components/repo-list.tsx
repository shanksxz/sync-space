"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Tag } from "lucide-react";

export function RepoList({
	loading,
	repos,
	onRepoClick,
}: {
	loading: boolean;
	repos: Repo[];
	onRepoClick: (repoName: string) => void;
}) {
	if (loading) {
		return (
			<ScrollArea className="h-[calc(100vh-280px)]">
				<div className="space-y-2 p-1">
					{[...Array(5)].map((_, i) => (
						<Skeleton key={i} className="h-[80px] w-full" />
					))}
				</div>
			</ScrollArea>
		);
	}

	return (
		<ScrollArea className="h-[calc(100vh-280px)]">
			<ul className="space-y-2 p-1">
				{repos.map((repo) => (
					<li
						key={repo.id}
						className="cursor-pointer rounded-lg border bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
						onClick={() => onRepoClick(repo.name)}
					>
						<div className="flex items-start justify-between">
							<div>
								<h3 className="text-lg font-semibold hover:underline">
									{repo.name}
								</h3>
								<p className="mt-1 text-sm text-muted-foreground">
									{repo.description || "No description"}
								</p>
								<div className="mt-2 flex flex-wrap items-center gap-2">
									{repo.language && (
										<Badge variant="secondary">{repo.language}</Badge>
									)}
									<Badge variant="outline" className="flex items-center">
										<Star className="mr-1 h-3 w-3" />
										{repo.stargazers_count}
									</Badge>
									{repo.topics.slice(0, 3).map((topic) => (
										<Badge
											key={topic}
											variant="secondary"
											className="flex items-center"
										>
											<Tag className="mr-1 h-3 w-3" />
											{topic}
										</Badge>
									))}
								</div>
							</div>
							<Badge variant={repo.private ? "destructive" : "default"}>
								{repo.private ? "Private" : "Public"}
							</Badge>
						</div>
					</li>
				))}
			</ul>
		</ScrollArea>
	);
}
