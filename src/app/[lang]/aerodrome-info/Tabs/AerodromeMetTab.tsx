import dynamic from 'next/dynamic';
import type { TAerodromeData } from '../../../../types/app/aerodrome';
import classes from '../AerodromeInfo.module.css';
import { MetarTable } from '../../../../components/Metar/MetarTable';
import METARParser from '../../../../utils/METAR/METAR';
import langStore from '../../../../store/lang/langStore';
import Translator from '../../../../utils/Translate/Translator';

const WindIcon = dynamic(() => import('@icons/wind-solid.svg')) as SVGComponent;
const WindSockIcon = dynamic(() => import('@icons/windsock.svg')) as SVGComponent;
const CardWithTitle = dynamic(() => import('../../../../components/Card/CardWithTitle'));
const Windy = dynamic(() => import('../../../../components/Windy/Windy'));

const translator = new Translator({
  forecast: { 'pt-BR': 'Previsão', 'en-US': 'Forecast' },
});

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
