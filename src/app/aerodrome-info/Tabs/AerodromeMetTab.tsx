'use client';

import WindIcon from '@icons/wind-solid.svg';
import WindSockIcon from '@icons/windsock.svg';
import CardWithTitle from '../../../components/Card/CardWithTitle';
import { TAerodromeData } from '../../../types/app/aerodrome';
import classes from '../AerodromeInfo.module.css';
import Windy from '../../../components/Windy/Windy';
import { MetarTable } from '../../../components/Metar/MetarTable';
import METARParser from '../../../utils/METAR/METAR';

const AerodromeMetTab = ({ info, metar }: {info: TAerodromeData, metar: ReturnType<METARParser['toObject']> | null}) => (
  <>
    {
        metar
          ? (
            <CardWithTitle title='METAR' Icon={<WindIcon width="20"/>} className={classes.Card} titleClassName={classes.CardTitle}>
              <div>
                <MetarTable parsedMetar={metar}/>
              </div>
            </CardWithTitle>
          )
          : null
    }
    {
        info.coords
          ? (
            <CardWithTitle title='Previsão' Icon={<WindSockIcon width="20"/>} className={classes.Card} titleClassName={classes.CardTitle}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Windy
                  lat={info.coords.decimal.lat}
                  lon={info.coords.decimal.lon}
                  width={900}
                />
              </div>
            </CardWithTitle>
          )
          : null
      }
  </>
);
export default AerodromeMetTab;
