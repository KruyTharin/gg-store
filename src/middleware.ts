import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { ROUTES } from './route';

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoutes = nextUrl.pathname.startsWith(ROUTES.API_AUTH_PREFIX);
  const isPublicRoute = ROUTES.PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = ROUTES.AUTH_ROUTES.includes(nextUrl.pathname);

  if (isApiAuthRoutes) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(
        new URL(ROUTES.DEFAULT_LOGIN_REDIRECT_URL, nextUrl)
      );
    }

    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL(ROUTES.LOGIN, nextUrl));
  }

  return;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
