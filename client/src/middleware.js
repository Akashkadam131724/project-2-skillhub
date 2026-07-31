import { NextResponse } from "next/server";
import { cmsEditHrefFromPublicPath } from "@/lib/cms-edit-routes";

/**
 * Redirect legacy ?cms=true (and ?cms=1) on public pages to /cms/.../edit routes.
 */
export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
  const cmsParam = searchParams.get("cms");
  const legacyCms =
    cmsParam?.toLowerCase() === "true" || cmsParam === "1";

  if (!legacyCms) {
    return NextResponse.next();
  }

  const editPath = cmsEditHrefFromPublicPath(pathname);
  if (!editPath || editPath === pathname) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = editPath;
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|cms/).*)",
  ],
};
