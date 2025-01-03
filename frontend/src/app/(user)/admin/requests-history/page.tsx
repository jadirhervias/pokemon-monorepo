import { cookies } from 'next/headers'
import { MedalRequest } from '@/app/_lib/types';
import Image from 'next/image';

const RequestsHistory = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  let medalRequestHistory: MedalRequest[] = [];

  const STATUS_MESSAGE: Record<string, string> = {
    accepted: 'Aceptado',
    rejected: 'Rechazado',
  };

  if (token) {
    const reponse = await fetch('http://localhost:4000/api/admin/requests-history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
    });

    medalRequestHistory = await reponse.json();
  }

  if (medalRequestHistory.length === 0) {
    return <div>
      <Image style={{transform: 'scaleX(-1)'}} alt="no-history-requests" src="/vamo-a-calmarno.png" width={200} height={200} priority />
      <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Aún no hay solicitudes</p>
    </div>;
  }

  return (
    <div className="history">
      <table>
        <thead>
          <tr>
            <th>Entrenador</th>
            <th># Registros</th>
            <th>Tipo de archivo</th>
            <th>Medalla</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {
            medalRequestHistory.length > 0 && medalRequestHistory.map((item: MedalRequest) => (
              <tr key={item.id}>
                <td>{item.trainer_username}</td>
                <td>{item.pokemon_count}</td>
                <td>.csv</td>
                <td>{item.medal}</td>
                <td>{STATUS_MESSAGE[item.status] ?? 'Pendiente' }</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default RequestsHistory;