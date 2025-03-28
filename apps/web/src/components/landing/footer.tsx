import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
	return (
		<footer className="bg-background border-t border-border">
			<div className="max-w-7xl mx-auto py-6 md:py-8 lg:py-12 px-4 md:px-8 lg:px-16">
				<div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 mb-6 md:mb-8 lg:mb-12">
					<div className="xs:col-span-2 lg:col-span-1">
						<div className="flex items-center gap-2 mb-3 md:mb-4">
							<div className="w-8 h-8 md:w-10 md:h-10 rounded-md bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
								<span className="text-primary-foreground font-bold text-base md:text-lg">
									S
								</span>
							</div>
							<span className="text-lg md:text-xl font-bold">SyncSpace</span>
						</div>
						<p className="text-sm md:text-base text-muted-foreground mb-4">
							Real-time collaborative coding for modern development teams. Build
							better software, together.
						</p>

						<div className="flex space-x-4 mb-6 xs:mb-0">
							<a
								href="#"
								className="text-muted-foreground hover:text-primary transition-colors"
								aria-label="GitHub"
							>
								<Github size={18} className="md:w-5 md:h-5" />
							</a>
							<a
								href="#"
								className="text-muted-foreground hover:text-primary transition-colors"
								aria-label="Twitter"
							>
								<Twitter size={18} className="md:w-5 md:h-5" />
							</a>
							<a
								href="#"
								className="text-muted-foreground hover:text-primary transition-colors"
								aria-label="LinkedIn"
							>
								<Linkedin size={18} className="md:w-5 md:h-5" />
							</a>
							<a
								href="#"
								className="text-muted-foreground hover:text-primary transition-colors"
								aria-label="Facebook"
							>
								<Facebook size={18} className="md:w-5 md:h-5" />
							</a>
						</div>
					</div>

					<div>
						<h3 className="font-bold text-base md:text-lg mb-2 md:mb-3 lg:mb-4">
							Product
						</h3>
						<ul className="space-y-1 md:space-y-2 lg:space-y-3">
							<li>
								<a
									href="#"
									className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors"
								>
									Features
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors"
								>
									Pricing
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors"
								>
									Integrations
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors"
								>
									Enterprise
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors"
								>
									Security
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-bold text-base md:text-lg mb-2 md:mb-3 lg:mb-4">
							Company
						</h3>
						<ul className="space-y-1 md:space-y-2 lg:space-y-3">
							<li>
								<a
									href="#"
									className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors"
								>
									About Us
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors"
								>
									Blog
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors"
								>
									Careers
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors"
								>
									Contact
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors"
								>
									Media Kit
								</a>
							</li>
						</ul>
					</div>

					<div className="xs:col-span-2 lg:col-span-1">
						<h3 className="font-bold text-base md:text-lg mb-2 md:mb-3 lg:mb-4">
							Stay Updated
						</h3>
						<p className="text-sm md:text-base text-muted-foreground mb-3">
							Subscribe to our newsletter for the latest updates and features.
						</p>
						<div className="flex flex-col sm:flex-row gap-2">
							<Input placeholder="Your email" className="border-input" />
							<Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
								Subscribe
							</Button>
						</div>
					</div>
				</div>

				<div className="pt-4 md:pt-6 lg:pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
					<p className="text-xs md:text-sm text-muted-foreground text-center md:text-left order-2 md:order-1">
						&copy; {new Date().getFullYear()} SyncSpace. All rights reserved.
					</p>
					<div className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-4 text-xs md:text-sm order-1 md:order-2 mb-2 md:mb-0">
						<a
							href="#"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							Terms
						</a>
						<a
							href="#"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							Privacy
						</a>
						<a
							href="#"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							Cookies
						</a>
						<a
							href="#"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							Accessibility
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
