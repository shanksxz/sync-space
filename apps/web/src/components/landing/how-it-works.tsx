"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

interface StepCardProps {
	number: number;
	title: string;
	description: string;
	icon: string;
	isEven: boolean;
}

function StepCard({ number, title, description, icon, isEven }: StepCardProps) {
	return (
		<div
			className={`flex flex-col ${isEven ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-4 md:gap-12 mb-8 md:mb-16 section-transition`}
		>
			<div className="w-full md:w-1/2">
				<Card className="border-0 shadow-lg overflow-hidden">
					<CardContent className="p-0">
						<div className="aspect-video bg-muted flex items-center justify-center">
							<div className="text-4xl md:text-6xl text-primary">{icon}</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="w-full md:w-1/2 text-center md:text-left px-4 md:px-0">
				<div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground font-bold text-base md:text-lg mb-3 md:mb-4">
					{number}
				</div>
				<h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">{title}</h3>
				<p className="text-sm md:text-base text-muted-foreground">
					{description}
				</p>
			</div>
		</div>
	);
}

export function HowItWorks() {
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("visible");
					}
				});
			},
			{ threshold: 0.2 },
		);

		document.querySelectorAll(".section-transition").forEach((el) => {
			observer.observe(el);
		});

		return () => observer.disconnect();
	}, []);

	const steps = [
		{
			number: 1,
			title: "Create Your Workspace",
			description:
				"Sign up for SyncSpace and create your first project. Import existing code from GitHub or start from scratch with our templates.",
			icon: "🏗️",
		},
		{
			number: 2,
			title: "Invite Your Team",
			description:
				"Add team members to your workspace with customizable permission levels. Everyone can join instantly without complicated setup.",
			icon: "👥",
		},
		{
			number: 3,
			title: "Code Together",
			description:
				"Start coding in real-time with your team. See everyone's changes, chat about your code, and solve problems together.",
			icon: "💻",
		},
		{
			number: 4,
			title: "Deploy Anywhere",
			description:
				"When you're ready, deploy your code directly to your preferred platform or export it to continue your workflow.",
			icon: "🚀",
		},
	];

	return (
		<section id="how-it-works" className="py-12 md:py-24 px-4 md:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-8 md:mb-16 section-transition">
					<div className="inline-block px-3 py-1 mb-3 md:mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
						How It Works
					</div>
					<h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
						Simple steps to collaborative coding
					</h2>
					<p className="text-sm md:text-base max-w-2xl mx-auto text-muted-foreground px-4 md:px-0">
						Getting started with SyncSpace is easy. Follow these steps to
						transform how your team works together on code.
					</p>
				</div>

				<div className="mt-8 md:mt-16">
					{steps.map((step, index) => (
						<StepCard
							key={index}
							number={step.number}
							title={step.title}
							description={step.description}
							icon={step.icon}
							isEven={index % 2 !== 0}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
