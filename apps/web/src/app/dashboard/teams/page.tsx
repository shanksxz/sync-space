"use client";

import { CreateTeamDialog } from "@/features/teams/components/create-team";
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
import { api } from "@/trpc/react";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";

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
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/teams/${row.original.id}`}>Manage</Link>
                </Button>
            </div>
        ),
    },
];

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

function TeamTableSkeleton() {
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
    const {
        data: teams,
        isLoading,
        error,
        refetch,
    } = api.team.getTeamsWithMembers.useQuery();

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
                <CreateTeamDialog onSuccess={() => refetch()} />
            </div>

            {isLoading ? (
                <TeamTableSkeleton />
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