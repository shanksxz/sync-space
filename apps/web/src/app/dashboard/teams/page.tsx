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
import { CreateTeamDialog } from "@/features/teams/components/create-team";
import { authClient } from "@/server/auth/auth-client";
import { api } from "@/trpc/react";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export type Team = {
	id: string;
	name: string;
	ownerId: string;
	owner: {
		name: string;
	};
	createdAt: Date | null;
	updatedAt: Date | null;
	teamMembers: {
		id: string;
		teamId: string;
		userId: string;
		createdAt: Date | null;
		updatedAt: Date | null;
		user: {
			id: string;
			name: string;
			email: string;
		};
	}[];
};

interface TeamTableProps<TData, TValue> {
	data: TData[];
	columns: ColumnDef<TData, TValue>[];
}

function TeamTable<TData, TValue>({
	data,
	columns,
}: TeamTableProps<TData, TValue>) {
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
								No teams found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

function TeamTableSkeleton({ columns }: { columns: ColumnDef<any, any>[] }) {
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

export default function TeamsPage() {
	const { data: session } = authClient.useSession();
	const userId = session?.user?.id || "";
	const [teamToLeave, setTeamToLeave] = useState<Team | null>(null);
	const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

	const {
		data: teams,
		isLoading,
		error,
		refetch,
	} = api.team.getUserTeams.useQuery();

	const leaveTeamMutation = api.team.leaveTeam.useMutation({
		onSuccess: () => {
			toast.success("You have left the team");
			refetch();
			setTeamToLeave(null);
			setLeaveDialogOpen(false);
		},
		onError: (error) => {
			toast.error(`Failed to leave team: ${error.message}`);
		},
	});

	const handleLeaveTeam = () => {
		if (!teamToLeave) return;
		leaveTeamMutation.mutate({
			teamId: teamToLeave.id,
		});
	};

	const columns: ColumnDef<Team>[] = [
		{
			header: "Name",
			accessorKey: "name",
		},
		{
			header: "Owner",
			accessorKey: "owner.name",
		},
		{
			header: "Members",
			id: "members",
			cell: ({ row }) => row.original.teamMembers?.length || 0,
		},
		{
			header: "Created",
			accessorKey: "createdAt",
			cell: ({ row }) => {
				const createdAt = row.original.createdAt;
				return createdAt ? format(createdAt, "PPP") : "Unknown";
			},
		},
		{
			header: "Actions",
			id: "actions",
			cell: ({ row }) => {
				const isOwner = row.original.ownerId === userId;

				if (isOwner) {
					return (
						<div className="flex items-center gap-2">
							<Button variant="ghost" size="sm" asChild>
								<Link href={`/dashboard/teams/${row.original.id}`}>Manage</Link>
							</Button>
						</div>
					);
				}
				return (
					<div className="flex items-center gap-2">
						<AlertDialog
							open={leaveDialogOpen && teamToLeave?.id === row.original.id}
							onOpenChange={(open) => {
								if (!open && !leaveTeamMutation.isPending) {
									setLeaveDialogOpen(false);
								}
							}}
						>
							<AlertDialogTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="text-red-500 hover:text-red-700 hover:bg-red-100"
									onClick={() => {
										setTeamToLeave(row.original);
										setLeaveDialogOpen(true);
									}}
								>
									Leave
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Leave Team?</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure you want to leave "{row.original.name}"? You'll
										lose access to all team resources and will need to be
										invited back to rejoin.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel
										disabled={leaveTeamMutation.isPending}
										onClick={() => {
											if (!leaveTeamMutation.isPending) {
												setLeaveDialogOpen(false);
											}
										}}
									>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										onClick={(e) => {
											e.preventDefault();
											handleLeaveTeam();
										}}
										disabled={leaveTeamMutation.isPending}
										className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
									>
										{leaveTeamMutation.isPending ? "Leaving..." : "Leave Team"}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				);
			},
		},
	];

	return (
		<div className="flex flex-col space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Teams</h1>
				<div className="flex items-center gap-2">
					<Button
						title="Refresh"
						variant="ghost"
						size="sm"
						onClick={() => refetch()}
					>
						<RefreshCcw className="h-4 w-4" />
					</Button>
					<CreateTeamDialog onSuccess={() => refetch()} />
				</div>
			</div>

			{isLoading ? (
				<TeamTableSkeleton columns={columns} />
			) : error ? (
				<div className="rounded-md border p-8 text-center">
					<p className="text-red-500">Error loading teams: {error.message}</p>
				</div>
			) : (
				<TeamTable data={teams || []} columns={columns} />
			)}
		</div>
	);
}
