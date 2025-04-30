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
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type CreateTeamDialogProps = {
	onSuccess?: () => void;
};

export function CreateTeamDialog({ onSuccess }: CreateTeamDialogProps) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createTeam = api.team.createTeam.useMutation({
		onSuccess: () => {
			toast.success("Team created successfully!");
			setOpen(false);
			setName("");
			setError(null);
			onSuccess?.();
		},
		onError: (err) => {
			setError(err.message);
			toast.error("Failed to create team");
			setIsSubmitting(false);
		},
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		if (!name.trim()) {
			setError("Team name is required");
			return;
		}

		setIsSubmitting(true);
		createTeam.mutate({ name });
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<PlusCircle className="mr-2 h-4 w-4" />
					Create Team
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Create Team</DialogTitle>
						<DialogDescription>
							Create a new team to collaborate with others.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Team Name</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Frontend Team"
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
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Creating..." : "Create Team"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
