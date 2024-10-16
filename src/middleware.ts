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
  const isDeliveryRoute = nextUrl.pathname.startsWith(ROUTES.DELIVERY_ROUTES); // Add a check for delivery route

  if (isApiAuthRoutes || isWebHookRoute) {
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    if (isAdminRoute) {
      return Response.redirect(
        new URL(ROUTES.DEFAULT_LOGIN_REDIRECT_URL, nextUrl)
      );
    }
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(
        new URL(ROUTES.DEFAULT_LOGIN_REDIRECT_URL, nextUrl)
      );
    }

    return;
  }

  if (isAdminRoute && isLoggedIn) {
    if (
      (req.auth!.user.role as any) === UserRole.SUPER_ADMIN ||
      (req.auth!.user.role as any) === UserRole.ADMIN
    ) {
      return;
    }
    return Response.redirect(new URL(ROUTES.LOGIN, nextUrl));
  }

  // Check for delivery routes and restrict access to users with DELIVERY role
  if (isDeliveryRoute && isLoggedIn) {
    if (req.auth!.user.role === UserRole.DELIVERY) {
      return;
    }
    return Response.redirect(
      new URL(ROUTES.DEFAULT_LOGIN_REDIRECT_URL, nextUrl)
    );
  }

  return;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
