"use server"
import { redirect } from "next/navigation"
import { getHomeRouteByRole } from "@/app/_lib/utils/roles";
import { cookies } from "next/headers";

export async function login(form: FormData) {
  const apiResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: form.get('username'),
      password: form.get('password'),
    }),
  });

  if (!apiResponse.ok) {
    throw new Error('Ocurrió un error al iniciar sesión');
  }

  const data = await apiResponse.json();
  console.log(data);

  const cookieStore = await cookies();
  cookieStore.set('token', data.access_token);
  cookieStore.set('user_role', data.user.role);
  cookieStore.set('user', JSON.stringify(data.user));

  const redirectTo = getHomeRouteByRole(data.user.role);
  redirect(redirectTo);
}
