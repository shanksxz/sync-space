"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { RepoFilters } from "@/features/editor/components/repo-filters";
import { RepoList } from "@/features/editor/components/repo-list";
import type { Session } from "@/server/auth/auth";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface GitHubExplorerProps {
	session: Session | null;
}

export function GitHubExplorer({ session }: GitHubExplorerProps) {
	const router = useRouter();
	const [repos, setRepos] = useState<Repo[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [visibilityFilter, setVisibilityFilter] = useState("all");
	const [languageFilter, setLanguageFilter] = useState("all");
	const [sortBy, setSortBy] = useState("updated");

	useEffect(() => {
		if (session) {
			fetchRepos();
		}
	}, [session]);

	const fetchRepos = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/repos");
			if (!response.ok) throw new Error("Failed to fetch");
			const data = await response.json();
			setRepos(data);
		} catch (error) {
			console.error("Error fetching repos:", error);
		} finally {
			setLoading(false);
		}
	};

	const filteredRepos = useMemo(() => {
		return repos
			.filter(
				(repo) =>
					repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					repo.topics.some((topic) =>
						topic.toLowerCase().includes(searchTerm.toLowerCase()),
					),
			)
			.filter((repo) => {
				if (visibilityFilter === "all") return true;
				return visibilityFilter === "private" ? repo.private : !repo.private;
			})
			.filter((repo) => {
				if (languageFilter === "all") return true;
				return repo.language?.toLowerCase() === languageFilter.toLowerCase();
			})
			.sort((a, b) => {
				if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
				return 0;
			});
	}, [repos, searchTerm, visibilityFilter, languageFilter, sortBy]);

	const languages = useMemo(() => {
		const langSet = new Set(
			repos
				.map((repo) => repo.language)
				.filter((lang): lang is string => !!lang),
		);
		return Array.from(langSet);
	}, [repos]);

	const handleRepoClick = (repoName: string) => {
		router.push(`/repo/${repoName}`);
	};

	if (!session) return null;

	return (
		<div className="flex h-screen flex-col p-4">
			<Card className="flex flex-1 flex-col overflow-hidden rounded-sm">
				<CardHeader>
					<CardTitle>Welcome, {session?.user?.name}</CardTitle>
					<CardDescription>
						Explore and filter your GitHub repositories
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-1 flex-col overflow-hidden">
					<RepoFilters
						searchTerm={searchTerm}
						visibilityFilter={visibilityFilter}
						languageFilter={languageFilter}
						sortBy={sortBy}
						languages={languages}
						onSearchChange={setSearchTerm}
						onVisibilityChange={setVisibilityFilter}
						onLanguageChange={setLanguageFilter}
						onSortChange={setSortBy}
					/>
					<RepoList
						loading={loading}
						repos={filteredRepos}
						onRepoClick={handleRepoClick}
					/>
				</CardContent>
				<CardFooter className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Showing {filteredRepos.length} repositories
					</p>
					<Button variant="outline">
						<LogOut className="mr-2 h-4 w-4" /> Sign out
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
