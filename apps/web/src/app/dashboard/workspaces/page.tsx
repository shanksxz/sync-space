"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { CreateWorkspaceDialog } from "@/features/workspaces/components/create-workspace";
import { authClient } from "@/server/auth/auth-client";
import { api } from "@/trpc/react";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { RefreshCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export type Workspace = {
	id: string;
	name: string;
	ownerId: string;
	owner: {
		name: string | null;
		email: string | null;
	};
	description: string | null;
	githubRepoUrl: string | null;
	githubBranch: string | null;
	lastSyncedAt: Date | null;
	teamId: string;
	team: {
		name: string;
	};
	createdAt: Date | null;
	updatedAt: Date | null;
};

interface WorkspaceTableProps<TData, TValue> {
	data: TData[];
	columns: ColumnDef<TData, TValue>[];
}

function WorkspaceTable<TData, TValue>({
	data,
	columns,
}: WorkspaceTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id}>
									{flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No workspaces found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

function WorkspaceTableSkeleton({
	columns,
}: { columns: ColumnDef<any, any>[] }) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						{columns.map((column, index) => (
							<TableHead key={index}>
								{typeof column.header === "string" ? column.header : "Column"}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 3 }).map((_, rowIndex) => (
						<TableRow key={rowIndex}>
							{columns.map((_, cellIndex) => (
								<TableCell key={cellIndex}>
									<Skeleton className="h-5 w-full" />
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

export default function WorkspacesPage() {
	const { data: session } = authClient.useSession();
	const userId = session?.user?.id || "";
	const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(
		null,
	);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const {
		data: workspaces,
		isLoading,
		error,
		refetch,
	} = api.workspace.getUserWorkspaces.useQuery();

	const deleteWorkspaceMutation = api.workspace.deleteWorkspace.useMutation({
		onSuccess: () => {
			toast.success("Workspace deleted successfully");
			refetch();
			setWorkspaceToDelete(null);
			setDeleteDialogOpen(false);
		},
		onError: (error) => {
			toast.error(`Failed to delete workspace: ${error.message}`);
		},
	});

	const handleDeleteWorkspace = () => {
		if (!workspaceToDelete) return;

		deleteWorkspaceMutation.mutate({
			id: workspaceToDelete.id,
		});
	};

	const columns: ColumnDef<Workspace>[] = [
		{
			header: "Name",
			accessorKey: "name",
		},
		{
			header: "Description",
			accessorKey: "description",
			cell: ({ row }) => <span>{row.original.description || "—"}</span>,
		},
		{
			header: "Team",
			accessorKey: "team.name",
		},
		{
			header: "Owner",
			id: "owner",
			cell: ({ row }) => {
				const isCurrentUserOwner = row.original.ownerId === userId;
				return (
					<span>
						{isCurrentUserOwner
							? "You"
							: row.original.owner?.name ||
								row.original.owner?.email ||
								"Unknown"}
					</span>
				);
			},
		},
		{
			header: "Github Repo",
			accessorKey: "githubRepoUrl",
			cell: ({ row }) => (
				<a
					href={row.original.githubRepoUrl || ""}
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary hover:underline"
				>
					{row.original.githubRepoUrl?.replace("https://github.com/", "") ||
						"—"}
				</a>
			),
		},
		{
			header: "Last Synced",
			accessorKey: "lastSyncedAt",
			cell: ({ row }) => {
				const lastSynced = row.original.lastSyncedAt;
				return <span>{lastSynced ? format(lastSynced, "PPP") : "Never"}</span>;
			},
		},
		{
			header: "Actions",
			id: "actions",
			cell: ({ row }) => {
				const isCurrentUserOwner = row.original.ownerId === userId;

				return (
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="sm" asChild>
							<Link href={`/workspace/${row.original.id}`}>Open</Link>
						</Button>

						{isCurrentUserOwner && (
							<AlertDialog
								open={
									deleteDialogOpen && workspaceToDelete?.id === row.original.id
								}
								onOpenChange={(open) => {
									if (!open && !deleteWorkspaceMutation.isPending) {
										setDeleteDialogOpen(false);
									}
								}}
							>
								<AlertDialogTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="text-red-500 hover:text-red-700 hover:bg-red-100"
										onClick={() => {
											setWorkspaceToDelete(row.original);
											setDeleteDialogOpen(true);
										}}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Delete Workspace?</AlertDialogTitle>
										<AlertDialogDescription>
											Are you sure you want to delete "{row.original.name}"?
											This action cannot be undone and all workspace data will
											be permanently lost.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel
											disabled={deleteWorkspaceMutation.isPending}
											onClick={() => {
												if (!deleteWorkspaceMutation.isPending) {
													setDeleteDialogOpen(false);
												}
											}}
										>
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											onClick={(e) => {
												e.preventDefault();
												handleDeleteWorkspace();
											}}
											disabled={deleteWorkspaceMutation.isPending}
											className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
										>
											{deleteWorkspaceMutation.isPending
												? "Deleting..."
												: "Delete Workspace"}
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						)}
					</div>
				);
			},
		},
	];

	return (
		<div className="flex flex-col space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
				<div className="flex items-center gap-2">
					<Button
						title="Refresh"
						variant="ghost"
						size="sm"
						onClick={() => refetch()}
					>
						<RefreshCcw className="h-4 w-4" />
					</Button>
					<CreateWorkspaceDialog onSuccess={() => refetch()} />
				</div>
			</div>

			<p className="text-muted-foreground">
				View and manage workspaces from all your teams.
			</p>

			{isLoading ? (
				<WorkspaceTableSkeleton columns={columns} />
			) : error ? (
				<div className="rounded-md border p-8 text-center">
					<p className="text-red-500">
						Error loading workspaces: {error.message}
					</p>
				</div>
			) : (
				<WorkspaceTable data={workspaces || []} columns={columns} />
			)}
		</div>
	);
}
