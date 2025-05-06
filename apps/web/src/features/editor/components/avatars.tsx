"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOthers, useSelf } from "@liveblocks/react/suspense";

export const Avatars = () => {
	const others = useOthers();
	const currentUser = useSelf();

	return (
		<TooltipProvider>
			<div className="flex items-center gap-2">
				{others.map(({ connectionId, info }) => (
					<Tooltip key={connectionId}>
						<TooltipTrigger asChild>
							<Avatar className="w-6 h-6 cursor-pointer">
								<AvatarImage src={info.avatar} />
								<AvatarFallback>{info.name.charAt(0)}</AvatarFallback>
							</Avatar>
						</TooltipTrigger>
						<TooltipContent side="top" align="center">
							<div className="flex flex-col items-center">
								<p className="font-semibold">{info.name}</p>
							</div>
						</TooltipContent>
					</Tooltip>
				))}
				{currentUser && (
					<Tooltip>
						<TooltipTrigger asChild>
							<Avatar className="w-6 h-6 cursor-pointer">
								<AvatarImage src={currentUser.info.avatar} />
								<AvatarFallback>
									{currentUser.info.name.charAt(0)}
								</AvatarFallback>
							</Avatar>
						</TooltipTrigger>
						<TooltipContent side="top" align="center">
							<div className="flex flex-col items-center">
								<p className="font-semibold">{currentUser.info.name}</p>
							</div>
						</TooltipContent>
					</Tooltip>
				)}
			</div>
		</TooltipProvider>
	);
};
