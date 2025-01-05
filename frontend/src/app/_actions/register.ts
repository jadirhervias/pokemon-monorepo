"use server"
import { login } from "./login";

export async function register(form: FormData) {
  const apiResponse = await fetch(`${process.env.BACKEND_URL}/api/users/register-${form.get('role')}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: form.get('username'),
      password: form.get('password'),
    }),
  });

  const data = await apiResponse.json();
  console.log(data);

  if (!apiResponse.ok) {
    throw new Error('Ocurrió un error al registrar el usuario');
  }

  await login(form);
}
