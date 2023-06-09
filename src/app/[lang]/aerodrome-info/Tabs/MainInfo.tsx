import { Fragment, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { TAerodromeData } from '../../../../types/app/aerodrome';
import classes from '../AerodromeInfo.module.css';
import { gMapLink } from '../../../../utils/Map/GMapsLink';
import { makeAerodromePrelimInfo } from '../../../../utils/Aerodrome/makeAerodromePrelimInfo';
import Translator from '../../../../utils/Translate/Translator';
import langStore from '../../../../store/lang/langStore';
import rotaerLightsTranslator from '../../../../utils/Translate/RotaerLightsTranslator';
import rotaerFuelAndServicesTranslator from '../../../../utils/Translate/RotaerFuelAnsServicesTranslator';
import coordinatesTranslator from '../../../../utils/Translate/CoordinatesTranslator';
import { LengthConverter } from '../../../../utils/converters/length';

const AirportIcon = dynamic(() => import('@icons/airport-pin.svg')) as SVGComponent;
const MapIcon = dynamic(() => import('@icons/map-solid.svg')) as SVGComponent;
const GoToIcon = dynamic(() => import('@icons/go-to.svg')) as SVGComponent;
const QuestionIcon = dynamic(() => import('@icons/question-outline.svg')) as SVGComponent;
const CardWithTitle = dynamic(() => import('../../../../components/Card/CardWithTitle'));
const Link = dynamic(() => import('../../../../components/Navigation/Link/Link'));
const StyledTooltip = dynamic(() => import('../../../../components/Tooltips/StyledTooltip'));
const GMap = dynamic(() => import('../../../../components/Map/GoogleMap/GMap'));
const TooltipHover = dynamic(() => import('../../../../components/Tooltips/TooltipHover'));

const translator = new Translator({
  mainInfo: { 'pt-BR': 'Informações Gerais', 'en-US': 'General Information' },
  charts: { 'pt-BR': 'Cartas', 'en-US': 'Charts' },
  utility: { 'pt-BR': 'Utilidade', 'en-US': 'Utility' },
  location: { 'pt-BR': 'Localidade', 'en-US': 'Location' },
  type: { 'pt-BR': 'Tipo', 'en-US': 'Type' },
  intl: { 'pt-BR': 'Internacional', 'en-US': 'International' },
  coords: { 'pt-BR': 'Coordenadas', 'en-US': 'Coordinates' },
  cityDistance: { 'pt-BR': 'Distância da cidade', 'en-US': 'City distance' },
  time: { 'pt-BR': 'Horário', 'en-US': 'Local time' },
  altitude: { 'pt-BR': 'Altitude', 'en-US': 'Altitude' },
  fuel: { 'pt-BR': 'Combustível', 'en-US': 'Fuel' },
  services: { 'pt-BR': 'Serviços', 'en-US': 'Services' },
  lights: { 'pt-BR': 'Luzes', 'en-US': 'Lights' },
  rffsValue: { 'pt-BR': 'largura máx. da fuselagem', 'en-US': 'Max. fuselage width.' },
  aisCivilian: { 'pt-BR': 'AIS civil', 'en-US': 'civilian AIS' },
});

const MAP_OPTIONS = (coords: {lat: number, lon: number}): google.maps.MapOptions => ({
  disableDefaultUI: true,
  zoom: 12,
  center: { lat: coords.lat, lng: coords.lon },
  mapTypeId: 'terrain',
});

const getAerodromeType = (intl: boolean, lang: Langs) => {
  if (intl && lang === 'pt-BR') return 'Internacional';
  if (intl && lang === 'en-US') return 'International';
  if (!intl && lang === 'pt-BR') return 'Doméstico';
  if (!intl && lang === 'en-US') return 'Domestic';
  return 'Doméstico';
};

const translateBoolean = (bool: boolean, lang: Langs) => {
  if (bool && lang === 'pt-BR') return 'Sim';
  if (bool && lang === 'en-US') return 'Yes';
  if (!bool && lang === 'pt-BR') return 'Não';
  if (!bool && lang === 'en-US') return 'No';
  return '-';
};

const translateCityDistance = (cityDistance: string, lang: Langs) => {
  const [dis, dir] = cityDistance.split('/').reduce((disDir, val) => {
    if (!Number.isNaN(Number(val))) return [Number(val), disDir[1]];
    return [disDir[0], val];
  }, [] as unknown as [number, string]);
  if (!dis || !dir) return cityDistance;
  if (lang === 'en-US') return `${dis}Km to ${coordinatesTranslator.translate(dir)}`;
  return `${dis}Km ao ${coordinatesTranslator.translate(dir)}`;
};

const AerodromeMainInfoTab = ({ info }: {info: TAerodromeData}) => {
  const { lang } = langStore.getState();
  Translator.setLang(lang);
  const map = useMemo(() => (
    info.coords
      ? {
        mapMarker: [makeAerodromePrelimInfo(info as PartialRequired<TAerodromeData, 'coords', true>)],
        mapOptions: MAP_OPTIONS(info.coords.decimal),
      }
      : null
  ), [info]);
  return (
    <>
      <CardWithTitle title={translator.translate('mainInfo')} Icon={<AirportIcon width="20"/>} styled>
        <div className={classes.MainInfoCardContainer}>
          <table className={classes.MainInfoTable}>
            <tbody>
              <tr>
                <td>ICAO</td>
                <td>{info.icao}</td>
              </tr>
              <tr>
                <td>{translator.translate('utility')}</td>
                <td>{info.airportUtil}</td>
              </tr>
              <tr>
                <td>FIR</td>
                <td>{info.fir}</td>
              </tr>
              <tr>
                <td>{translator.translate('type')}</td>
                <td>{getAerodromeType(info.intl, lang)}</td>
              </tr>
              <tr>
                <td>{translator.translate('location')}</td>
                <td>{info.city}/{info.uf}</td>
              </tr>
              {
                info.coords
                  ? (
                    <tr>
                      <td>{translator.translate('coords')}</td>
                      <td>
                        <div style={{ width: 'fit-content' }}>
                          <Link to={gMapLink(info.coords.decimal)} openInNewTab>
                            {info.coords.degMinSec} / {(info.coords.decimal.lat).toFixed(4)}, {(info.coords.decimal.lon).toFixed(4)}
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                  : null
              }
              <tr>
                <td>{translator.translate('cityDistance')}</td>
                <td>
                  {
                info.cityDistance
                  ? translateCityDistance(info.cityDistance, lang)
                  : '-'
                }
                </td>
              </tr>
              <tr>
                <td>{translator.translate('time')}</td>
                <td>GMT+{info.time}</td>
              </tr>
              <tr>
                <td>{translator.translate('altitude')}</td>
                <td>{Math.round(info.elev)}m / {Math.round(LengthConverter.M(info.elev).toFt())}ft</td>
              </tr>
              <tr>
                <td>VFR</td>
                <td>{translateBoolean(true, lang)}</td>
              </tr>
              <tr>
                <td>IFR</td>
                <td>{translateBoolean(info.operType.ifr, lang)}</td>
              </tr>
              <tr>
                <td>{translator.translate('fuel')}</td>
                <td>
                  {
                  info.CMB
                    ? info.CMB.map((c, index) => (
                      <Fragment key={c}>{index ? <br/> : null}{rotaerFuelAndServicesTranslator.fuel.translate(c)}</Fragment>
                    ))
                    : '-'
                }
                </td>
              </tr>
              <tr>
                <td>{translator.translate('services')}</td>
                <td>
                  {
                  info.SER
                    ? info.SER.map((s, index) => (<Fragment key={s}>{index ? <br/> : null}{rotaerFuelAndServicesTranslator.serv.translate(s)}</Fragment>))
                    : '-'
                }
                </td>
              </tr>
              <tr>
                <td>RFFS</td>
                <td>
                  {
                  info.RFFS?.maxWidth
                    ? `${translator.translate('rffsValue')} ${info.RFFS.maxWidth}m`
                    : '-'
                }
                </td>
              </tr>
              <tr>
                <td>{translator.translate('lights')}</td>
                <td>
                  {
                    info.lights && info.lights.length
                      ? info.lights.map((l, index) => (
                        <Fragment key={l}>
                          {index ? <br/> : null}
                          <div>
                            <TooltipHover tooltip={<StyledTooltip title={l}><div style={{ maxWidth: '180px' }}>{rotaerLightsTranslator.translate(l)}</div></StyledTooltip>} placement='right-start'>
                              <div style={{
                                width: 'fit-content',
                                display: 'flex',
                                gap: '0.3rem',
                                alignItems: 'center',
                                cursor: 'pointer',
                              }}>
                                {l}
                                <QuestionIcon width='12'/>
                              </div>
                            </TooltipHover>
                          </div>
                        </Fragment>
                      ))
                      : '-'
                  }
                </td>
              </tr>
              {
                info?.ais?.ais
                  ? (
                    <tr>
                      <td>AIS</td>
                      <td>
                        {info.ais.ais}
                      </td>
                    </tr>
                  )
                  : null
              }
              {
                info?.ais?.aisCivil
                  ? (
                    <tr>
                      <td>{translator.capitalize().translate('aisCivilian')}</td>
                      <td>
                        {info.ais.aisCivil}
                      </td>
                    </tr>
                  )
                  : null
              }
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
            <GMap markers={map?.mapMarker} mapOptions={map?.mapOptions}/>
          </div>
        </div>
      </CardWithTitle>
      {
        info.charts && Object.keys(info.charts).length
          ? (
            <CardWithTitle title={translator.translate('charts')} Icon={<MapIcon width="25"/>} styled>
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
