import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'

export function middleware(request: NextRequest) {
    const authJson = request.cookies.get('auth')?.value as string;
    if (authJson) {
        const auth = JSON.parse(authJson);
        const roles = auth.roles as Array<string>;
        if (request.nextUrl.pathname == '/') {
            if (roles.includes('ROLE_ADMIN')) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            } else if (roles.includes('ROLE_RUNNER')) {
                return NextResponse.redirect(new URL('/boards', request.url));
            } else if (roles.includes('ROLE_USER')) {
                return NextResponse.redirect(new URL('/telling', request.url));
            }
        }
    }
}

export const config = {
    matcher: '/:path*',
}