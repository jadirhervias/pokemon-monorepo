import { cookies } from "next/headers";
import { UserProfile } from '@/app/_lib/types';
import { redirect } from "next/navigation";

export async function getProfile(): Promise<UserProfile> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    redirect('/');
  }

  const apiResponse = await fetch('http://localhost:4000/api/users/profile', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (!apiResponse.ok) {
    throw new Error('Ocurrió un error al obtener los datos del perfil');
  }

  const data = await apiResponse.json();
  console.log(data);

  return data as UserProfile;
}