import { Providers } from "@/providers";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Providers>{children}</Providers>
		</div>
	);
}

