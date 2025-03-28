"use client";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { FileTree } from "@/features/editor/components/file-tree";
import { api } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export const fetchRepoContent = async ({ repo }: { repo: string }) => {
	const response = await fetch(`/api/repo-content?repo=${repo}&path=`);
	if (!response.ok) throw new Error("Failed to fetch");
	return response.json();
};

export default function RepoLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { workspaceId } = useParams();
	const { data } = api.workspace.getRepoName.useQuery({
		workspaceId: workspaceId as string,
	});

	const repoName = data?.githubRepoUrl?.split("/").slice(-1)[0];
	console.log("repoName", repoName);
	const { data: content, isLoading } = useQuery({
		queryKey: ["repoContent", repoName],
		queryFn: () => fetchRepoContent({ repo: repoName as string }),
		enabled: !!repoName,
	});

	const handleFileClick = (file: RepoContent) => {
		if (file.type === "file") {
			router.push(`/workspace/${workspaceId}/${file.path}`);
		}
	};

	return (
		<div className="flex h-screen flex-col overflow-hidden bg-background">
			<header className="flex h-14 items-center gap-4 border-b px-4">
				<button
					onClick={() => router.push("/")}
					className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
				>
					<ChevronLeft className="mr-1 h-4 w-4" />
				</button>
				<div className="flex items-center gap-1.5">
					<span className="font-medium">{repoName}</span>
				</div>
			</header>
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel defaultSize={20} minSize={15}>
					<ScrollArea className="h-[calc(100vh-3.5rem)]">
						{isLoading ? (
							<div className="space-y-2 p-4">
								{[...Array(10)].map((_, i) => (
									<Skeleton key={i} className="h-6 w-full" />
								))}
							</div>
						) : (
							<div className="py-2">
								<FileTree items={content || []} onFileClick={handleFileClick} />
							</div>
						)}
					</ScrollArea>
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel defaultSize={80}>{children}</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
