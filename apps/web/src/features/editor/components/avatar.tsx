import { useOthers, useSelf } from "@liveblocks/react/suspense";

type AvatarProps = {
	picture: string;
	name: string;
};

export function Avatars() {
	const users = useOthers();
	const currentUser = useSelf();

	console.log("users", users);
	console.log("currentUser", currentUser);

	return (
		<div className="flex px-3">
			{users.map(({ connectionId, info }) => {
				return (
					<Avatar
						key={connectionId}
						picture={info?.avatar || "https://i.pravatar.cc/300"}
						name={info?.name || ""}
					/>
				);
			})}

			{currentUser && (
				<div className="relative ml-8 first:ml-0">
					<Avatar
						picture={currentUser.info?.avatar || "https://i.pravatar.cc/300"}
						name={currentUser.info?.name || ""}
					/>
				</div>
			)}
		</div>
	);
}

export function Avatar({ picture, name }: AvatarProps) {
	return (
		<div
			className="flex place-content-center relative border-4 border-white rounded-full w-[42px] h-[42px] bg-gray-400 -ml-3 first:ml-0 before:content-[attr(data-tooltip)] before:absolute before:top-full before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-150 before:ease-in before:py-[5px] before:px-[10px] before:text-white before:text-xs before:rounded-lg before:mt-[10px] before:z-[1] before:bg-black before:whitespace-nowrap"
			data-tooltip={name}
		>
			<img src={picture} className="w-full h-full rounded-full" alt={name} />
		</div>
	);
}
