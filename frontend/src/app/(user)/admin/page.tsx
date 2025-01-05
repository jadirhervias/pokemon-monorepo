import { cookies } from 'next/headers'
import AdminTable from '@/app/_ui/components/AdminTable';
import { MedalRequest } from '@/app/_lib/types';

const AdminDashboard = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  let medalRequests: MedalRequest[] = [];

  if (token) {
    const reponse = await fetch(`${process.env.BACKEND_URL}/api/admin/requests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
    });

    medalRequests = await reponse.json();
  }

  return (
    <div className="requests">
      <AdminTable items={medalRequests} />
    </div>
  );
};

export default AdminDashboard;