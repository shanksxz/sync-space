import { Liveblocks } from "@liveblocks/node";
import { Octokit } from "octokit";
import * as Y from "yjs";

interface FileMetadata {
	id: string;
	name: string;
	path: string;
	type: "file" | "directory";
	children?: string[];
}

export class GitHubService {
	private octokit: Octokit;
	private liveblocks: Liveblocks;

	constructor(accessToken: string, SecretKey: string) {
		this.octokit = new Octokit({ auth: accessToken });
		this.liveblocks = new Liveblocks({
			secret: SecretKey,
		});
	}

	async importRepository(owner: string, repo: string, branch, roomId: string) {
		console.log("Importing repository", owner, repo, branch, roomId);
		const fileTree = new Map<string, FileMetadata>();
		const yDoc = new Y.Doc();
		const rootMap = yDoc.getMap("root");
		let rootDirId = "";

		const processContent = async (
			path = "",
			parentMap: Y.Map<any> = rootMap,
		): Promise<string[]> => {
			try {
				const { data: contents } = await this.octokit.rest.repos.getContent({
					owner,
					repo,
					path,
					ref: branch,
				});

				const childIds: string[] = [];
				const items = Array.isArray(contents) ? contents : [contents];

				for (const item of items) {
					const itemPath = item.path;
					const id = Buffer.from(itemPath).toString("base64");
					childIds.push(id);

					if (item.type === "dir") {
						const dirMap = new Y.Map();
						parentMap.set(id, dirMap);

						const children = await processContent(itemPath, dirMap);
						fileTree.set(id, {
							id,
							name: item.name,
							path: itemPath,
							type: "directory",
							children,
						});

						if (path === "" && rootDirId === "") {
							rootDirId = id;
						}
					} else if (item.type === "file") {
						const fileMap = new Y.Map();
						const yText = new Y.Text();
						fileMap.set("content", yText);

						try {
							const { data: fileContent } =
								await this.octokit.rest.repos.getContent({
									owner,
									repo,
									path: itemPath,
									ref: branch,
								});

							if (fileContent && "content" in fileContent) {
								const content = Buffer.from(
									fileContent.content,
									"base64",
								).toString();
								yText.insert(0, content);
							}
						} catch (error) {
							console.error(`Error getting content for ${itemPath}:`, error);
						}

						parentMap.set(id, fileMap);
						fileTree.set(id, {
							id,
							name: item.name,
							path: itemPath,
							type: "file",
						});
					}
				}
				return childIds;
			} catch (error) {
				console.error(`Error processing ${path}:`, error);
				return [];
			}
		};

		fileTree.set("root", {
			id: "root",
			name: "/",
			path: "",
			type: "directory",
			children: await processContent(),
		});

		rootDirId = "root";

		await this.pushFileTreeTo(roomId, fileTree, rootDirId);
		await this.pushYjsDocTo(roomId, yDoc);

		return { fileTree, yDoc, rootDirId };
	}

	private async pushFileTreeTo(
		roomId: string,
		fileTree: Map<string, FileMetadata>,
		rootDirId: string,
	) {
		try {
			const filesObj: Record<string, FileMetadata> = {};
			for (const [key, value] of fileTree.entries()) {
				filesObj[key] = value;
			}

			console.log("Pushing fileTree to room", roomId);
			console.log("fileTree", filesObj);

			await this.liveblocks.mutateStorage(roomId, ({ root }) => {
				//TODO: fix this
				// const fileTree = root.get("fileTree");
				// if (!fileTree) {
				root.set("fileTree", {
					//@ts-ignore
					files: filesObj,
					activeFileId: "",
					rootDirId: rootDirId,
					isInitialized: true,
				});
				// }
			});

			console.log(`Updated Storage with fileTree in room ${roomId}`);
		} catch (error) {
			console.error("Error pushing fileTree to :", error);
			throw error;
		}
	}

	private async pushYjsDocTo(roomId: string, yDoc: Y.Doc) {
		try {
			const update = Y.encodeStateAsUpdate(yDoc);
			await this.liveblocks.sendYjsBinaryUpdate(roomId, update);
			console.log(`Updated Yjs document in room ${roomId}`);
		} catch (error) {
			console.error("Error pushing Yjs doc to :", error);
			throw error;
		}
	}
}
