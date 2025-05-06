"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type AddTeamMemberDialogProps = {
	teamId: string;
	onSuccess?: () => void;
};

export function AddTeamMemberDialog({
	teamId,
	onSuccess,
}: AddTeamMemberDialogProps) {
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState("");
	const [error, setError] = useState<string | null>(null);

	const { data: users } = api.user.getAllUsers.useQuery();

	const addTeamMember = api.team.addTeamMember.useMutation({
		onSuccess: () => {
			toast.success("Team member added successfully!");
			setOpen(false);
			setEmail("");
			setError(null);
			onSuccess?.();
		},
		onError: (err) => {
			setError(err.message);
			toast.error("Failed to add team member");
		},
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		if (!email.trim()) {
			setError("Email is required");
			return;
		}

		const user = users?.find((user) => user.email === email.trim());

		if (!user) {
			setError("No user found with this email address");
			return;
		}

		addTeamMember.mutate({
			teamId: teamId,
			userId: user.id,
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<UserPlus className="mr-2 h-4 w-4" />
					Add Member
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Add Team Member</DialogTitle>
						<DialogDescription>
							Add a new member to your team by their email address.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="email">Email Address</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="member@example.com"
								className="bg-input"
								required
							/>
							{error && <p className="text-red-500 text-sm">{error}</p>}
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="ghost"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={addTeamMember.isPending}>
							{addTeamMember.isPending ? "Adding..." : "Add Member"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
