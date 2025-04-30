"use client";

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
import { api } from "@/trpc/react";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";

export type Workspace = {
	id: string;
	name: string;
	ownerId: string;
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
		header: "Last Synced",
		accessorKey: "lastSyncedAt",
		cell: ({ row }) => {
			const lastSynced = row.original.lastSyncedAt;
			return <span>{lastSynced ? format(lastSynced, "PPP") : "Never"}</span>;
		},
	},
	{
		header: "Team",
		accessorKey: "team.name",
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
				{row.original.githubRepoUrl?.replace("https://github.com/", "") || "—"}
			</a>
		),
	},
	{
		header: "Github Branch",
		accessorKey: "githubBranch",
	},
	{
		header: "Actions",
		id: "actions",
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" asChild>
					<Link href={`/workspace/${row.original.id}`}>Open</Link>
				</Button>
			</div>
		),
	},
];

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

function WorkspaceTableSkeleton() {
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
	const {
		data: workspaces,
		isLoading,
		error,
		refetch,
	} = api.workspace.getWorkspaces.useQuery();

	return (
		<div className="flex flex-col space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
				<CreateWorkspaceDialog onSuccess={() => refetch()} />
			</div>

			{isLoading ? (
				<WorkspaceTableSkeleton />
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