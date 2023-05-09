import { AircraftSearch } from './SearchAircraft';

type Props = {

  params: {
    lang: Langs
  };
};

const MyAircraft = async ({
  params: { lang },
}: Props) => (
  <div>
    <AircraftSearch lang={lang}/>
  </div>
);

export default MyAircraft;

