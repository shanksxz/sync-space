// app/api/import-repo/route.ts
import { Octokit } from "@octokit/rest";
import { Liveblocks, LiveObject, LiveMap } from "@liveblocks/node";
import { db, eq, accounts } from "@syncspace/database";
import { auth } from "@/server/auth/auth";

const liveblocks = new Liveblocks({
    secret: process.env.LIVE_BLOCKS_SECRET_KEY!,
});

async function fetchGitHubRepoRecursive(
    octokit: Octokit,
    owner: string,
    repo: string,
    path: string = ""
): Promise<Map<string, { content: string; sha: string }>> {
    const files = new Map();
    const { data } = await octokit.repos.getContent({ owner, repo, path });

    if (Array.isArray(data)) {
        for (const item of data) {
            if (item.type === "dir") {
                const subFiles = await fetchGitHubRepoRecursive(
                    octokit,
                    owner,
                    repo,
                    item.path
                );
                subFiles.forEach((value, key) => files.set(key, value));
            } else if (item.type === "file") {
                const content = Buffer.from(item.content!, "base64").toString();
                files.set(item.path, { content, sha: item.sha });
            }
        }
    }

    return files;
}

export async function POST(req: Request) {
    const { repoOwner, repoName } = await req.json();
    const session = await auth.api.getSession({
        headers: req.headers,
    });

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const githubAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, session?.user.id),
    });

    if (!githubAccount) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const octokit = new Octokit({ auth: githubAccount.accessToken });

        // 1. Fetch all files recursively
        const files = await fetchGitHubRepoRecursive(
            octokit,
            repoOwner,
            repoName
        );

        // 2. Prepare Liveblocks storage structure
        const liveMap = new LiveMap(
            Array.from(files.entries()).map(([path, file]) => [
                path,
                new LiveObject({
                    content: file.content,
                    sha: file.sha,
                    lastSynced: Date.now(),
                }),
            ])
        );

        // 3. Create/update room with initial storage
        await liveblocks.initializeRoom(roomId, {
            storage: {
                files: liveMap,
                repoMeta: new LiveObject({
                    owner: repoOwner,
                    name: repoName,
                    defaultBranch: "main",
                }),
            },
        });

        return new Response(JSON.stringify({ success: true }));
    } catch (error) {
        console.error("Repo import failed:", error);
        return new Response("Import failed", { status: 500 });
    }
}
