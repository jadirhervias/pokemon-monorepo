"use client"
import { useEffect, useState } from 'react';
import { processMedalRequest } from '@/app/_actions/processMedalRequest';
import { SocketEvent, useSocket } from '@/app/_lib/hooks/useSocket';
import { MedalRequest } from '@/app/_lib/types';
import Image from 'next/image';

const AdminTable = ({ items }: { items: MedalRequest[] }) => {
  const { socketEvents, emptySocketEvents } = useSocket<MedalRequest>();
  const [requests, setRequests] = useState<MedalRequest[]>(items);

  // React to path revalidation
  useEffect(
    () => {
      setRequests(items);
    },
    [items]
  );

  useEffect(
    () => {
      if (socketEvents.lastEvent) {
        const lastEvent = socketEvents.lastEvent as SocketEvent<MedalRequest>;
        setRequests(prev => [
          lastEvent.data,
          ...prev.filter(item => item.trainer_id !== lastEvent.data.trainer_id),
        ]);
        emptySocketEvents(); // ensure not rendering already processed events
      }
    },
    [socketEvents.lastEvent]
  );

  if (requests.length === 0) {
    return <div>
      <Image alt="no-requests" src="/vamo-a-calmarno.png" width={200} height={200} priority />
      <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Aún no hay solicitudes</p>
    </div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Entrenador</th>
          <th># Registros</th>
          <th>Tipo de archivo</th>
          <th>Medalla</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
      {
        requests.map(item => (
          <tr key={item.id}>
            <td>{item.trainer_username}</td>
            <td>{item.pokemon_count}</td>
            <td>.csv</td>
            <td>{item.medal}</td>
            <td style={{ display: 'inline-flex', alignItems: 'center' }}>
              <form action={processMedalRequest}>
                <input type="hidden" name="request_id" value={item.id} />
                <input type="hidden" name="action" value="accept" />
                <button type="submit" style={{border: 'none', cursor: 'pointer'}}>
                  <Image alt="accept" src="/accept-icon.png" width={35} height={35}/>
                </button>
              </form>
              <form action={processMedalRequest}>
                <input type="hidden" name="request_id" value={item.id} />
                <input type="hidden" name="action" value="reject" />
                <button type="submit" style={{border: 'none', cursor: 'pointer'}}>
                  <Image alt="accept" src="/reject-icon.png" width={50} height={50}/>
                </button>
              </form>
            </td>
          </tr>
        ))
      }
      </tbody>
    </table>
  );
}

export default AdminTable;