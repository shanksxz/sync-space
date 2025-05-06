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
import { AddTeamMemberDialog } from "@/features/teams/components/add-team-member";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import { Folder, RefreshCcw, Trash2, UserPlus, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function TeamDetailsPage() {
	const { teamId } = useParams();
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);

	const {
		data: team,
		isLoading: isTeamLoading,
		error: teamError,
		refetch: refetchTeam,
	} = api.team.getTeamById.useQuery({ id: teamId as string });

	const {
		data: teamMembersData,
		isLoading: isMembersLoading,
		error: membersError,
		refetch: refetchMembers,
	} = api.team.getTeamsWithMembers.useQuery();

	const teamWithMembers = teamMembersData?.find((t) => t.id === teamId);

	const removeTeamMember = api.team.removeTeamMember.useMutation({
		onSuccess: () => {
			toast.success("Team member removed successfully");
			refetchMembers();
		},
		onError: (error) => {
			toast.error(`Failed to remove team member: ${error.message}`);
		},
	});

	const deleteTeam = api.team.deleteTeam.useMutation({
		onSuccess: () => {
			toast.success("Team deleted successfully");
			router.push("/dashboard/teams");
		},
		onError: (error) => {
			setIsDeleting(false);
			toast.error(`Failed to delete team: ${error.message}`);
		},
	});

	const handleRemoveMember = (userId: string) => {
		removeTeamMember.mutate({
			teamId: teamId as string,
			userId,
		});
	};

	const handleDeleteTeam = () => {
		setIsDeleting(true);
		deleteTeam.mutate({
			id: teamId as string,
		});
	};

	if (isTeamLoading || isMembersLoading) {
		return <TeamDetailsSkeleton />;
	}

	if (teamError || membersError) {
		return (
			<div className="rounded-md border p-8 text-center">
				<p className="text-red-500">
					Error loading team details:{" "}
					{teamError?.message || membersError?.message}
				</p>
			</div>
		);
	}

	if (!team) {
		return (
			<div className="rounded-md border p-8 text-center">
				<p className="text-red-500">Team not found</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
					<p className="text-muted-foreground">
						Created{" "}
						{team.createdAt
							? format(new Date(team.createdAt), "PPP")
							: "Unknown"}
					</p>
				</div>
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						title="Refresh"
						size="sm"
						onClick={() => refetchTeam()}
					>
						<RefreshCcw className="h-4 w-4" />
					</Button>
					<AddTeamMemberDialog
						teamId={teamId as string}
						onSuccess={() => refetchMembers()}
					/>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">
								<Trash2 className="mr-2 h-4 w-4" />
								Delete Team
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete the
									team and remove all associated workspaces and data.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleDeleteTeam}
									disabled={isDeleting}
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								>
									{isDeleting ? "Deleting..." : "Delete"}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center">
					<Users className="mr-2 h-4 w-4" />
					<h2 className="text-xl font-semibold">Team Members</h2>
				</div>

				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Joined</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{teamWithMembers?.teamMembers &&
							teamWithMembers.teamMembers.length > 0 ? (
								teamWithMembers.teamMembers.map((member) => (
									<TableRow key={member.id}>
										<TableCell>{member.user.name}</TableCell>
										<TableCell>{member.user.email}</TableCell>
										<TableCell>
											{teamWithMembers.ownerId === member.user.id
												? "Owner"
												: "Member"}
										</TableCell>
										<TableCell>
											{member.createdAt
												? format(new Date(member.createdAt), "PPP")
												: "Unknown"}
										</TableCell>
										<TableCell>
											{teamWithMembers.ownerId !== member.user.id && (
												<Button
													variant="destructive"
													size="sm"
													onClick={() => handleRemoveMember(member.user.id)}
													disabled={removeTeamMember.isPending}
												>
													Remove
												</Button>
											)}
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={5} className="h-24 text-center">
										No team members found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}

function TeamDetailsSkeleton() {
	return (
		<div className="flex flex-col space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<Skeleton className="h-10 w-64" />
					<Skeleton className="mt-2 h-4 w-40" />
				</div>
				<div className="flex items-center gap-4">
					<Skeleton className="h-10 w-36" />
					<Skeleton className="h-10 w-36" />
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center">
					<Skeleton className="h-6 w-48" />
				</div>

				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Joined</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Array.from({ length: 3 }).map((_, index) => (
								<TableRow key={index}>
									<TableCell>
										<Skeleton className="h-5 w-full" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-5 w-full" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-5 w-full" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-5 w-full" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-5 w-24" />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
