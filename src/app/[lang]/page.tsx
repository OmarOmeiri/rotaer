import { fetchCoordinates } from '../../Http/requests/aerodrome';
import GMap from '../../components/Map/GMap';
import Config from '../../config';

const { height: navBarHeight } = Config.get('styles').navBar;

/** */
export default async function Home() {
  const coords = await fetchCoordinates(undefined);
  return (
    <div style={{ height: `calc(var(--vh) - ${navBarHeight + 1}px)`, display: 'flex', flexDirection: 'column' }}>
      {/* <div style={{ flexGrow: '1' }}>
        <GMap markers={coords}/>
      </div> */}
    </div>
  );
}
