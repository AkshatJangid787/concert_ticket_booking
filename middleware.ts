import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function runs BEFORE every request to the server
export function middleware(request: NextRequest) {
    // 1. Get the User's Token (if they have one)
    const token = request.cookies.get('auth_token')?.value
    const { pathname } = request.nextUrl

    // 2. Protect Private Routes (Dashboard & Admin)
    // If user tries to visit these pages without a token, send them to Login.
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // 3. Handle Guest Routes (Login/Register)
    // If user IS logged in, they shouldn't see the login page again.
    // Send them to the Dashboard instead.
    if (pathname === '/login' || pathname === '/register') {
        if (token) {
            // Ideally we check role to redirect to admin or dashboard, 
            // but without decoding token (which requires 'jose' in middleware), 
            // we will just default to dashboard for now. 
            // The user can navigate to admin from there if they are admin.
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    // 4. Continue as normal if no rules matched
    return NextResponse.next()
}

// Configuration: Only run this middleware on these paths
export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
}
