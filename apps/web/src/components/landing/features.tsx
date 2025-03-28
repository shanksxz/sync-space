"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Cloud, Code, Github, Lock, Users, Zap } from "lucide-react";
import { useEffect } from "react";

interface FeatureCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
	return (
		<Card
			className="feature-card transition-all duration-300"
			style={{ animationDelay: `${delay}ms` }}
		>
			<CardHeader className="pb-2">
				<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
					{icon}
				</div>
				<CardTitle className="text-xl">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<CardDescription className="text-base text-muted-foreground">
					{description}
				</CardDescription>
			</CardContent>
		</Card>
	);
}

export function Features() {
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

		document.querySelectorAll(".feature-card").forEach((card) => {
			observer.observe(card);
			card.classList.add("section-transition");
		});

		return () => observer.disconnect();
	}, []);

	const features = [
		{
			icon: <Code size={24} />,
			title: "Real-time Editing",
			description:
				"Edit code simultaneously with your team members. See changes as they happen with live cursors and highlights.",
		},
		{
			icon: <Github size={24} />,
			title: "GitHub Integration",
			description:
				"Connect directly to your GitHub repositories. Pull, edit, and push without leaving the platform.",
		},
		{
			icon: <Users size={24} />,
			title: "Team Collaboration",
			description:
				"Invite team members, assign roles, and collaborate seamlessly on projects of any size.",
		},
		{
			icon: <Zap size={24} />,
			title: "Instant Feedback",
			description:
				"Get immediate feedback on your code with real-time syntax checking and error highlighting.",
		},
		{
			icon: <Cloud size={24} />,
			title: "Cloud Storage",
			description:
				"Your projects are automatically saved to the cloud, accessible from anywhere, on any device.",
		},
		{
			icon: <Lock size={24} />,
			title: "Secure Workspace",
			description:
				"Enterprise-grade security with end-to-end encryption and customizable permission controls.",
		},
	];

	return (
		<section id="features" className="section-padding bg-muted">
			<div className="max-w-6xl mx-auto">
				<div
					className="text-center mb-16 section-transition"
					id="features-title"
				>
					<div className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
						Features
					</div>
					<h2 className="heading-lg mb-4">
						Everything you need to code together
					</h2>
					<p className="body-md max-w-2xl mx-auto text-muted-foreground">
						SyncSpace combines the best features of modern code editors with
						powerful collaboration tools, making team programming seamless and
						efficient.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
					{features.map((feature, index) => (
						<FeatureCard
							key={index}
							icon={feature.icon}
							title={feature.title}
							description={feature.description}
							delay={index * 100}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

// Add the intersection observer for the section title
document.addEventListener("DOMContentLoaded", () => {
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

	const featuresTitle = document.getElementById("features-title");
	if (featuresTitle) {
		observer.observe(featuresTitle);
	}
});
