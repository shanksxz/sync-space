"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/server/auth/auth-client";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [pending, setPending] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const router = useRouter();
	const { data: session } = authClient.useSession();

	const handleSignOut = async () => {
		try {
			setPending(true);
			await authClient.signOut();
		} catch (error) {
			console.error("Error signing out:", error);
		} finally {
			setPending(false);
		}
	};

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	return (
		<header
			className={cn(
				"fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-8 lg:px-16",
				isScrolled
					? "bg-background/80 backdrop-blur-md shadow-sm"
					: "bg-transparent",
			)}
		>
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
						<span className="text-primary-foreground font-bold text-lg">S</span>
					</div>
					<span className="text-xl font-bold text-foreground">SyncSpace</span>
				</div>

				<nav className="hidden md:flex items-center space-x-8">
					<a
						href="#features"
						className="text-foreground hover:text-primary transition-colors"
					>
						Features
					</a>
					<a
						href="#how-it-works"
						className="text-foreground hover:text-primary transition-colors"
					>
						How It Works
					</a>
					<a
						href="#testimonials"
						className="text-foreground hover:text-primary transition-colors"
					>
						Testimonials
					</a>
				</nav>

				<div className="hidden md:flex items-center space-x-4">
					{session ? (
						<div className="flex items-center gap-2">
							<Button
								variant="default"
								className="hover:border-primary transition-colors"
								onClick={() => router.push("/dashboard")}
							>
								Dashboard
							</Button>
							<Button
								variant="outline"
								className="hover:text-primary hover:border-primary transition-colors"
								onClick={handleSignOut}
							>
								Sign Out
							</Button>
						</div>
					) : (
						<Button
							variant="default"
							className="hover:border-primary transition-colors"
							onClick={() => router.push("/auth/signin")}
						>
							Log In
						</Button>
					)}
				</div>

				<button
					className="md:hidden text-foreground"
					onClick={toggleMobileMenu}
					aria-label="Toggle mobile menu"
				>
					{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</div>

			<div
				className={cn(
					"md:hidden fixed inset-0 z-40 bg-background transform transition-transform duration-300 ease-in-out",
					mobileMenuOpen ? "translate-x-0" : "translate-x-full",
				)}
			>
				<div className="flex flex-col h-full p-6">
					<div className="flex justify-between items-center mb-10">
						<div className="flex items-center gap-2">
							<div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
								<span className="text-primary-foreground font-bold text-lg">
									S
								</span>
							</div>
							<span className="text-xl font-bold">SyncSpace</span>
						</div>
						<button onClick={toggleMobileMenu} aria-label="Close menu">
							<X size={24} />
						</button>
					</div>

					<nav className="flex flex-col space-y-6 text-lg">
						<a
							href="#features"
							className="border-b border-border pb-2"
							onClick={toggleMobileMenu}
						>
							Features
						</a>
						<a
							href="#how-it-works"
							className="border-b border-border pb-2"
							onClick={toggleMobileMenu}
						>
							How It Works
						</a>
						<a
							href="#testimonials"
							className="border-b border-border pb-2"
							onClick={toggleMobileMenu}
						>
							Testimonials
						</a>
					</nav>

					<div className="mt-auto flex flex-col space-y-4">
						<Button
							variant="outline"
							className="w-full"
							onClick={() => router.push("/auth/signin")}
						>
							Log In
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
