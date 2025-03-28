import { auth } from "@/server/auth/auth";
import { api } from "@/trpc/server";
import { Octokit } from "@octokit/rest";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

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

	const repo = searchParams.get("repo");
	const path = searchParams.get("path");

	if (!repo || !path) {
		return NextResponse.json(
			{ error: "Repository name and file path are required" },
			{ status: 400 },
		);
	}

	try {
		const { data: userData } = await octokit.users.getAuthenticated();
		const owner = userData.login;

		console.log(
			`Fetching file content for owner: ${owner}, repo: ${repo}, path: ${path}`,
		);

		const { data } = await octokit.repos.getContent({
			owner,
			repo,
			path,
		});

		console.log("data", data);

		if ("content" in data) {
			const content = Buffer.from(data.content, "base64").toString("utf-8");
			return NextResponse.json({ content });
		} else {
			return NextResponse.json({ error: "Not a file" }, { status: 400 });
		}
	} catch (error: any) {
		console.error("Error fetching file content:", error);
		if (error.status === 404) {
			return NextResponse.json(
				{ error: "File or repository not found" },
				{ status: 404 },
			);
		} else if (error.status === 403) {
			return NextResponse.json(
				{ error: "Insufficient permissions to access this file or repository" },
				{ status: 403 },
			);
		}
		return NextResponse.json(
			{ error: "Failed to fetch file content" },
			{ status: 500 },
		);
	}
}
