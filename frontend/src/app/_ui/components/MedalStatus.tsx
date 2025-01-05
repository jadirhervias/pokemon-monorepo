"use client"
import { useEffect, useState } from 'react';
import Image from "next/image";
import { useSocket } from '@/app/_lib/hooks/useSocket';
import { MedalAccepted, TrainerProfile } from '@/app/_lib/types';
import Medal from './Medal';

const MedalStatus = ({ profile }: { profile: TrainerProfile }) => {
  const [pokemonCount, setPokemonCount] = useState<number>(profile.pokemon_count);
  const [medalName, setMedalName] = useState<string | null>(profile.next_medal ?? profile.current_medal);
  const [medalThreshold, setMedalThreshold] = useState<number | null>(profile.next_medal_threshold);
  const [medalRequested, setMedalRequested] = useState<boolean>(profile.pending_pokemon_count > 0 && !!profile.next_medal);
  const { socketIsConnected, socketEvents } = useSocket<MedalAccepted>();
  const [animateMedal, setAnimateMedal] = useState(false);

  useEffect(
    () => {
      if (socketIsConnected && socketEvents.lastEvent) {
        // Accepted request
        const nextMedal = socketEvents.lastEvent.data.next_medal;
        const nextMedalThreshold = socketEvents.lastEvent.data.next_medal_threshold;
        setPokemonCount(socketEvents.lastEvent.data.new_pokemon_count);
        if (nextMedal && nextMedalThreshold) {
          if (nextMedal !== medalName) {
            setAnimateMedal(true);
            setTimeout(() => setAnimateMedal(false), 1000);
          }

          setMedalName(nextMedal);
          setMedalThreshold(nextMedalThreshold);
          setMedalRequested(true);
        }
      }
    },
    [socketEvents, socketIsConnected, medalName]
  );

  return (
    <div className="medal-status">
    {
      pokemonCount === 0 ? (
        <div className="medal">
          <p style={{textAlign: 'center', fontWeight: 'bold'}}>Aún no cuentas con medallas</p>
          <Image
            src="/vamo-a-calmarno.png"
            alt="vamo-a-calmarno"
            style={{ margin: '1rem' }}
            width={160}
            height={160}
            priority
          />
        </div>
      ) : (
        <>
          <div className={`medal ${animateMedal ? "animate" : ""}`}>
            <p>
              {medalName} {medalRequested && <strong>(Por verificar)</strong>}
            </p>
            <Medal style={{ margin: "1rem" }} type={medalName} />
          </div>
          { medalThreshold && pokemonCount < medalThreshold
              ? (
              <div style={{justifyItems: 'center'}}>
                <progress value={pokemonCount} max={medalThreshold}></progress>
                <p><strong>{pokemonCount}/{medalThreshold}</strong></p>
              </div>
            ) : (
              <div>Total de registros: <strong>{pokemonCount}</strong></div>
            )
          }
        </>
      )
    }
  </div>
  );
}

export default MedalStatus;