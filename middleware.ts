import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value
    const { pathname } = request.nextUrl

    // 1. Protected Routes Check (Dashboard & Admin)
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // 2. Auth Routes (Login/Register) - Redirect if already logged in
    if (pathname === '/login' || pathname === '/register') {
        if (token) {
            // Ideally we check role to redirect to admin or dashboard, 
            // but without decoding token (which requires 'jose' in middleware), 
            // we will just default to dashboard for now. 
            // The user can navigate to admin from there if they are admin.
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
}
