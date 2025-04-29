import { env } from "@/env";
import { auth } from "@/server/auth/auth";
import { Octokit } from "@octokit/rest";
import { Liveblocks } from "@liveblocks/node";
import { db, eq, accounts } from "@syncspace/database";

const liveblocks = new Liveblocks({
    secret: env.LIVE_BLOCKS_SECRET_KEY,
});

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: req.headers,
    });

    if (!session?.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { repoOwner, repoName, filePath, roomId } = await req.json();

    if (!repoOwner || !repoName || !roomId) {
        return new Response("Missing required fields", { status: 400 });
    }

    try {
        // get access token from database
        const githubAccount = await db.query.accounts.findFirst({
            where: eq(accounts.userId, session.user.id),
        });

        if (!githubAccount?.accessToken) {
            return new Response("GitHub account not connected", {
                status: 400,
            });
        }

        const octokit = new Octokit({
            auth: githubAccount.accessToken,
        });

        let fileContent = "";

        if (filePath) {
            const response = await octokit.repos.getContent({
                owner: repoOwner,
                repo: repoName,
                path: filePath,
            });

            if (Array.isArray(response.data)) {
                return new Response("Path is a directory, not a file", {
                    status: 400,
                });
            }

            const fileData = response.data;
            if ('content' in fileData && fileData.type === 'file') {
                fileContent = Buffer.from(
                    fileData.content,
                    "base64"
                ).toString();
            } else {
                return new Response("Cannot read this type of file", {
                    status: 400,
                });
            }
        } else {
            fileContent = "// Start coding here";
        }

        const room = await liveblocks.getRoom(roomId);
        const storage = await room.getStorage();

        await storage.updateYjsDoc("default", (yjsDoc: any) => {
            const ytext = yjsDoc.getText("codemirror");
            ytext.delete(0, ytext.length);
            ytext.insert(0, fileContent);
            return yjsDoc;
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error creating workspace:", error);
        return new Response(
            JSON.stringify({ error: "Failed to create workspace" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
