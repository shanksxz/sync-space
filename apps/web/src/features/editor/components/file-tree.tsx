import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import { useState } from "react";

export function FileTree({
	items,
	onFileClick,
	level = 0,
}: {
	items: RepoContent[];
	onFileClick: (file: RepoContent) => void;
	level?: number;
}) {
	const [expandedFolders, setExpandedFolders] = useState<
		Record<string, boolean>
	>({});

	const sortedItems = [...items].sort((a, b) => {
		if (a.type === b.type) return a.name.localeCompare(b.name);
		return a.type === "dir" ? -1 : 1;
	});

	const toggleFolder = (path: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setExpandedFolders((prev) => ({
			...prev,
			[path]: !prev[path],
		}));
	};

	return (
		<ul
			className="space-y-1"
			style={{ paddingLeft: level ? `${level * 16}px` : 0 }}
		>
			{sortedItems.map((item) => (
				<li key={item.path}>
					<Button
						variant="ghost"
						className={cn(
							"w-full justify-start hover:bg-muted/50",
							item.type === "dir" && "font-medium",
						)}
						onClick={(e) => {
							if (item.type === "dir") {
								toggleFolder(item.path, e);
							}
							onFileClick(item);
						}}
					>
						<div className="flex items-center gap-2">
							{item.type === "dir" &&
								(expandedFolders[item.path] ? (
									<ChevronDown className="h-4 w-4" />
								) : (
									<ChevronRight className="h-4 w-4" />
								))}
							{item.type === "dir" ? (
								<Folder className="h-4 w-4 text-blue-500" />
							) : (
								<File className="h-4 w-4 text-gray-500" />
							)}
							{item.name}
						</div>
					</Button>
					{item.type === "dir" &&
						item.children &&
						expandedFolders[item.path] && (
							<FileTree
								items={item.children}
								onFileClick={onFileClick}
								level={level + 1}
							/>
						)}
				</li>
			))}
		</ul>
	);
}
