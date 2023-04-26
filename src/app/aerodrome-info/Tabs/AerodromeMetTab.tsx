import WindIcon from '@icons/wind-solid.svg';
import CardWithTitle from '../../../components/Card/CardWithTitle';
import { TAerodromeData } from '../../../types/app/aerodrome';
import classes from '../AerodromeInfo.module.css';
import Windy from '../../../components/Windy/Windy';

const AerodromeMetTab = ({ info }: {info: TAerodromeData}) => (
  <CardWithTitle title='Previsão' Icon={<WindIcon width="20"/>} className={classes.Card} titleClassName={classes.CardTitle}>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Windy
        lat={info.coords.decimal.lat}
        lon={info.coords.decimal.lon}
      />
    </div>
  </CardWithTitle>
);

export default AerodromeMetTab;
