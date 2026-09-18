import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/constants/auth";
import { routes } from "@/constants/routes";
import {
  homeForSession,
  isAdminSession,
  isCitizenSession,
  isFrontDeskSession,
  isOfficialSession,
  parseSession,
  postAdminLoginPath,
  postFrontDeskLoginPath,
  postLoginPath,
  postOfficialLoginPath,
} from "@/lib/session";

function redirectTo(request: NextRequest, pathname: string, search?: Record<string, string>) {
  const url = request.nextUrl.clone();
  url.search = "";
  url.pathname = pathname;
  if (search) {
    for (const [key, value] of Object.entries(search)) {
      url.searchParams.set(key, value);
    }
  }
  return NextResponse.redirect(url);
}

export function proxy(request: NextRequest) {
  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);
  const { pathname, searchParams } = request.nextUrl;

  if (pathname.startsWith("/citizen")) {
    if (!isCitizenSession(session)) {
      if (session) return redirectTo(request, homeForSession(session));
      return redirectTo(request, routes.login, {
        next: `${pathname}${request.nextUrl.search}`,
      });
    }
    return NextResponse.next();
  }

  if (pathname === routes.officialLogin) {
    if (isOfficialSession(session)) {
      return redirectTo(request, postOfficialLoginPath(searchParams.get("next")));
    }
    if (session) return redirectTo(request, homeForSession(session));
    return NextResponse.next();
  }

  if (pathname.startsWith("/official")) {
    if (!isOfficialSession(session)) {
      if (session) return redirectTo(request, homeForSession(session));
      return redirectTo(request, routes.officialLogin, {
        next: `${pathname}${request.nextUrl.search}`,
      });
    }
    return NextResponse.next();
  }

  if (pathname === routes.frontDeskLogin) {
    if (isFrontDeskSession(session)) {
      return redirectTo(request, postFrontDeskLoginPath(searchParams.get("next")));
    }
    if (session) return redirectTo(request, homeForSession(session));
    return NextResponse.next();
  }

  if (pathname.startsWith("/front-desk")) {
    if (!isFrontDeskSession(session)) {
      if (session) return redirectTo(request, homeForSession(session));
      return redirectTo(request, routes.frontDeskLogin, {
        next: `${pathname}${request.nextUrl.search}`,
      });
    }
    return NextResponse.next();
  }

  if (pathname === routes.adminLogin) {
    if (isAdminSession(session)) {
      return redirectTo(request, postAdminLoginPath(searchParams.get("next")));
    }
    if (session) return redirectTo(request, homeForSession(session));
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!isAdminSession(session)) {
      if (session) return redirectTo(request, homeForSession(session));
      return redirectTo(request, routes.adminLogin, {
        next: `${pathname}${request.nextUrl.search}`,
      });
    }
    return NextResponse.next();
  }

  if ((pathname === routes.login || pathname === routes.register) && session) {
    if (isOfficialSession(session)) {
      return redirectTo(request, routes.officialDashboard);
    }
    if (isFrontDeskSession(session)) {
      return redirectTo(request, routes.frontDeskDashboard);
    }
    if (isAdminSession(session)) {
      return redirectTo(request, routes.adminDashboard);
    }
    return redirectTo(
      request,
      postLoginPath(searchParams.get("intent"), searchParams.get("next")),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/citizen/:path*",
    "/official/:path*",
    "/front-desk/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
