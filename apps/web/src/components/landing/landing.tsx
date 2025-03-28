"use client";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Navbar } from "@/components/landing/navbar";
import { Testimonials } from "@/components/landing/testimonials";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
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

	return (
		<div className="min-h-screen">
			<Navbar />

			<Hero />

			<Features />

			<HowItWorks />

			<Testimonials />

			{/* CTA Section */}
			<section className="py-12 md:py-24 px-4 md:px-6 lg:px-8">
				<div className="max-w-5xl mx-auto text-center section-transition">
					<h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
						Ready to transform how your team codes?
					</h2>
					<p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto px-4 md:px-0">
						Join thousands of development teams already using SyncSpace to
						collaborate more effectively, ship faster, and build better software
						together.
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
						<Button
							size="lg"
							className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
						>
							Get Started for Free
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="w-full sm:w-auto group"
						>
							Schedule a Demo
							<ArrowRight
								size={16}
								className="ml-2 transition-transform group-hover:translate-x-1"
							/>
						</Button>
					</div>
					<p className="mt-4 md:mt-6 text-xs md:text-sm text-muted-foreground">
						No credit card required. Free plan includes all core features.
					</p>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default Index;
