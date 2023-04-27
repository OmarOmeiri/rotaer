import WindIcon from '@icons/wind-solid.svg';
import WindSockIcon from '@icons/windsock.svg';
import CardWithTitle from '../../../components/Card/CardWithTitle';
import { TAerodromeData } from '../../../types/app/aerodrome';
import classes from '../AerodromeInfo.module.css';
import Windy from '../../../components/Windy/Windy';
import METARParser from '../../../utils/METAR/METAR';

const AerodromeMetTab = ({ info, metar }: {info: TAerodromeData, metar: string | null}) => (
  <>
    <CardWithTitle title='METAR' Icon={<WindIcon width="20"/>} className={classes.Card} titleClassName={classes.CardTitle}>
      <div>
        {
          metar
            ? (
              <>
                <div>{metar}</div>
                <div>
                  <code>
                    <pre>
                      {JSON.stringify(new METARParser(metar).parse().toObject(), null, 2)}
                    </pre>
                  </code>
                </div>
              </>
            )
            : null
        }
      </div>
    </CardWithTitle>
    <CardWithTitle title='Previsão' Icon={<WindSockIcon width="20"/>} className={classes.Card} titleClassName={classes.CardTitle}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Windy
          lat={info.coords.decimal.lat}
          lon={info.coords.decimal.lon}
        />
      </div>
    </CardWithTitle>
  </>
);
export default AerodromeMetTab;
