import dynamic from 'next/dynamic';
import Translator from '../../../utils/Translate/Translator';
import AircraftSearch from './SearchAircraft';

const PlaneSearchIcon = dynamic(() => import('@icons/plane-search.svg')) as SVGComponent;
const PlaneIcon = dynamic(() => import('@icons/plane-solid.svg')) as SVGComponent;
const CardWithTitle = dynamic(() => import('../../../components/Card/CardWithTitle'));
const MyAcftTable = dynamic(() => import('./MyAcftTable'));

const translator = new Translator({
  myAircraft: { 'en-US': 'My aircraft', 'pt-BR': 'Minhas aeronaves' },
  searchAircraft: { 'en-US': 'Aircraft search', 'pt-BR': 'Busca de aeronave' },
});

type Props = {
  params: {
    lang: Langs
  };
};

const MyAircraft = async ({
  params: { lang },
}: Props) => {
  Translator.setLang(lang);

  return (
    <div className='container'>
      <CardWithTitle
          title={translator.capitalize().translate('searchAircraft')}
          Icon={<PlaneSearchIcon width="20"/>}
          styled
        >
        <div>
          <AircraftSearch/>
        </div>
      </CardWithTitle>
      <CardWithTitle
        title={translator.capitalize().translate('myAircraft')}
        Icon={<PlaneIcon width="20"/>}
        styled
      >
        <div>
          <MyAcftTable/>
        </div>
      </CardWithTitle>
    </div>
  );
};

export default MyAircraft;

