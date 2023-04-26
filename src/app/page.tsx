import { fetchCoordinates } from '../API/fetch/aerodrome';
import GMap from '../components/Map/GMap';
import Main from '../containers/Main';

/** */
export default async function Home() {
  const coords = await fetchCoordinates(undefined);
  return (
    <div style={{ height: 'var(--vh)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flexGrow: '1' }}>
        <GMap markers={coords}/>
      </div>
    </div>
  );
}
