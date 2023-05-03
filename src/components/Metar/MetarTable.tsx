import { Fragment, useMemo } from 'react';
import METARParser, { METARGroupNames } from '../../utils/METAR/METAR';
import { formatDate } from '../../utils/format/date';
import classes from './MetarTable.module.css';
import { TooltipClick } from '../Tooltips/TooltipClick';
import StyledTooltip from '../Tooltips/StyledTooltip';

type Props = {
  metar: string,
  parsedMetar?: undefined
} | {
  metar?: undefined,
  parsedMetar?: ReturnType<METARParser['toObject']>
}

const metarGroupNamesTranslator: {[G in METARGroupNames]: {name: string, desc: string, color: string}} = {
  header: { name: 'Cabeçalho', desc: 'Contém o tipo da observação e o identificador do aeródromo.', color: '#42ac5f' },
  time: { name: 'Horário', desc: 'Informações do horário da observação.', color: '#944fa5' },
  auto: { name: 'Automático', desc: 'Informa se a observação foi realizada de forma automaitizada.', color: '#b75328' },
  wind: { name: 'Ventos', desc: 'Contém as informações de vento da observação.', color: '#3398b0' },
  visibility: { name: 'Visibilidade', desc: 'Apresenta as características dos ventos no local.', color: '#3f7fdc' },
  weather: { name: 'Tempo significativo', desc: 'Contém informações sobre o tempo signifcativo aos vôos.', color: '#3732fc' },
  recentWeather: { name: 'Tempo recente', desc: 'Apresenta os dados sobre tempos significativos que ocorreram recentemente.', color: '#4f4be6' },
  clouds: { name: 'Nuvens', desc: 'Mostra os dados das nuvens atuais sobre o aeródromo.', color: '#7980ac' },
  atmosphere: { name: 'Atmosfera', desc: 'Contém os dados da atmosfera no presente momento.', color: '#a93737' },
};

const GroupedMetar = ({ metar }: {metar: ReturnType<METARParser['toObject']>}) => (
  <div className={classes.StyledMetar}>
    {metar.groups.map((mg) => {
      const { color, desc, name } = metarGroupNamesTranslator[mg[0]];
      return (
        <Fragment key={mg[0]}>
          <TooltipClick tooltip={<StyledTooltip title={name}><div style={{ maxWidth: '180px' }}>{desc}</div></StyledTooltip>} placement='bottom-end'>
            <div>
              <span style={{ backgroundColor: color }} title={name} key={mg[0]}>{mg[1].join(' ')}</span>
              &nbsp;
            </div>
          </TooltipClick>
        </Fragment>
      );
    })}
  </div>
);

export const MetarTable = ({ metar, parsedMetar: pMetar }: Props) => {
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
      <GroupedMetar metar={parsedMetar}/>
      <div className={classes.MetarGrid}>
        <div>Tipo</div>
        <div>{parsedMetar.metar.type}</div>
        <div>Local</div>
        <div>{parsedMetar.metar.station}</div>
        {
          parsedMetar.metar.time
            ? (
              <>
                <div>Horário</div>
                <div>{formatDate(parsedMetar.metar.time)}</div>
              </>
            )
            : null
        }
        <div>Vento</div>
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
                <div>Visibilidade Vert.</div>
                <div>
                  {
                    parsedMetar.metar.visibility === 9999
                      ? 'Mais de 10km'
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
                <div>Variação de visibilidade</div>
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
                        <div>Pista</div>
                        <div>{rvr.runway}</div>
                        <div>Mín.</div>
                        <div>{rvr.min}</div>
                        {
                          rvr.max
                            ? (
                              <>
                                <div>Máx.</div>
                                <div>{rvr.max}</div>
                              </>
                            )
                            : null
                        }
                        {
                          rvr.trend
                            ? (
                              <>
                                <div>Tendência</div>
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
                <div>Tempo significativo</div>
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
                <div>Tempo recente</div>
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
                <div>Nuvens</div>
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
                <div>Temperatura</div>
                <div>{parsedMetar.metar.temperature}°C</div>
              </>
            )
            : null
        }
        {
          parsedMetar.metar.dewpoint
            ? (
              <>
                <div>Ponto de orvalho</div>
                <div>{parsedMetar.metar.dewpoint}°C</div>
              </>
            )
            : null
        }
        {
          parsedMetar.metar.relativeHumidity
            ? (
              <>
                <div>Umidade relativa</div>
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
