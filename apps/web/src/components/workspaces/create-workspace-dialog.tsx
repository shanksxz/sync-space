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
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { Github, Loader2, PlusCircle, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Repository = {
	id: number;
	name: string;
	fullName: string;
	private: boolean;
	description: string | null;
	url: string;
	updatedAt: string | null;
	language: string | null;
	defaultBranch: string;
};

type CreateWorkspaceDialogProps = {
	onSuccess?: () => void;
};

export function CreateWorkspaceDialog({
	onSuccess,
}: CreateWorkspaceDialogProps) {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		repoUrl: "",
		branch: "main",
		teamId: "",
	});
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedRepo, setSelectedRepo] = useState<number | null>(null);

	const { data: teams, isLoading: isLoadingTeams } =
		api.team.getTeamsWithMembers.useQuery();
	const { data: repositories, isLoading: isLoadingRepos } =
		api.user.getUserRepos.useQuery();

	const filteredRepos =
		repositories?.filter((repo) => {
			const query = searchQuery.toLowerCase();
			return (
				repo.name.toLowerCase().includes(query) ||
				repo.fullName.toLowerCase().includes(query) ||
				repo.description?.toLowerCase().includes(query)
			);
		}) || [];

	const handleSelectRepo = (repo: Repository) => {
		setSelectedRepo(repo.id === selectedRepo ? null : repo.id);
		if (repo.id !== selectedRepo) {
			setFormData((prev) => ({
				...prev,
				name: repo.name,
				repoUrl: repo.url,
				branch: repo.defaultBranch,
			}));
		}
	};

	const createWorkspace = api.workspace.createWorkspace.useMutation({
		onSuccess: () => {
			toast.success("Workspace created successfully!");
			setOpen(false);
			setFormData({
				name: "",
				description: "",
				repoUrl: "",
				branch: "main",
				teamId: "",
			});
			setSelectedRepo(null);
			setError(null);
			onSuccess?.();
		},
		onError: (err) => {
			setError(err.message);
			toast.error("Failed to create workspace");
			setIsSubmitting(false);
		},
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		if (!formData.name.trim()) {
			setError("Workspace name is required");
			return;
		}

		if (!selectedRepo) {
			setError("Please select a GitHub repository");
			return;
		}

		if (!formData.teamId) {
			setError("Please select a team");
			return;
		}

		setIsSubmitting(true);
		createWorkspace.mutate(formData);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<PlusCircle className="mr-2 h-4 w-4" />
					Create Workspace
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[800px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Create Workspace</DialogTitle>
						<DialogDescription>
							Create a new workspace for your project collaboration.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-6 py-4">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<div className="h-full flex flex-col">
								<div className="flex-1 flex flex-col">
									<Label className="mb-2">GitHub Repository</Label>
									<div className="flex flex-col h-full">
										<div className="relative mb-2">
											<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
											<Input
												placeholder="Search repositories..."
												className="pl-8 bg-input"
												value={searchQuery}
												onChange={(e) => setSearchQuery(e.target.value)}
											/>
										</div>

										<div className="rounded-md border border-border p-2 flex-1 overflow-y-auto max-h-[300px] min-h-[250px]">
											<div className="space-y-2">
												{isLoadingRepos ? (
													<div className="flex items-center justify-center p-4 text-muted-foreground">
														<Loader2 className="h-4 w-4 mr-2 animate-spin" />
														<span>Loading repositories...</span>
													</div>
												) : filteredRepos.length === 0 ? (
													<div className="flex items-center justify-center p-4 text-muted-foreground">
														<span>
															No repositories found matching "{searchQuery}"
														</span>
													</div>
												) : (
													filteredRepos.map((repo) => (
														<div
															key={repo.id}
															className={`flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-md p-2 hover:bg-accent ${
																selectedRepo === repo.id ? "bg-accent" : ""
															}`}
														>
															<div className="flex items-start sm:items-center space-x-2 mb-2 sm:mb-0">
																<Github className="h-4 w-4 text-muted-foreground mt-1 sm:mt-0" />
																<div className="flex flex-col">
																	<span className="font-medium truncate max-w-[260px] sm:max-w-[200px] md:max-w-[260px]">
																		{repo.fullName}
																	</span>
																	{repo.description && (
																		<span className="text-xs text-muted-foreground truncate max-w-[260px] sm:max-w-[200px] md:max-w-[260px]">
																			{repo.description}
																		</span>
																	)}
																</div>
															</div>
															<Button
																variant={
																	selectedRepo === repo.id ? "default" : "ghost"
																}
																size="sm"
																className="self-end sm:self-auto"
																onClick={() => handleSelectRepo(repo)}
																type="button"
															>
																{selectedRepo === repo.id
																	? "Selected"
																	: "Select"}
															</Button>
														</div>
													))
												)}
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Workspace Name</Label>
									<Input
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										placeholder="My Awesome Project"
										className="bg-input"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										name="description"
										value={formData.description}
										onChange={handleChange}
										placeholder="Describe your workspace..."
										className="bg-input min-h-[100px]"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="branch">Branch</Label>
									<Input
										id="branch"
										name="branch"
										value={formData.branch}
										onChange={handleChange}
										placeholder="main"
										className="bg-input"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="teamId">Team</Label>
									<select
										id="teamId"
										name="teamId"
										value={formData.teamId}
										onChange={handleChange}
										className="h-9 w-full rounded-md border bg-transparent px-3 py-1 shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
										required
										disabled={isLoadingTeams}
									>
										<option value="" disabled>
											Select a team
										</option>
										{teams?.map((team) => (
											<option key={team.id} value={team.id}>
												{team.name}
											</option>
										))}
									</select>
								</div>
							</div>
						</div>

						{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="ghost"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting || isLoadingTeams || isLoadingRepos}
						>
							{isSubmitting ? "Creating..." : "Create Workspace"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
