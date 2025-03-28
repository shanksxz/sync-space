"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Loader2, Search } from "lucide-react";
import { useState } from "react";

type Repository = {
	id: number;
	name: string;
	fullName: string;
	private: boolean;
	description: string | null;
	url: string;
	updatedAt: string | null;
	language: string | null;
	defaultBranch: string;
};

interface RepositoryListProps {
	repositories: Repository[];
}

export function RepositoryList({ repositories }: RepositoryListProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedRepo, setSelectedRepo] = useState<number | null>(null);

	const filteredRepos = repositories.filter((repo) => {
		const query = searchQuery.toLowerCase();
		return (
			repo.name.toLowerCase().includes(query) ||
			repo.fullName.toLowerCase().includes(query) ||
			repo.description?.toLowerCase().includes(query)
		);
	});

	const handleSelectRepo = (repoId: number) => {
		setSelectedRepo(repoId === selectedRepo ? null : repoId);
	};

	return (
		<div className="flex flex-col h-full">
			<div className="relative mb-2">
				<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search repositories..."
					className="pl-8 bg-input"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			<div className="rounded-md border border-border p-2 flex-1 overflow-y-auto max-h-[450px] min-h-[300px] sm:min-h-[250px]">
				<div className="space-y-2">
					{repositories.length === 0 ? (
						<div className="flex items-center justify-center p-4 text-muted-foreground">
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							<span>Loading repositories...</span>
						</div>
					) : filteredRepos.length === 0 ? (
						<div className="flex items-center justify-center p-4 text-muted-foreground">
							<span>No repositories found matching "{searchQuery}"</span>
						</div>
					) : (
						filteredRepos.map((repo) => (
							<div
								key={repo.id}
								className={`flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-md p-2 hover:bg-accent ${
									selectedRepo === repo.id ? "bg-accent" : ""
								}`}
							>
								<div className="flex items-start sm:items-center space-x-2 mb-2 sm:mb-0">
									<Github className="h-4 w-4 text-muted-foreground mt-1 sm:mt-0" />
									<div className="flex flex-col">
										<span className="font-medium truncate max-w-[260px] sm:max-w-[200px] md:max-w-[260px]">
											{repo.fullName}
										</span>
										{repo.description && (
											<span className="text-xs text-muted-foreground truncate max-w-[260px] sm:max-w-[200px] md:max-w-[260px]">
												{repo.description}
											</span>
										)}
									</div>
								</div>
								<Button
									variant={selectedRepo === repo.id ? "default" : "ghost"}
									size="sm"
									className="self-end sm:self-auto"
									onClick={() => handleSelectRepo(repo.id)}
								>
									{selectedRepo === repo.id ? "Selected" : "Select"}
								</Button>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
