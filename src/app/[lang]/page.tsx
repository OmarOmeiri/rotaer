import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { fetchCoordinates } from '../../Http/requests/aerodrome';
import Config from '../../config';
import RotaerLoadingSpinner from '../../components/Loading/RotaerLoadingSpinner';
import { APP_ROUTES } from '../../consts/routes';

const { height: navBarHeight } = Config.get('styles').navBar;

const LoadingSpinner = () => (
  <div>
    <RotaerLoadingSpinner width="30"/>
  </div>
);

const GMap = dynamic(() => import('../../components/Map/GoogleMap/GMap'), {
  loading: () => <LoadingSpinner/>,
});

/** */
export default async function Home() {
  const coords = await fetchCoordinates(undefined);
  return (
    <div style={{ height: `calc(var(--vh) - ${navBarHeight + 1}px)`, display: 'flex', flexDirection: 'column' }}>
      <Link href={APP_ROUTES.myAircraft('pt-BR')}>KKEKEKEKEK</Link>
      <div style={{ flexGrow: '1' }}>
        <Suspense fallback={<LoadingSpinner/>}>
          <GMap markers={coords}/>
        </Suspense>
      </div>
    </div>
  );
}
