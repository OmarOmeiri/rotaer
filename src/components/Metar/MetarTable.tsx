import { Fragment, useMemo } from 'react';
import METARParser, { METARObject } from '../../utils/METAR/METAR';
import { formatDate } from '../../utils/format/date';
import classes from './MetarTable.module.css';
import StyledTooltip from '../Tooltips/StyledTooltip';
import TooltipHover from '../Tooltips/TooltipHover';
import metarTranslator from '../../utils/Translate/Metar';
import { TMetarRecentWeather, TMetarWeather } from '../../utils/METAR/Weather';
import { TMetarClouds } from '../../utils/METAR/Clouds';

type Props = {
  metar: string,
  parsedMetar?: undefined
  lang?: Langs,
} | {
  metar?: undefined,
  parsedMetar?: ReturnType<METARParser['toObject']>
  lang?: Langs,
}

const GroupedMetar = ({ metar, lang }: {metar: ReturnType<METARParser['toObject']>, lang: Langs}) => (
  <div className={classes.StyledMetar}>
    {metar.groups.map((mg) => {
      const { color, desc, name } = metarTranslator.groupNames[mg[0]][lang];
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

const translateRecentWeather = (recentWeather: TMetarRecentWeather[], lang: Langs) => {
  if (lang === 'en-US') {
    return `${recentWeather.map((v) => metarTranslator.weather?.[v.type as keyof typeof metarTranslator.weather]?.translate(v.value) || v.value).join(' with ')}`;
  }
  return `${recentWeather.map((v) => metarTranslator.weather?.[v.type as keyof typeof metarTranslator.weather]?.translate(v.value) || v.value).join(' com ')}`;
};

const translateWeather = (weather: TMetarWeather, lang: Langs) => {
  if (lang === 'en-US') {
    return `${metarTranslator.weather.qualifier.translate(weather.qualifier)} ${weather.values.map((v) => metarTranslator.weather?.[v.type as keyof typeof metarTranslator.weather]?.translate(v.value) || v.value).join(' with ')}`;
  }
  return `${weather.values.map((v) => metarTranslator.weather?.[v.type as keyof typeof metarTranslator.weather]?.translate(v.value) || v.value).join(' com ')} ${metarTranslator.weather.qualifier.translate(weather.qualifier)}`;
};

const translateClouds = (clouds: TMetarClouds[], lang: Langs) => (
  clouds.map((c, i) => (
    <>
      {i ? <br/> : null}
      {
        `${
          metarTranslator.clouds.capitalize().translate(c.value)
        }${
          c.cb ? ' Cumulonimbus' : ''
        }${
          c.tcu ? ' Towering cumulus' : ''
        } ${lang === 'en-US' ? 'at' : 'a'} ${c.base}ft`
      }
    </>
  ))
);

const translateWind = (wind: METARObject['metar']['wind'], lang: Langs) => {
  if (lang === 'en-US') {
    return (wind.direction === 'VRB'
      ? 'Varying'
      : `Blowing from ${wind.direction}° with ${wind.speed}kt`)
      + (
        wind.variation
          ? ` varying between ${wind.variation.min}° e ${wind.variation.max}°`
          : ''
      );
  }

  return (wind.direction === 'VRB'
    ? 'Variando'
    : `Soprando de ${wind.direction}° com ${wind.speed}kt`)
      + (
        wind.variation
          ? ` variando entre ${wind.variation.min}° e ${wind.variation.max}°`
          : ''
      );
};

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
        <div>{metarTranslator.main.translate('type')}</div>
        <div>{parsedMetar.metar.type}</div>
        <div>{metarTranslator.main.translate('location')}</div>
        <div>{parsedMetar.metar.station}</div>
        {
          parsedMetar.metar.time
            ? (
              <>
                <div>{metarTranslator.main.translate('time')}</div>
                <div>{formatDate(parsedMetar.metar.time, lang)}</div>
              </>
            )
            : null
        }
        <div>{metarTranslator.main.translate('wind')}</div>
        <div>
          {translateWind(parsedMetar.metar.wind, lang)}
        </div>
        {
          parsedMetar.metar.visibility
            ? (
              <>
                <div>{metarTranslator.main.translate('visibility')}</div>
                <div>
                  {
                    parsedMetar.metar.visibility === 9999
                      ? metarTranslator.main.translate('visibilityValueGt10Km')
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
                <div>{metarTranslator.main.translate('visibilityVariation')}</div>
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
                        <div>{metarTranslator.main.translate('runway')}</div>
                        <div>{rvr.runway}</div>
                        <div>{metarTranslator.main.translate('min')}</div>
                        <div>{rvr.min}</div>
                        {
                          rvr.max
                            ? (
                              <>
                                <div>{metarTranslator.main.translate('max')}</div>
                                <div>{rvr.max}</div>
                              </>
                            )
                            : null
                        }
                        {
                          rvr.trend
                            ? (
                              <>
                                <div>{metarTranslator.main.translate('trend')}</div>
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
                <div>{metarTranslator.main.translate('sigWeather')}</div>
                {
                  parsedMetar.metar.weather.map((w) => (
                    <div key={`${w.qualifier}-${w.values.map((v) => v.type).join('')}`}>
                      {translateWeather(w, lang)}
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
                <div>{metarTranslator.main.translate('recentWeather')}</div>
                <div>
                  {translateRecentWeather(parsedMetar.metar.recentWeather, lang)}
                </div>
              </>
            )
            : null
        }
        {
          parsedMetar.metar.clouds && parsedMetar.metar.clouds.length
            ? (
              <>
                <div>{metarTranslator.main.translate('clouds')}</div>
                <div>
                  {
                    translateClouds(parsedMetar.metar.clouds, lang)
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
                <div>{metarTranslator.main.translate('temperature')}</div>
                <div>{parsedMetar.metar.temperature}°C</div>
              </>
            )
            : null
        }
        {
          parsedMetar.metar.dewpoint
            ? (
              <>
                <div>{metarTranslator.main.translate('dewPoint')}</div>
                <div>{parsedMetar.metar.dewpoint}°C</div>
              </>
            )
            : null
        }
        {
          parsedMetar.metar.relativeHumidity
            ? (
              <>
                <div>{metarTranslator.main.translate('humid')}</div>
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
