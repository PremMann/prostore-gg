
import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: {
        strategy: 'jwt' as const,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [],
    callbacks: {
        async session({ session, user, trigger, token }: any) {
            // Set the user ID from the token
            session.user.id = token.sub;
            session.user.role = token.role;
            session.user.name = token.name;

            // If there is an update, set the user name
            if (trigger === 'update') {
                session.user.name = token.name;
            }

            return session;
        },
        authorized({ request, auth }: any) {
            // Check for session cart cookie
            if (!request.cookies.get('sessionCartId')) {
                // Generate new session cart id cookie
                const sessionCartID = crypto.randomUUID();

                // clone the req headers
                const newRequestHeaders = new Headers(request.headers);

                // Create new response and add the new headers
                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeaders,
                    },
                });

                // Set newly generated sessionCartId in the response cookies
                response.cookies.set('sessionCartId', sessionCartID);
                return response;
            } else {
                return true;
            }

        }
    },
} satisfies NextAuthConfig;
