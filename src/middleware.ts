import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { ROUTES } from './route';
import { UserRole } from '@prisma/client';

export const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoutes = nextUrl.pathname.startsWith(ROUTES.API_AUTH_PREFIX);
  const isWebHookRoute = nextUrl.pathname.startsWith(ROUTES.API_WEBHOOK);
  const isPublicRoute = ROUTES.PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = ROUTES.AUTH_ROUTES.includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.startsWith(ROUTES.ADMIN_ROUTES);

  if (isApiAuthRoutes || isWebHookRoute) {
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    if (isAdminRoute) {
      return Response.redirect(
        new URL(ROUTES.DEFAULT_LOGIN_REDIRECT_URL, nextUrl)
      );
    }

    console.log('called', isAdminRoute);
    // return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(
        new URL(ROUTES.DEFAULT_LOGIN_REDIRECT_URL, nextUrl)
      );

      return;
    }

    return;
  }

  if (isAdminRoute && isLoggedIn) {
    if ((req.auth!.user.role as any) !== UserRole.ADMIN) {
      return Response.redirect(new URL(ROUTES.LOGIN, nextUrl));
    }

    return;
  }

  return;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
