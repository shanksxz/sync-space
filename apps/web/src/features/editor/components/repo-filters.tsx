"use client";

import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function RepoFilters({
	searchTerm,
	visibilityFilter,
	languageFilter,
	sortBy,
	languages,
	onSearchChange,
	onVisibilityChange,
	onLanguageChange,
	onSortChange,
}: {
	searchTerm: string;
	visibilityFilter: string;
	languageFilter: string;
	sortBy: string;
	languages: string[];
	onSearchChange: (value: string) => void;
	onVisibilityChange: (value: string) => void;
	onLanguageChange: (value: string) => void;
	onSortChange: (value: string) => void;
}) {
	return (
		<div className="space-y-4 mb-4">
			<div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
				<div className="flex-1">
					<Input
						placeholder="Search repositories..."
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						className="w-full"
					/>
				</div>
				<Select value={visibilityFilter} onValueChange={onVisibilityChange}>
					<SelectTrigger className="w-full sm:w-[180px]">
						<SelectValue placeholder="Visibility" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All</SelectItem>
						<SelectItem value="public">Public</SelectItem>
						<SelectItem value="private">Private</SelectItem>
					</SelectContent>
				</Select>
				<Select value={languageFilter} onValueChange={onLanguageChange}>
					<SelectTrigger className="w-full sm:w-[180px]">
						<SelectValue placeholder="Language" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Languages</SelectItem>
						{languages.map((lang) => (
							<SelectItem key={lang} value={lang?.toLowerCase() ?? ""}>
								{lang}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={sortBy} onValueChange={onSortChange}>
					<SelectTrigger className="w-full sm:w-[180px]">
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="updated">Last Updated</SelectItem>
						<SelectItem value="stars">Stars</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
