"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { CodeEditor } from "@/features/editor/components/code-editor";
import { api } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const fetchFileContent = async ({
	repo,
	path,
}: { repo: string; path: string }) => {
	const response = await fetch(`/api/file-content?repo=${repo}&path=${path}`);
	if (!response.ok) throw new Error("Failed to fetch");
	return response.json();
};

export const fetchRepoContent = async ({ repo }: { repo: string }) => {
	const response = await fetch(`/api/repo-content?repo=${repo}&path=`);
	if (!response.ok) throw new Error("Failed to fetch");
	return response.json();
};

export default function FilePage() {
	const { workspaceId, path } = useParams();
	console.log("workspaceId", workspaceId);
	console.log("path", path);
	const { data: gg } = api.workspace.getRepoName.useQuery({
		workspaceId: workspaceId as string,
	});

	const repoName = gg?.githubRepoUrl?.split("/").slice(-1)[0];
	const filePath = Array.isArray(path) ? path.join("/") : path;

	const { data, isLoading } = useQuery({
		queryKey: ["fileContent", repoName, filePath],
		queryFn: () =>
			fetchFileContent({
				repo: repoName as string,
				path: filePath as string,
			}),
		enabled: !!repoName && !!filePath,
	});

	return (
		<ScrollArea className="h-[calc(100vh-3.5rem)]">
			{isLoading ? (
				<div className="p-4">
					<Skeleton className="h-[calc(100vh-5rem)] w-full" />
				</div>
			) : data?.content ? (
				<div className="h-full p-4">
					<CodeEditor
						content={data.content}
						fileName={filePath as string}
						readOnly
					/>
				</div>
			) : (
				<div className="flex h-full items-center justify-center">
					<p className="text-sm text-muted-foreground">
						Unable to load file content
					</p>
				</div>
			)}
		</ScrollArea>
	);
}
