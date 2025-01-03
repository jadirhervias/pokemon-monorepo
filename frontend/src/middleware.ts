import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getHomeRouteByRole, Role } from './app/_lib/utils/roles';
import { isEmpty } from './app/_lib/utils/helpers';

const trainerRoutes = ['/trainer'];
const adminRoutes = ['/admin'];
const guestRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token');
  const loggedUserRole = request.cookies.get('user_role');
  const redirectTo = getHomeRouteByRole(loggedUserRole?.value as Role);

  if (
    guestRoutes.some(route => pathname.startsWith(route))
    && !isEmpty(token?.value)
    && !isEmpty(loggedUserRole?.value)
  ) {
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  const protectedRoutes = [...trainerRoutes, ...adminRoutes];
  if (protectedRoutes.some(route => pathname.startsWith(route)) && isEmpty(token?.value)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (trainerRoutes.some(route => pathname.startsWith(route)) && !isEmpty(token?.value) && loggedUserRole?.value === Role.ADMIN) {
    return NextResponse.redirect(new URL(getHomeRouteByRole(Role.ADMIN), request.url));
  }

  if (adminRoutes.some(route => pathname.startsWith(route)) && !isEmpty(token?.value) && loggedUserRole?.value === Role.TRAINER) {
    return NextResponse.redirect(new URL(getHomeRouteByRole(Role.TRAINER), request.url));
  }

  return NextResponse.next();
}
