import Medal from "@/app/_ui/components/Medal";
import { TrainerProfile } from "@/app/_lib/types";
import { getProfile } from "@/app/_actions/getProfile";
import Image from "next/image";

const MyMedals = async () => {
  const profile = await getProfile() as TrainerProfile;

  if (!profile || profile?.achieved_medals.length === 0) {
    return <div style={{ justifyItems: 'center' }}>
      <Image style={{padding: '1rem'}} alt="no-my-medals" src="/pokemon-insignia.svg" width={150} height={150} priority />
      <p style={{ textAlign: 'center', fontWeight: 'bold', maxWidth: '300px' }}>
        Registra todos los pokemones que puedas y consigue tus medallas
      </p>
    </div>;
  }

  return (
    <ul className="medals-list">
      {
        profile && profile.achieved_medals.map((medal: string) => (
          <li key={medal}>
            <Medal type={medal}/>
            <p>{medal}</p>
          </li>
        ))
      }
    </ul>
  );
};

export default MyMedals;