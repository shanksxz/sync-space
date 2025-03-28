"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/server/auth/auth-client";
import type { ErrorContext } from "@better-fetch/fetch";
import { Github } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function SignIn() {
	const [isHovered, setIsHovered] = useState(false);
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
		<div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
			<div className="w-full max-w-md px-6 py-8 flex flex-col items-center">
				<p className="text-muted-foreground mb-4 text-center">
					Sign in below to get started
				</p>
				<div className="w-full">
					<Button
						variant="outline"
						size="lg"
						className="w-full h-12 mb-4 flex items-center justify-center gap-2"
						onClick={handleSignInWithGithub}
						disabled={pendingGithub}
					>
						<Github className="h-5 w-5" />
						<span>Continue with GitHub</span>
					</Button>
				</div>

				<p className="text-xs text-muted-foreground mt-4 text-center">
					By continuing, you agree to our{" "}
					<Link href="#" className="text-primary hover:underline">
						Terms of Service
					</Link>{" "}
					and{" "}
					<Link href="#" className="text-primary hover:underline">
						Privacy Policy
					</Link>
				</p>
			</div>
		</div>
	);
}
