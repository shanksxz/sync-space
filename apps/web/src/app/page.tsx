import Landing from "@/components/landing/landing";
import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Page() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-8">
			{/* <pre>{JSON.stringify(session, null, 2)}</pre>
			<Link href="/auth/signin">
				{!session && <Button>Sign in</Button> }
			</Link> */}
			<Landing />
		</div>
	);
}
