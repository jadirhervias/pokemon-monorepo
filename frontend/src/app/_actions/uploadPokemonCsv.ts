"use server"
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function uploadPokemonCsv(form: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    redirect('/');
  }

  const apiResponse = await fetch(`${process.env.BACKEND_URL}/api/trainer/request-medal-evaluation`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    body: form,
  });

  const data = await apiResponse.json();
  console.log(data);

  if (!apiResponse.ok) {
    throw new Error('Ocurrió un error al subir el archivo');
  }
}
