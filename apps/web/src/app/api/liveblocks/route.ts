import { env } from "@/env";
import { auth } from "@/server/auth/auth";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
	secret: env.LIVE_BLOCKS_SECRET_KEY,
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
	//TODO: think of a better way to generate color
	const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

	const liveblocksSession = liveblocks.prepareSession(user.id, {
		userInfo: {
			githubUsername: user.username,
			name: user.name,
			avatar: user.image ?? "",
			email: user.email,
			color,
		},
	});
	liveblocksSession.allow(room, liveblocksSession.FULL_ACCESS);
	const { body, status } = await liveblocksSession.authorize();
	return new Response(body, { status });
}
