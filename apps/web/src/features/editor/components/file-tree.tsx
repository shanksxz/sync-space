//TODO: fix types
//TODO: optimize the file tree

"use client";

import { cn } from "@/lib/utils";
import { useMutation, useStorage } from "@liveblocks/react/suspense";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import { useState } from "react";

type FileNodeProps = {
	id: string;
	level: number;
	activeFileId: string | undefined;
	onFileSelect: (id: string) => void;
};

export function FileTree() {
	const { files, rootId, activeFileId } = useStorage((root) => ({
		files: root.fileTree?.files,
		rootId: root.fileTree?.rootDirId,
		activeFileId: root.fileTree?.activeFileId,
	}));

	const setActiveFile = useMutation(({ storage }, fileId: string) => {
		const fileTree = storage.get("fileTree");
		storage.set("fileTree", {
			...fileTree,
			//@ts-ignore
			activeFileId: fileId,
		});
	}, []);

	if (!files || !rootId) return null;

	return (
		<div className="h-full w-full overflow-auto bg-background p-2">
			<div className="text-sm">
				<FileNode
					id={rootId}
					level={0}
					activeFileId={activeFileId ?? undefined}
					onFileSelect={(id) => setActiveFile(id)}
				/>
			</div>
		</div>
	);
}

function FileNode({ id, level, activeFileId, onFileSelect }: FileNodeProps) {
	const [isExpanded, setIsExpanded] = useState(true);

	//? below logic is ai generated
	//? gotta think about how to optimize this
	const nodeData = useStorage((root) => {
		const fileId = id.split(".").pop()!;
		//@ts-ignore
		const node = root.fileTree?.files?.[fileId];

		if (
			node &&
			node.type === "directory" &&
			node.children &&
			node.children.length > 0
		) {
			const childNodes = node.children.reduce(
				(acc: Record<string, any>, childId: string) => {
					//@ts-ignore
					acc[childId] = root.fileTree?.files?.[childId];
					return acc;
				},
				{} as Record<string, any>,
			);

			return { node, childNodes };
		}

		return { node };
	});

	const { node, childNodes } = nodeData;

	if (!node) return null;

	const isDirectory = node.type === "directory";
	const isActive = id === activeFileId;

	let sortedChildren: string[] = [];
	if (isDirectory && node.children && childNodes) {
		sortedChildren = [...node.children];

		sortedChildren.sort((a, b) => {
			const aNode = childNodes[a];
			const bNode = childNodes[b];

			if (!aNode || !bNode) return 0;

			if (aNode.type !== bNode.type) {
				return aNode.type === "directory" ? -1 : 1;
			}

			return aNode.name.localeCompare(bNode.name);
		});
	}

	return (
		<>
			<div
				className={cn(
					"flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent/50 cursor-pointer",
					isActive && "bg-accent",
				)}
				style={{ paddingLeft: `${level * 12 + 8}px` }}
				onClick={() => {
					if (isDirectory) {
						setIsExpanded(!isExpanded);
					} else {
						onFileSelect(id);
					}
				}}
			>
				{isDirectory ? (
					isExpanded ? (
						<div className="flex items-center gap-2">
							<Folder className="h-4 w-4" />
							<ChevronDown className="h-4 w-4" />
						</div>
					) : (
						<div className="flex items-center gap-2">
							<Folder className="h-4 w-4" />
							<ChevronRight className="h-4 w-4" />
						</div>
					)
				) : (
					<File className="h-4 w-4" />
				)}
				<span className="truncate">{node.name}</span>
			</div>

			{isDirectory &&
				isExpanded &&
				sortedChildren.length > 0 &&
				sortedChildren.map((childId: string) => (
					<FileNode
						key={childId}
						id={`${id}.${childId}`}
						level={level + 1}
						activeFileId={activeFileId}
						onFileSelect={onFileSelect}
					/>
				))}
		</>
	);
}
