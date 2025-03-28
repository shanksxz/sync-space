"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateTeamPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createTeam = api.team.createTeam.useMutation({
		onSuccess: () => {
			toast.success("Team created successfully!");
			router.push("/dashboard/teams");
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
		<div className="flex flex-col space-y-6">
			<div className="flex items-center gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
						Create a Team
					</h1>
					<p className="text-sm sm:text-base text-muted-foreground">
						Build a team to collaborate with others
					</p>
				</div>
			</div>

			<div className="w-full flex-1 flex flex-col">
				<Card className="border-border bg-card rounded-sm">
					<form onSubmit={handleSubmit}>
						<CardHeader className="pb-4 sm:pb-6">
							<CardTitle className="text-xl sm:text-2xl">
								Team Details
							</CardTitle>
							<CardDescription className="text-sm">
								Create a team to organize workspaces and invite members
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Team Name</Label>
									<Input
										id="name"
										value={name}
										onChange={(e) => setName(e.target.value)}
										placeholder="Frontend Team"
										className="bg-input"
										required
									/>
									{error && (
										<p className="text-red-500 text-sm mt-1">{error}</p>
									)}
								</div>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between">
							<Button
								type="button"
								variant="ghost"
								className="w-full sm:w-auto"
								asChild
							>
								<Link href="/dashboard/teams">Cancel</Link>
							</Button>
							<Button
								type="submit"
								className="w-full sm:w-auto"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Creating..." : "Create Team"}
							</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</div>
	);
}
