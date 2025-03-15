"use client";

import { authClient } from "@/server/auth/auth-client";
import type { ErrorContext } from "@better-fetch/fetch";
import { Button } from "@syncspace/ui/components/ui/button";
import { Github } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
	const [pendingGithub, setPendingGithub] = useState(false);
	const handleSignInWithGithub = async () => {
		await authClient.signIn.social(
			{
				provider: "github",
			},
			{
				onRequest: () => {
					setPendingGithub(true);
				},
				onError: (ctx: ErrorContext) => {
					console.error("Error signing in with GitHub:", ctx.error);
					toast.error(ctx.error?.message ?? "Something went wrong.");
				},
			},
		);
		setPendingGithub(false);
	};
	return (
		<div className="container mx-auto flex items-center justify-center min-h-screen py-8">
			<Button
				variant="outline"
				type="button"
				onClick={handleSignInWithGithub}
				disabled={pendingGithub}
			>
				{pendingGithub ? (
					"Signing in..."
				) : (
					<>
						<Github className="mr-2 h-4 w-4" />
						GitHub
					</>
				)}
			</Button>
		</div>
	);
}
