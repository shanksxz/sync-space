export default async function Page({
	params,
}: { params: Promise<{ workspaceId: string }> }) {
	const { workspaceId } = await params;
	return (
		<div>
			<h1>Workspace {workspaceId}</h1>
		</div>
	);
}
