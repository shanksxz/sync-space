"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React from "react";

export function AppHeader() {
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();

	const pathSegments = pathname.split("/").filter(Boolean);

	const breadcrumbItems = pathSegments.map((segment, index) => {
		const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
		const displayName = segment.charAt(0).toUpperCase() + segment.slice(1);
		return { segment, href, displayName };
	});

	return (
		<header className="flex flex-col w-full">
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-2">
					<div className="flex space-x-2 justify-center items-center">
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink href="/">Home</BreadcrumbLink>
								</BreadcrumbItem>

								{breadcrumbItems.map((item, index) => (
									<React.Fragment key={item.href}>
										<BreadcrumbSeparator />
										<BreadcrumbItem>
											{index === breadcrumbItems.length - 1 ? (
												<BreadcrumbPage>{item.displayName}</BreadcrumbPage>
											) : (
												<BreadcrumbLink href={item.href}>
													{item.displayName}
												</BreadcrumbLink>
											)}
										</BreadcrumbItem>
									</React.Fragment>
								))}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</div>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => {
						console.log("Clickingggggggg")
						console.log(theme)
						setTheme(theme === "light" ? "dark" : "light");
					}}
					aria-label="Toggle theme"
				>
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				</Button>
			</div>
		</header>
	);
}