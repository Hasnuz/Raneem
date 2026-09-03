import { NextResponse, type NextRequest } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export async function proxy(request: NextRequest) {
  try {
    const response = await fetch(
      `${API}/redirects/resolve?path=${encodeURIComponent(request.nextUrl.pathname)}`,
      { next: { revalidate: 60 } },
    );
    if (response.ok) {
      const redirect = await response.json();
      if (redirect?.to) {
        return NextResponse.redirect(new URL(redirect.to, request.url),
          redirect.permanent ? 308 : 307);
      }
    }
  } catch {
    // The website remains available if the settings API is temporarily offline.
  }
  const requestHeaders = new Headers(request.headers);
  const arabic = request.nextUrl.pathname === "/ar" || request.nextUrl.pathname.startsWith("/ar/");
  requestHeaders.set("x-raneem-locale", arabic ? "ar" : "en");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
