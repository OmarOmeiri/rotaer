import {
  useCallback,
  useEffect, useMemo, useRef, useState,
} from 'react';
import ChevronRight from '@icons/chevronRight.svg';
import ChevronLeft from '@icons/chevronLeft.svg';
import { RouteWaypoint } from '../../../../../../utils/Route/Route';
import { useMetarQueries } from '../../../../../../frameworks/react-query/queries/metar';
import CardWithTitle from '../../../../../../components/Card/CardWithTitle';
import Translator from '../../../../../../utils/Translate/Translator';
import classes from './FlightPlanWeather.module.css';
import Windy from '../../../../../../components/Windy/Windy';

const translator = new Translator({
  title: { 'en-US': 'Weather', 'pt-BR': 'Tempo' },
});

export const FlightPlanWeather = ({
  waypoints,
}: {
  waypoints: RouteWaypoint[] | null
}) => {
  const aerodromes = useMemo(() => (
    Array.from(new Set(waypoints
      ?.filter((w) => w.type === 'ad')
      .map((w) => ({ icao: w.name, coord: w.coord })))) || []
  ), [waypoints]);
  const metarQueries = useMetarQueries(aerodromes.map((ad) => ad.icao));
  const [selectedAerodrome, setSelectedAerodrome] = useState<null | typeof aerodromes[number]>(null);

  const metars = useMemo(() => {
    const metars = metarQueries.map((mq) => mq.data);
    return aerodromes.reduce((metarMap, ad) => {
      const metar = metars.find((m) => m?.includes(ad.icao)) || null;
      metarMap[ad.icao] = metar;
      return metarMap;
    }, {} as {[k: string]: string | null});
  }, [metarQueries, aerodromes]);

  const selectNext = useCallback(() => {
    let index = aerodromes.findIndex((ad) => ad.icao === selectedAerodrome?.icao) + 1;
    if (index >= aerodromes.length) index = 0;
    setSelectedAerodrome(aerodromes[index]);
  }, [aerodromes, selectedAerodrome]);

  const selectPrev = useCallback(() => {
    let index = aerodromes.findIndex((ad) => ad.icao === selectedAerodrome?.icao) - 1;
    if (index < 0) index = aerodromes.length - 1;
    setSelectedAerodrome(aerodromes[index]);
  }, [aerodromes, selectedAerodrome]);

  useEffect(() => {
    setSelectedAerodrome((sa) => {
      if (!sa && aerodromes[0]) return aerodromes[0];
      return sa;
    });
  }, [aerodromes]);

  return (
    <CardWithTitle title={translator.translate('title')} styled>
      <div className={classes.SelectionWrapper}>
        <button name="change-aerodrome-previous" onClick={selectPrev}><ChevronLeft width="8"/></button>
        <div>{selectedAerodrome?.icao}</div>
        <button name="change-aerodrome-next" onClick={selectNext}><ChevronRight width="8"/></button>
      </div>
      {
        selectedAerodrome?.icao
          ? (
            <div className={classes.MetarWrapper}>
              {metars[selectedAerodrome?.icao]}
            </div>
          )
          : null
      }
      {
        selectedAerodrome?.coord?.decimal
          ? (
            <div className={classes.Windy}>
              <Windy lat={selectedAerodrome?.coord?.decimal.lat} lon={selectedAerodrome?.coord?.decimal.lon}/>
            </div>
          )
          : null
      }
    </CardWithTitle>
  );
};
