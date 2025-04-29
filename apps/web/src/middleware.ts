import type { Session } from "@/server/auth/auth";
import { betterFetch } from "@better-fetch/fetch";
import { type NextRequest, NextResponse } from "next/server";

const authRoutes = ["/auth/signin", "/auth/signup"];
const protectedRoutes = ["/dashboard", "/profile", "/settings", "/workspace/:workspaceId", "/workspace"];

export async function middleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    const isAuthRoute = authRoutes.some((route) => pathName.startsWith(route));
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathName.startsWith(route)
    );

    if (!isAuthRoute && !isProtectedRoute) {
        return NextResponse.next();
    }

    try {
        const { data: session } = await betterFetch<Session | null>(
            "/api/auth/get-session",
            {
                baseURL: process.env.BETTER_AUTH_URL,
                headers: {
                    cookie: request.headers.get("cookie") || "",
                },
            }
        );

        if (!session) {
            if (isAuthRoute) {
                return NextResponse.next();
            }
            if (isProtectedRoute) {
                return NextResponse.redirect(
                    new URL("/auth/signin", request.url)
                );
            }
        }

        if (session && isAuthRoute) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Error in auth middleware:", error);
        // In case of an error, allow the request to proceed
        // The application should handle authentication errors appropriately
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
