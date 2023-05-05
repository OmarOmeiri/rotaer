import { Fragment, useMemo } from 'react';
import METARParser, { METARGroupNames } from '../../utils/METAR/METAR';
import { formatDate } from '../../utils/format/date';
import classes from './MetarTable.module.css';
import { TooltipClick } from '../Tooltips/TooltipClick';
import StyledTooltip from '../Tooltips/StyledTooltip';
import Translator from '../../utils/Translate/Translator';
import { TooltipHover } from '../Tooltips/TooltipHover';

type Props = {
  metar: string,
  parsedMetar?: undefined
  lang?: Langs,
} | {
  metar?: undefined,
  parsedMetar?: ReturnType<METARParser['toObject']>
  lang?: Langs,
}

const translator = new Translator({
  type: { 'pt-BR': 'Tipo', 'en-US': 'Type' },
  location: { 'pt-BR': 'Local', 'en-US': 'Location' },
  time: { 'pt-BR': 'Horário', 'en-US': 'Time' },
  wind: { 'pt-BR': 'Ventos', 'en-US': 'Wind' },
  visibility: { 'pt-BR': 'Visibilidade vert.', 'en-US': 'Vert. visibility' },
  visibilityValueGt10Km: { 'pt-BR': 'Mais de 10km', 'en-US': 'Over 10km' },
  visibilityVariation: { 'pt-BR': 'Variação de visibilidade', 'en-US': 'Visibility variation' },
  runway: { 'pt-BR': 'Pista', 'en-US': 'runway' },
  max: { 'pt-BR': 'Máx.', 'en-US': 'Max.' },
  min: { 'pt-BR': 'Mín.', 'en-US': 'Min' },
  trend: { 'pt-BR': 'Tendência', 'en-US': 'Trend' },
  sigWeather: { 'pt-BR': 'Tempo significativo', 'en-US': 'Significant weather' },
  recentWeather: { 'pt-BR': 'Tempo recente', 'en-US': 'Recent Weather' },
  clouds: { 'pt-BR': 'Nuvens', 'en-US': 'Clouds' },
  temperature: { 'pt-BR': 'Temperatura', 'en-US': 'Temperature' },
  dewPoint: { 'pt-BR': 'Ponto de orvalho', 'en-US': 'Dewpoint' },
  humid: { 'pt-BR': 'Umidade relativa', 'en-US': 'Relative humidity' },
});

const metarGroupNamesTranslator: {[G in METARGroupNames]: {[L in Langs]:{name: string, desc: string, color: string}}} = {
  header: {
    'pt-BR': { name: 'Cabeçalho', desc: 'Contém o tipo da observação e o identificador do aeródromo.', color: '#42ac5f' },
    'en-US': { name: 'Header', desc: 'Informs the type of observation and the aerodrome identifier.', color: '#42ac5f' },
  },
  time: {
    'pt-BR': { name: 'Horário', desc: 'Informações do horário da observação.', color: '#944fa5' },
    'en-US': { name: 'Time', desc: 'Informs the time of the observation.', color: '#944fa5' },
  },
  auto: {
    'pt-BR': { name: 'Automático', desc: 'Informa se a observação foi realizada de forma automaitizada.', color: '#b75328' },
    'en-US': { name: 'Auto', desc: 'Informs if the observation was obtained automatically.', color: '#b75328' },
  },
  wind: {
    'pt-BR': { name: 'Ventos', desc: 'Contém as informações de vento da observação.', color: '#3398b0' },
    'en-US': { name: 'Wind', desc: 'Contains the current wind information.', color: '#3398b0' },
  },
  visibility: {
    'pt-BR': { name: 'Visibilidade', desc: 'Apresenta as características de visibilidade no local.', color: '#3f7fdc' },
    'en-US': { name: 'Visibility', desc: 'Contains the visibility information.', color: '#3f7fdc' },
  },
  weather: {
    'pt-BR': { name: 'Tempo significativo', desc: 'Contém informações sobre o tempo signifcativo aos vôos.', color: '#3732fc' },
    'en-US': { name: 'Significant weather', desc: 'Informs significant weather for flight safety.', color: '#3732fc' },
  },
  recentWeather: {
    'pt-BR': { name: 'Tempo recente', desc: 'Apresenta os dados sobre tempos significativos que ocorreram recentemente.', color: '#4f4be6' },
    'en-US': { name: 'Recent weather', desc: 'Contains data about significant weather that occurred recently.', color: '#4f4be6' },
  },
  clouds: {
    'pt-BR': { name: 'Nuvens', desc: 'Mostra os dados das nuvens atuais sobre o aeródromo.', color: '#7980ac' },
    'en-US': { name: 'Clouds', desc: 'Shows the current clouds above the aerodrome.', color: '#7980ac' },
  },
  atmosphere: {
    'pt-BR': { name: 'Atmosfera', desc: 'Contém os dados da atmosfera no presente momento.', color: '#a93737' },
    'en-US': { name: 'Atmosphere', desc: 'Contains information about the current atmosphere conditions.', color: '#a93737' },
  },
};

const GroupedMetar = ({ metar, lang }: {metar: ReturnType<METARParser['toObject']>, lang: Langs}) => (
  <div className={classes.StyledMetar}>
    {metar.groups.map((mg) => {
      const { color, desc, name } = metarGroupNamesTranslator[mg[0]][lang];
      return (
        <Fragment key={mg[0]}>
          <TooltipHover tooltip={<StyledTooltip title={name}><div style={{ maxWidth: '180px' }}>{desc}</div></StyledTooltip>} placement='bottom'>
            <div>
              <span style={{ backgroundColor: color }} key={mg[0]}>{mg[1].join(' ')}</span>
              &nbsp;
            </div>
          </TooltipHover>
        </Fragment>
      );
    })}
  </div>
);

export const MetarTable = ({ metar, parsedMetar: pMetar, lang = 'pt-BR' }: Props) => {
  const parsedMetar = useMemo(() => {
    if (metar) {
      return new METARParser(metar)
        .parse()
        .toObject();
    }
    if (pMetar) return pMetar;
  }, [metar, pMetar]);

  if (!parsedMetar) return null;

  return (
    <div className={classes.Container}>
      <GroupedMetar metar={parsedMetar} lang={lang}/>
      <div className={classes.MetarGrid}>
        <div>{translator.translate('type')}</div>
        <div>{parsedMetar.metar.type}</div>
        <div>{translator.translate('location')}</div>
        <div>{parsedMetar.metar.station}</div>
        {
          parsedMetar.metar.time
            ? (
              <>
                <div>{translator.translate('time')}</div>
                <div>{formatDate(parsedMetar.metar.time)}</div>
              </>
            )
            : null
        }
        <div>{translator.translate('wind')}</div>
        <div>
          {
          parsedMetar.metar.wind.direction === 'VRB'
            ? 'Variando'
            : `Soprando de ${parsedMetar.metar.wind.direction}° com ${parsedMetar.metar.wind.speed}kt`
          }
          {
            parsedMetar.metar.wind.variation
              ? ` variando entre ${parsedMetar.metar.wind.variation.min}° e ${parsedMetar.metar.wind.variation.max}°`
              : null
          }
        </div>
        {
          parsedMetar.metar.visibility
            ? (
              <>
                <div>{translator.translate('visibility')}</div>
                <div>
                  {
                    parsedMetar.metar.visibility === 9999
                      ? translator.translate('visibilityValueGt10Km')
                      : `${parsedMetar.metar.visibility}m`
                  }
                </div>
              </>
            )
            : null
        }
        {
          parsedMetar.metar.visibilityVariation
            ? (
              <>
                <div>{translator.translate('visibilityVariation')}</div>
                <div>{parsedMetar.metar.visibilityVariation}</div>
              </>
            )
            : null
        }
        {
          parsedMetar.metar.rvr
            ? (
              <>
                <div>RVR</div>
                <div>
                  {
                    parsedMetar.metar.rvr.map((rvr) => (
                      <Fragment key={`${rvr.runway}-${rvr.min}`}>
                        <div>{translator.translate('runway')}</div>
                        <div>{rvr.runway}</div>
                        <div>{translator.translate('min')}</div>
                        <div>{rvr.min}</div>
                        {
                          rvr.max
                            ? (
                              <>
                                <div>{translator.translate('max')}</div>
                                <div>{rvr.max}</div>
                              </>
                            )
                            : null
                        }
                        {
                          rvr.trend
                            ? (
                              <>
                                <div>{translator.translate('trend')}</div>
                                <div>{rvr.trend}</div>
                              </>
                            )
                            : null
                        }
                      </Fragment>
                    ))
                  }
                </div>
              </>
            )
            : null
        }
        {
          parsedMetar.metar.weather && parsedMetar.metar.weather.length
            ? (
              <>
                <div>{translator.translate('sigWeather')}</div>
                {
                  parsedMetar.metar.weather.map((w) => (
                    <div key={`${w.qualifier}-${w.values.map((v) => v.type).join('')}`}>
                      {w.values.map((v) => v.value)}
                    </div>
                  ))
                }
              </>
            )
            : null
        }
        {
          parsedMetar.metar.recentWeather && parsedMetar.metar.recentWeather.length
            ? (
              <>
                <div>{translator.translate('recentWeather')}</div>
                {
                  parsedMetar.metar.recentWeather.map((w) => (
                    <Fragment key={w.map((v) => v.type).join('')}>
                      {w.map((v) => v.type)}
                    </Fragment>
                  ))
                }
                <div>{parsedMetar.metar.type}</div>
              </>
            )
            : null
        }
        {
          parsedMetar.metar.clouds && parsedMetar.metar.clouds.length
            ? (
              <>
                <div>{translator.translate('clouds')}</div>
                <div>
                  {
                    parsedMetar.metar.clouds.map((c, i) => (
                      <Fragment key={`${c.value}-${c.base}`}>
                        {i ? ' ' : null}
                        {c.value} {c.cb ? 'Cumulonimbus' : null} {c.tcu ? 'Towering cumulus' : null} a {c.base}ft
                      </Fragment>
                    ))
                  }
                </div>
              </>
            )
            : null
        }
        {
          parsedMetar.metar.temperature
            ? (
              <>
                <div>{translator.translate('temperature')}</div>
                <div>{parsedMetar.metar.temperature}°C</div>
              </>
            )
            : null
        }
        {
          parsedMetar.metar.dewpoint
            ? (
              <>
                <div>{translator.translate('dewPoint')}</div>
                <div>{parsedMetar.metar.dewpoint}°C</div>
              </>
            )
            : null
        }
        {
          parsedMetar.metar.relativeHumidity
            ? (
              <>
                <div>{translator.translate('humid')}</div>
                <div>{parsedMetar.metar.relativeHumidity}%</div>
              </>
            )
            : null
        }
        {
          parsedMetar.metar.baroPressure
            ? (
              <>
                <div>QNH</div>
                <div>{parsedMetar.metar.baroPressure}hPa</div>
              </>
            )
            : null
        }
      </div>
    </div>
  );
};
