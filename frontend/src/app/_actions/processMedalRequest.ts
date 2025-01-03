"use server"
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function processMedalRequest(form: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    redirect('/');
  }

  const apiResponse = await fetch('http://localhost:4000/api/admin/process-medal-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify({
      request_id: form.get('request_id'),
      action: form.get('action'),
    }),
  });

  const data = await apiResponse.json();
  console.log(data);

  if (!apiResponse.ok) {
    throw new Error('Ocurrió un error al procesar la solicitud');
  }

  revalidatePath('/admin');
}
