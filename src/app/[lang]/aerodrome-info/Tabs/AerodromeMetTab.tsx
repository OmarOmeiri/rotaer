import WindIcon from '@icons/wind-solid.svg';
import WindSockIcon from '@icons/windsock.svg';
import CardWithTitle from '../../../../components/Card/CardWithTitle';
import { TAerodromeData } from '../../../../types/app/aerodrome';
import classes from '../AerodromeInfo.module.css';
import Windy from '../../../../components/Windy/Windy';
import { MetarTable } from '../../../../components/Metar/MetarTable';
import METARParser from '../../../../utils/METAR/METAR';
import langStore from '../../../../store/lang/langStore';
import Translator from '../../../../utils/Translate/Translator';

const translator = new Translator({
  forecast: { 'pt-BR': 'Previsão', 'en-US': 'Forecast' },
});

/* TESTAR
* METAR SBSM 032300Z 12004KT 3000 -RA OVC004 17/17 Q1015
* METAR SBSM 041100Z 09004KT 060V120 1500 R11/P2000 R29/P2000 -DZ BR OVC002 17/17 Q1016
*/
const AerodromeMetTab = ({ info, metar }: {info: TAerodromeData, metar: ReturnType<METARParser['toObject']> | null}) => {
  const { lang } = langStore.getState();
  return (
    <>
      {
        metar
          ? (
            <CardWithTitle title='METAR' Icon={<WindIcon width="20"/>} className={classes.Card} titleClassName={classes.CardTitle}>
              <div>
                <MetarTable parsedMetar={metar} lang={lang}/>
              </div>
            </CardWithTitle>
          )
          : null
    }
      {
        info.coords
          ? (
            <CardWithTitle title={translator.translate('forecast')} Icon={<WindSockIcon width="20"/>} className={classes.Card} titleClassName={classes.CardTitle}>
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
};
export default AerodromeMetTab;
