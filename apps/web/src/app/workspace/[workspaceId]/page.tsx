"use client";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CodeEditor } from "@/features/editor/components/code-editor";
import { FileTree } from "@/features/editor/components/file-tree";
import { WorkspaceProvider } from "@/providers";
import { authClient } from "@/server/auth/auth-client";
import { api } from "@/trpc/react";
import { LiveMap, LiveObject } from "@liveblocks/client";
import { useStorage } from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const renderCount = 0;
function WorkspaceContent({ workspaceId }: { workspaceId: string }) {
	const { data: session } = authClient.useSession();
	const { data: workspace } = api.workspace.getWorkspaceById.useQuery(
		{ id: workspaceId },
		{ enabled: !!session },
	);
	const { mutate: importRepository, isPending: isImportingRepository } =
		api.workspace.importRepository.useMutation();

	const isInitialized = useStorage((root) => root?.fileTree?.isInitialized);

	useEffect(() => {
		if (!session || !workspace) return;

		if (!workspace?.githubRepoUrl) {
			console.log("no github repo url");
			return;
		}

		if (!isInitialized) {
			importRepository({
				workspaceId: workspaceId,
				repoOwner: workspace?.owner.username as string,
				repoName: workspace?.name as string,
				branch: workspace?.githubBranch as string,
			});
		}
	}, [workspaceId, session, importRepository, isInitialized, workspace]);

	return (
		<>
			{isImportingRepository ? (
				<div className="flex items-center justify-center h-dvh">
					Importing repository...
				</div>
			) : (
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel defaultSize={25}>
						<FileTree />
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel defaultSize={75}>
						<CodeEditor />
					</ResizablePanel>
				</ResizablePanelGroup>
			)}
		</>
	);
}

export default function Page() {
	const { workspaceId } = useParams();

	return (
		<WorkspaceProvider roomId={workspaceId as string}>
			<WorkspaceContent workspaceId={workspaceId as string} />
		</WorkspaceProvider>
	);
}
