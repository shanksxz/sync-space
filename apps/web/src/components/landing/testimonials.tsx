import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TestimonialProps {
	quote: string;
	author: string;
	role: string;
	company: string;
	rating: number;
}

function Testimonial({
	quote,
	author,
	role,
	company,
	rating,
}: TestimonialProps) {
	return (
		<Card className="testimonial-card h-full">
			<CardContent className="p-6 h-full flex flex-col">
				<div className="flex mb-4">
					{Array.from({ length: 5 }).map((_, i) => (
						<Star
							key={i}
							size={16}
							className={
								i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted"
							}
						/>
					))}
				</div>

				<blockquote className="text-lg mb-6 flex-grow">"{quote}"</blockquote>

				<div className="flex items-center mt-auto">
					<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
						<span className="text-primary font-medium">{author.charAt(0)}</span>
					</div>
					<div>
						<div className="font-medium">{author}</div>
						<div className="text-sm text-muted-foreground">
							{role}, {company}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function Testimonials() {
	const [activeSlide, setActiveSlide] = useState(0);
	const [touchStart, setTouchStart] = useState(0);
	const [touchEnd, setTouchEnd] = useState(0);

	const carouselRef = useRef<HTMLDivElement>(null);

	const testimonials = [
		{
			quote:
				"SyncSpace has revolutionized how our team collaborates on code. The real-time editing and GitHub integration save us hours every day.",
			author: "Sarah Johnson",
			role: "Engineering Lead",
			company: "TechSolutions",
			rating: 5,
		},
		{
			quote:
				"The ability to code together in real-time has transformed our remote team's productivity. It's like we're all sitting at the same desk.",
			author: "Michael Chen",
			role: "Senior Developer",
			company: "Innovate Inc",
			rating: 5,
		},
		{
			quote:
				"I've tried many collaborative coding tools, but SyncSpace stands out for its intuitive interface and powerful features. It's become essential for our team.",
			author: "Alex Rodriguez",
			role: "CTO",
			company: "StartupX",
			rating: 4,
		},
		{
			quote:
				"The seamless GitHub integration and real-time collaboration have made code reviews much more efficient. Our team loves using SyncSpace.",
			author: "Elena Torres",
			role: "Product Manager",
			company: "DevFlow",
			rating: 5,
		},
		{
			quote:
				"SyncSpace has dramatically improved our onboarding process. New team members can dive into the codebase with senior developers guiding them in real-time.",
			author: "James Wilson",
			role: "Team Lead",
			company: "CodeCraft",
			rating: 4,
		},
	];

	const slidesPerView = {
		mobile: 1,
		tablet: 2,
		desktop: 3,
	};

	const [slides, setSlides] = useState(slidesPerView.desktop);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) {
				setSlides(slidesPerView.mobile);
			} else if (window.innerWidth < 1024) {
				setSlides(slidesPerView.tablet);
			} else {
				setSlides(slidesPerView.desktop);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const totalSlides = testimonials.length;
	const maxActiveSlide = totalSlides - slides;

	const nextSlide = () => {
		setActiveSlide((prev) => (prev < maxActiveSlide ? prev + 1 : prev));
	};

	const prevSlide = () => {
		setActiveSlide((prev) => (prev > 0 ? prev - 1 : prev));
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchStart(e.targetTouches[0]?.clientX || 0);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		setTouchEnd(e.targetTouches[0]?.clientX || 0);
	};

	const handleTouchEnd = () => {
		if (touchStart - touchEnd > 50) {
			nextSlide();
		}

		if (touchStart - touchEnd < -50) {
			prevSlide();
		}
	};

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

		const testimonialSection = document.getElementById("testimonials-title");
		if (testimonialSection) {
			observer.observe(testimonialSection);
			testimonialSection.classList.add("section-transition");
		}

		return () => observer.disconnect();
	}, []);

	return (
		<section id="testimonials" className="section-padding bg-muted">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-16" id="testimonials-title">
					<div className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
						Testimonials
					</div>
					<h2 className="heading-lg mb-4">What our users are saying</h2>
					<p className="body-md max-w-2xl mx-auto text-muted-foreground">
						Thousands of teams are already using SyncSpace to collaborate more
						effectively and build better software together.
					</p>
				</div>

				<div className="relative">
					<div
						ref={carouselRef}
						className="overflow-hidden"
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
					>
						<div
							className="flex transition-transform duration-300 ease-out"
							style={{
								transform: `translateX(-${activeSlide * (100 / slides)}%)`,
							}}
						>
							{testimonials.map((testimonial, index) => (
								<div
									key={index}
									className="px-3"
									style={{ flex: `0 0 ${100 / slides}%` }}
								>
									<Testimonial {...testimonial} />
								</div>
							))}
						</div>
					</div>

					<div className="flex justify-center items-center mt-8 gap-2">
						<Button
							variant="outline"
							size="icon"
							onClick={prevSlide}
							disabled={activeSlide === 0}
							className="rounded-full"
						>
							<ArrowLeft size={16} />
						</Button>

						<div className="flex gap-2">
							{Array.from({ length: maxActiveSlide + 1 }).map((_, index) => (
								<button
									key={index}
									className={`w-2 h-2 rounded-full transition-all ${
										activeSlide === index
											? "bg-primary w-6"
											: "bg-muted-foreground/30"
									}`}
									onClick={() => setActiveSlide(index)}
									aria-label={`Go to slide ${index + 1}`}
								/>
							))}
						</div>

						<Button
							variant="outline"
							size="icon"
							onClick={nextSlide}
							disabled={activeSlide >= maxActiveSlide}
							className="rounded-full"
						>
							<ArrowRight size={16} />
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
