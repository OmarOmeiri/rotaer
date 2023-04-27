import AirportIcon from '@icons/airport-pin.svg';
import MapIcon from '@icons/map-solid.svg';
import GoToIcon from '@icons/go-to.svg';
import LightIcon from '@icons/light-bulb.svg';
import QuestionIcon from '@icons/question-outline.svg';
import { useMemo } from 'react';
import CardWithTitle from '../../../components/Card/CardWithTitle';
import { TAerodromeData } from '../../../types/app/aerodrome';
import classes from '../AerodromeInfo.module.css';
import Link from '../../../components/Navigation/Link/Link';
import { gMapLink } from '../../../utils/Map/GMapsLink';
import { TooltipClick } from '../../../components/Tooltips/TooltipClick';
import StyledTooltip from '../../../components/Tooltips/StyledTooltip';
import GMap from '../../../components/Map/GMap';
import { makeAerodromePrelimInfo } from '../../../utils/Aerodrome/makeAerodromePrelimInfo';

const MAP_OPTIONS = (coords: {lat: number, lon: number}): google.maps.MapOptions => ({
  disableDefaultUI: true,
  zoom: 10,
  center: { lat: coords.lat, lng: coords.lon },
  mapTypeId: 'terrain',
});

const AerodromeMainInfoTab = ({ info }: {info: TAerodromeData}) => {
  const { mapMarker, mapOptions } = useMemo(() => ({
    mapMarker: [makeAerodromePrelimInfo(info)],
    mapOptions: MAP_OPTIONS(info.coords.decimal),
  }), [info]);
  return (
    <>
      <CardWithTitle title='Informações Gerais' Icon={<AirportIcon width="20"/>} className={classes.Card} titleClassName={classes.CardTitle}>
        <div className={classes.MainInfoCardContainer}>
          <table className={classes.MainInfoTable}>
            <tbody>
              <tr>
                <td>ICAO</td>
                <td>{info.icao}</td>
              </tr>
              <tr>
                <td>Utilidade</td>
                <td>{info.airportUtil}</td>
              </tr>
              <tr>
                <td>FIR</td>
                <td>{info.fir}</td>
              </tr>
              <tr>
                <td>Tipo</td>
                <td>{info.intl ? 'Internacional' : 'Doméstico'}</td>
              </tr>
              <tr>
                <td>Localidade</td>
                <td>{info.city}/{info.uf}</td>
              </tr>
              <tr>
                <td>Coordenadas</td>
                <td>
                  <div style={{ width: 'fit-content' }}>
                    <Link to={gMapLink(info.coords.decimal)} openInNewTab>
                      {info.coords.degMinSec} / {(info.coords.decimal.lat).toFixed(4)}, {(info.coords.decimal.lon).toFixed(4)}
                    </Link>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Distância da cidade</td>
                <td>
                  {
                info.cityDistance
                  ? info.cityDistance
                  : '-'
                }
                </td>
              </tr>
              <tr>
                <td>Horário</td>
                <td>GMT+{info.time}</td>
              </tr>
              <tr>
                <td>Elevação</td>
                <td>{info.elev}m</td>
              </tr>
              <tr>
                <td>VFR</td>
                <td>{info.operType.vfr ? 'Sim' : 'Não'}</td>
              </tr>
              <tr>
                <td>IFR</td>
                <td>{info.operType.ifr ? 'Sim' : 'Não'}</td>
              </tr>
              <tr>
                <td>Combustível</td>
                <td>
                  {
                  info.CMB
                    ? info.CMB.map((c, index) => (index ? <><br/>{c}</> : <>{c}</>))
                    : '-'
                }
                </td>
              </tr>
              <tr>
                <td>Serviços</td>
                <td>
                  {
                  info.SER
                    ? info.SER.map((s, index) => (index ? <><br/>{s}</> : <>{s}</>))
                    : '-'
                }
                </td>
              </tr>
              <tr>
                <td>RFFS</td>
                <td>
                  {
                  info.RFFS?.maxWidth
                    ? `largura máx. ${info.RFFS?.maxWidth}m`
                    : '-'
                }
                </td>
              </tr>
              <tr>
                <td>
                  <div style={{ width: 'fit-content' }}>
                    <Link to={info.link} style={{ width: 'fit-content' }} openInNewTab>
                      <span style={{ marginRight: '3px' }}>AISWEB</span>
                      <GoToIcon width='15'/>
                    </Link>
                  </div>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <div className={classes.MapContainer}>
            <GMap markers={mapMarker} mapOptions={mapOptions}/>
          </div>
        </div>
      </CardWithTitle>
      {
      info.lights && info.lights.length
        ? (
          <CardWithTitle title='Luzes' Icon={<LightIcon width="25"/>} className={classes.Card} titleClassName={classes.CardTitle}>
            <table className={classes.TableLights}>
              <tbody>
                {info.lights.map((l) => (
                  <tr key={l.light} title={l.meaning}>
                    <>
                      <td width="50%" style={{ textAlign: 'end' }}>
                        <TooltipClick tooltip={<StyledTooltip title={l.light}><div style={{ maxWidth: '180px' }}>{l.meaning}</div></StyledTooltip>} placement='right-start'>
                          <div>{l.light}</div>
                        </TooltipClick>
                      </td>
                      <td style={{ 'textAlign': 'start' }}>
                        <TooltipClick tooltip={<StyledTooltip title={l.light}><div style={{ maxWidth: '180px' }}>{l.meaning}</div></StyledTooltip>} placement='right-start'>
                          <QuestionIcon width='12'/>
                        </TooltipClick>
                      </td>
                    </>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardWithTitle>
        )
        : null
    }
      {
      info.charts && Object.keys(info.charts).length
        ? (
          <CardWithTitle title='Cartas' Icon={<MapIcon width="25"/>} className={classes.Card} titleClassName={classes.CardTitle}>
            <div className={classes.ChartsContainer}>
              {
                Object.entries(info.charts)
                  .map(([type, charts]) => (
                    <div key={`${type}-chart`}>
                      <div>{type}</div>
                      {
                        charts.map((c) => (
                          <div key={c.name} className={classes.ChartsLink}>
                            <Link to={c.link} openInNewTab>{c.name}</Link>
                          </div>

                        ))
                      }
                    </div>
                  ))
              }
            </div>
          </CardWithTitle>
        )
        : null
    }

    </>
  );
};

export default AerodromeMainInfoTab;
