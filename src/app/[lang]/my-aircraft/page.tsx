import PlaneSearchIcon from '@icons/plane-search.svg';
import CardWithTitle from '../../../components/Card/CardWithTitle';
import Translator from '../../../utils/Translate/Translator';
import { AircraftSearch } from './SearchAircraft';
import classes from './MyAircraft.module.css';

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
}: Props) => (
  <CardWithTitle
    title={translator.capitalize().translate('searchAircraft')}
    Icon={<PlaneSearchIcon width="20"/>}
    titleClassName={classes.CardTitle}
    className={classes.Card}
  >
    <AircraftSearch/>
  </CardWithTitle>
);

export default MyAircraft;

