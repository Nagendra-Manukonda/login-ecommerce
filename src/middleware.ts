import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const user = req.cookies.get("user")?.value
  const { pathname } = req.nextUrl

  if (!user && pathname === "/") {
    return NextResponse.redirect(new URL("/Sign-In", req.url))
  }

  if (user && pathname === "/Sign-In") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/Sign-In,"]
}
