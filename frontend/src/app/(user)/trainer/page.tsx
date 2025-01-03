import MedalStatus from '@/app/_ui/components/MedalStatus';
import { uploadPokemonCsv } from '@/app/_actions/uploadPokemonCsv';
import { TrainerProfile } from '@/app/_lib/types';
import { getProfile } from '@/app/_actions/getProfile';

const TrainerDashboard = async () => {
  const profile = await getProfile();

  return (
    <>
      <div className="upload">
        <p className="upload-text">¿Cuántos pokemones encontraste hoy?</p>
        <form className="upload-form" action={uploadPokemonCsv}>
          <input type="file" name="pokemon_csv" id="csv-upload" accept=".csv" className="upload-input" />
          <button type="submit" className="upload-button button-gradient">Enviar</button>
        </form>
      </div>

      {profile && <MedalStatus profile={profile as TrainerProfile}/>}
    </>
  );
};

export default TrainerDashboard;