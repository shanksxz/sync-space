import { auth } from "@/server/auth/auth";
import { api } from "@/trpc/server";
import { Octokit } from "@octokit/rest";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

interface RepoItem {
	type: "dir" | "file";
	name: string;
	path: string;
	content?: string;
	children?: RepoItem[];
}

export async function GET(req: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	const accessToken = await api.user.getUserAccessToken();

	if (!accessToken) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	const octokit = new Octokit({ auth: accessToken });

	const { searchParams } = new URL(req.url);
	console.log("searchParams", searchParams);
	const repo = searchParams.get("repo");
	const path = searchParams.get("path") || "";

	if (!repo) {
		return NextResponse.json(
			{ error: "Repository name is required" },
			{ status: 400 },
		);
	}

	try {
		const { data: userData } = await octokit.users.getAuthenticated();
		const owner = userData.login;

		console.log(
			`Fetching repo content for owner: ${owner}, repo: ${repo}, path: ${path}`,
		);

		async function fetchContent(path: string): Promise<RepoItem[]> {
			const { data } = await octokit.repos.getContent({
				owner,
				repo: repo as string,
				path,
			});

			if (Array.isArray(data)) {
				const items = await Promise.all(
					data.map(async (item) => {
						const result: RepoItem = {
							type: item.type === "dir" ? "dir" : "file",
							name: item.name,
							path: item.path,
						};
						if (item.type === "dir") {
							result.children = await fetchContent(item.path);
						}
						return result;
					}),
				);
				return items;
			}
			return [];
		}

		const content = await fetchContent(path);
		return NextResponse.json(content);
	} catch (error: any) {
		console.error("Error fetching repo content:", error);
		if (error.status === 404) {
			return NextResponse.json(
				{ error: "Repository or path not found" },
				{ status: 404 },
			);
		}
		return NextResponse.json(
			{ error: "Failed to fetch repo content" },
			{ status: 500 },
		);
	}
}
