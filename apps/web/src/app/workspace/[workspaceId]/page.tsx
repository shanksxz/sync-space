import { api } from "@/trpc/server";

type tProps = Promise<{
	workspaceId: string;
}>;

export default async function WorkspacePage({ params }: { params: tProps }) {
	const { workspaceId } = await params;
	// const workspace = await api.workspace.getWorkspaceById({ id: workspaceId });
	// return <div>Workspace {workspaceId}</div>;
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-2xl font-bold">Click on a file to edit it</h1>
		</div>
	);
}
