import { env } from "@/env";
import { auth } from "@/server/auth/auth";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
	secret: env.LIVE_BLOCKS_SECRET_KEY!,
});

export async function POST(req: Request) {
	const session = await auth.api.getSession({
		headers: req.headers,
	});
	if (!session) {
		return new Response("Unauthorized", { status: 401 });
	}

	const user = session.user;
	if (!user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const { room } = await req.json();

	// if (!document) {
	//     return new Response("Unauthorized", { status: 401 });
	// }

	//   const isOwner = document.ownerId === user.id;
	//   const isOrganizationMember =
	//     !!(document.organizationId && document.organizationId === sessionClaims.org_id);

	//   if (!isOwner && !isOrganizationMember) {
	//     return new Response("Unauthorized", { status: 401 });
	//   }

	const name = user.name;
	const nameToNumber = name
		.split("")
		.reduce((acc, char) => acc + char.charCodeAt(0), 0);
	const hue = Math.abs(nameToNumber) % 360;
	const color = `hsl(${hue}, 80%, 60%)`;
	console.log(user, "user");

	const liveblocksSession = liveblocks.prepareSession(user.id, {
		userInfo: {
			name: user.name,
			avatar: user.image ?? "",
			color: color,
		},
	});
	liveblocksSession.allow(room, liveblocksSession.FULL_ACCESS);
	const { body, status } = await liveblocksSession.authorize();
	return new Response(body, { status });
}
