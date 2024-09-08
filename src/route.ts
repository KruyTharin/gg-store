export const ROUTES = {
  /**
   * These routes do not require authentication
   * @type {string[]}
   */
  PUBLIC_ROUTES: ['/'],

  /**
   * An array of routes that are accessible to public routes
   * @type {string[]}
   */
  AUTH_ROUTES: [
    '/auth/login',
    '/auth/register',
    '/auth/error',
    '/auth/new-verification',
    '/auth/forgot-password',
    '/auth/new-password',
  ],

  /**
   * The prefix for the authentication routes
   * Routes that start with a prefix are used for api authentication
   * @type {string}
   */
  API_AUTH_PREFIX: '/api/auth',

  /**
   * The prefix for the webhook routes
   * @type {string}
   */
  API_WEBHOOK: '/api/webhook',

  /**
   * The routes that redirect to after a successful login
   */
  DEFAULT_LOGIN_REDIRECT_URL: '/setting',

  //Auth
  LOGIN: '/auth/login',
};
