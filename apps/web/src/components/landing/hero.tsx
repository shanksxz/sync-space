"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { AnimatedCode } from "./animate-code";

export function Hero() {
	const heroRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Create background shapes
		const createShapes = () => {
			if (heroRef.current) {
				const shapeCount = 3;
				const container = heroRef.current;

				// Clear any existing shapes
				const existingShapes = container.querySelectorAll(".shape");
				existingShapes.forEach((shape) => shape.remove());

				for (let i = 0; i < shapeCount; i++) {
					const shape = document.createElement("div");

					// Set shape properties
					shape.classList.add("shape");
					shape.classList.add(i % 2 === 0 ? "shape-blue" : "shape-light-blue");

					// Randomize size
					const size = Math.random() * 300 + 100;
					shape.style.width = `${size}px`;
					shape.style.height = `${size}px`;

					// Randomize position
					const posX = Math.random() * 80;
					const posY = Math.random() * 80;
					shape.style.left = `${posX}%`;
					shape.style.top = `${posY}%`;

					// Set movement animation variables
					const translateX = Math.random() * 200 - 100 + "px";
					const translateY = Math.random() * 200 - 100 + "px";
					shape.style.setProperty("--translateX", translateX);
					shape.style.setProperty("--translateY", translateY);

					container.appendChild(shape);
				}
			}
		};

		createShapes();

		// Create particles
		const createParticles = () => {
			if (!heroRef.current) return;

			const container = heroRef.current;
			const particleCount = 20;

			// Clear any existing particles
			const existingParticles = container.querySelectorAll(".particle");
			existingParticles.forEach((particle) => particle.remove());

			for (let i = 0; i < particleCount; i++) {
				const particle = document.createElement("div");

				// Set particle properties
				particle.classList.add("particle");

				// Randomize size
				const size = Math.random() * 4 + 1;
				particle.style.width = `${size}px`;
				particle.style.height = `${size}px`;

				// Randomize color - Using color variables that match shadcn theme
				const colors = [
					"hsl(var(--primary))",
					"hsl(var(--primary) / 0.8)",
					"hsl(var(--background))",
				];
				const colorIndex = Math.floor(Math.random() * colors.length);
				const backgroundColor = colors[colorIndex] || "hsl(var(--primary))"; // Provide fallback
				particle.style.backgroundColor = backgroundColor;

				// Randomize position
				const posX = Math.random() * 100;
				const posY = Math.random() * 100;
				particle.style.left = `${posX}%`;
				particle.style.top = `${posY}%`;

				// Set animation properties
				particle.style.animationDelay = `${Math.random() * 5}s`;
				particle.style.animationDuration = `${Math.random() * 10 + 5}s`;

				// Set movement animation variables
				const translateX = Math.random() * 200 - 100 + "px";
				const translateY = Math.random() * 200 - 100 + "px";
				particle.style.setProperty("--translateX", translateX);
				particle.style.setProperty("--translateY", translateY);

				container.appendChild(particle);
			}
		};

		createParticles();

		// Handle resize
		const handleResize = () => {
			createShapes();
			createParticles();
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div
			ref={heroRef}
			className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16 px-4 md:px-8 lg:px-16"
		>
			<div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
				<div className="order-2 lg:order-1 animate-fade-in">
					<div className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
						Introducing SyncSpace
					</div>

					<h1 className="heading-xl mb-6">
						<span className="text-gradient">Real-time Collaborative</span> Code
						Editor
					</h1>

					<p className="body-lg text-muted-foreground mb-8 max-w-xl">
						Experience seamless collaboration with your team. Edit, compile, and
						debug code together in real-time. No more merge conflicts, just pure
						productivity.
					</p>

					<div className="flex flex-col sm:flex-row gap-4">
						<Button
							size="lg"
							className="bg-primary hover:bg-primary/90 text-primary-foreground"
						>
							Get Started
						</Button>
						<Button size="lg" variant="outline" className="group">
							Learn More
							<ArrowRight
								size={16}
								className="ml-2 transition-transform group-hover:translate-x-1"
							/>
						</Button>
					</div>

					<div className="mt-8 flex items-center text-sm text-muted-foreground">
						<div className="flex -space-x-2 mr-3">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center bg-muted"
								>
									<span className="text-xs font-medium text-muted-foreground">
										U{i}
									</span>
								</div>
							))}
						</div>
						<span>Join 10,000+ developers already coding together</span>
					</div>
				</div>

				<div className="order-1 lg:order-2 animate-fade-in animation-delay-200">
					<div className="relative">
						<AnimatedCode className="w-full shadow-2xl" />
						<div className="absolute -bottom-5 -right-5 z-10 px-4 py-2 rounded-lg glass shadow-xl">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
								<span className="text-sm">2 collaborators online</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
				<a
					href="#features"
					className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
				>
					<span className="text-sm mb-2">Scroll to explore</span>
					<svg
						width="20"
						height="10"
						viewBox="0 0 20 10"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M1 1L10 9L19 1"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
						/>
					</svg>
				</a>
			</div>
		</div>
	);
}
