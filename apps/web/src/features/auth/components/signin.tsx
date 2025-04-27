"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/server/auth/auth-client";
import type { ErrorContext } from "@better-fetch/fetch";
import { Github } from "lucide-react";
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
		<Button
			size="lg"
			className="mb-8 transition-transform duration-200 ease-in-out transform hover:scale-105"
			onClick={handleSignInWithGithub}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Github
				className={`mr-2 h-5 w-5 transition-all duration-200 ${isHovered ? "rotate-12" : ""}`}
			/>
			Sign in with GitHub
		</Button>
	);
}
