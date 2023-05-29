import dynamic from 'next/dynamic';
import type { TAerodromeData } from '../../../../types/app/aerodrome';
import classes from '../AerodromeInfo.module.css';
import Translator from '../../../../utils/Translate/Translator';
import rotaerLightsTranslator from '../../../../utils/Translate/RotaerLightsTranslator';
import rotaerPCNTranslator from '../../../../utils/Translate/RotaerPCNTranslator';
import rotaerRWYSurfaceTranslator from '../../../../utils/Translate/RotaerRwyTranslator';
import type { METARObject } from '../../../../utils/METAR/METAR';
import { getHeadwindCrossWind } from '../../../../utils/Wind/getHeadwindCrosswind';

const AirplaneArrival = dynamic(() => import('@icons/plane-arrival-solid.svg')) as SVGComponent;
const QuestionIcon = dynamic(() => import('@icons/question-outline.svg')) as SVGComponent;
const WindIcon = dynamic(() => import('@icons/wind-solid.svg')) as SVGComponent;
const TooltipHover = dynamic(() => import('../../../../components/Tooltips/TooltipHover'));
const StyledTooltip = dynamic(() => import('../../../../components/Tooltips/StyledTooltip'));
const CardWithTitle = dynamic(() => import('../../../../components/Card/CardWithTitle'));

const translator = new Translator({
  rwy: { 'pt-BR': 'Pista', 'en-US': 'Runway' },
  length: { 'pt-BR': 'Comprimento', 'en-US': 'Length' },
  width: { 'pt-BR': 'Largura', 'en-US': 'Width' },
  surface: { 'pt-BR': 'Superfície', 'en-US': 'Surface' },
  pcn: { 'pt-BR': 'Pcn', 'en-US': 'Pcn' },
  maxWeight: { 'pt-BR': 'Peso máx.', 'en-US': 'Max. Weight' },
  maxTirePressure: { 'pt-BR': 'Pressão máx. dos pneus', 'en-US': 'Max. tire pressure' },
  PCN: { 'pt-BR': 'PCN', 'en-US': 'PCN' },
  pavement: { 'pt-BR': 'Pavimento', 'en-US': 'Pavement' },
  subGrade: { 'pt-BR': 'Sub-leito', 'en-US': 'Sub grade' },
  tirePressure: { 'pt-BR': 'Pressão máx. dos pneus', 'en-US': 'Max. tire pressure' },
  evalMethod: { 'pt-BR': 'Método de avaliação', 'en-US': 'Eval. method' },
  lights: { 'pt-BR': 'Luzes', 'en-US': 'Lights' },
  light: { 'pt-BR': 'Luz', 'en-US': 'Light' },
  dims: { 'pt-BR': 'Dimensões', 'en-US': 'Dimensions' },
  TORA: { 'pt-BR': 'TORA', 'en-US': 'TORA' },
  TODA: { 'pt-BR': 'TODA', 'en-US': 'TODA' },
  ASDA: { 'pt-BR': 'ASDA', 'en-US': 'ASDA' },
  LDA: { 'pt-BR': 'LDA', 'en-US': 'LDA' },
  'ALT. GEOIDAL': { 'pt-BR': 'Altitude', 'en-US': 'Altitude' },
  COORDENADAS: { 'pt-BR': 'Coordenadas', 'en-US': 'Coordinates' },
  crosswind: { 'pt-BR': 'componente de través', 'en-US': 'crossWind' },
  headwind: { 'pt-BR': 'componente de proa', 'en-US': 'headwind' },
  wind: { 'pt-BR': 'ventos', 'en-US': 'wind' },
});

const getHeadWindArrow = (headwind: number) => {
  if (headwind > 0) return '↑';
  if (headwind < 0) return '↓';
  return '';
};

const getCrossWindArrow = (crosswind: number) => {
  if (crosswind > 0) return '←';
  if (crosswind < 0) return '→';
  return '';
};

const AerodromeRunwaysTab = ({ info, metar }: {info: TAerodromeData, metar?: METARObject | null}) => (
  <>
    {
      info.rwys.reduce((nodes, rwy) => {
        if (!rwy.rwy) return nodes;
        nodes.push(
          <>
            <CardWithTitle key={rwy.rwy} title={rwy.rwy} Icon={<AirplaneArrival width="25"/>} className={classes.Card} titleClassName={classes.CardTitle}>
              <div className={classes.RunwayInfoGridContainer}>
                <div>
                  <div>Info</div>
                  <div className={classes.RunwayInfoGrid}>
                    <div>{translator.capitalize().translate('surface')}</div>
                    <div>{rotaerRWYSurfaceTranslator.translate(rwy.surface)}</div>
                    <div>{translator.capitalize().translate('length')}</div>
                    <div>{rwy.length}m</div>
                    <div>{translator.capitalize().translate('width')}</div>
                    <div>{rwy.width}m</div>
                  </div>
                </div>
                {
                  rwy.pcn
                    ? (
                      <div>
                        <div>PCN</div>
                        <div className={classes.RunwayInfoGrid}>
                          { rwy.pcn.PCN ? (
                            <>
                              <div>PCN</div>
                              <div>{rwy.pcn.PCN}</div>
                            </>
                          ) : null }
                          { rwy.pcn.pavement ? (
                            <>
                              <div>{translator.capitalize().translate('pavement')}</div>
                              <div>{rotaerPCNTranslator.pavement.translate(rwy.pcn.pavement)}</div>
                            </>
                          ) : null }
                          { rwy.pcn.subGrade ? (
                            <>
                              <div>{translator.capitalize().translate('subGrade')}</div>
                              <div>{rotaerPCNTranslator.subGrade.translate(rwy.pcn.subGrade)}</div>
                            </>
                          ) : null }
                          { rwy.pcn.maxWeight ? (
                            <>
                              <div>{translator.capitalize().translate('maxWeight')}</div>
                              <div>{rwy.pcn.maxWeight}</div>
                            </>
                          ) : null }
                          { rwy.pcn.tirePressure ? (
                            <>
                              <div>{translator.capitalize().translate('tirePressure')}</div>
                              <div>{rotaerPCNTranslator.tirePressure.translate(rwy.pcn.tirePressure)}</div>
                            </>
                          ) : null }
                          { rwy.pcn.maxTirePressure ? (
                            <>
                              <div>{translator.capitalize().translate('tirePressure')}</div>
                              <div>{rwy.pcn.maxTirePressure}</div>
                            </>
                          ) : null }
                          { rwy.pcn.evalMethod ? (
                            <>
                              <div>{translator.capitalize().translate('evalMethod')}</div>
                              <div>{rotaerPCNTranslator.evalMethod.translate(rwy.pcn.evalMethod)}</div>
                            </>
                          ) : null }
                        </div>
                      </div>
                    )
                    : null
                }
                {
                  rwy.lights && rwy.lights.length
                    ? (
                      <div>
                        <div>{translator.capitalize().translate('lights')}</div>
                        <div className={classes.RunwayLightsContainer}>
                          {
                            rwy.lights.map((l) => (
                              <div key={l}>
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
                            ))
                          }
                        </div>
                      </div>
                    )
                    : null
                }
                {
                  rwy.dims
                    ? (
                      <div>
                        <div>
                          {translator.capitalize().translate('dims')}
                        </div>
                        <div className={classes.RunwayInfoGrid}>
                          <div>LDA</div>
                          <div>{rwy.dims['LDA(m)']}m</div>
                          <div>TORA</div>
                          <div>{rwy.dims['TORA(m)']}m</div>
                          <div>ASDA</div>
                          <div>{rwy.dims['ASDA(m)']}m</div>
                          <div>TODA</div>
                          <div>{rwy.dims['TODA(m)']}m</div>
                        </div>
                      </div>
                    )
                    : null
                }
              </div>
            </CardWithTitle>
          </>,
        );

        return nodes;
      }, [] as JSX.Element[])
    }
    {
      metar?.metar.wind.speed && metar?.metar.wind.direction && metar?.metar.wind.direction !== 'VRB'
        ? (
          <CardWithTitle title={translator.capitalize().translate('wind')} Icon={<WindIcon width="25"/>} className={classes.Card} titleClassName={classes.CardTitle}>
            <div className={classes.RunwayWindTableContainer}>
              <table className={classes.RunwayWindTable}>
                <thead>
                  <tr>
                    <th>{translator.capitalize().translate('rwy')}</th>
                    <th>{translator.capitalize().translate('headwind')}</th>
                    <th>{translator.capitalize().translate('crosswind')}</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    info.rwys.map((rwy) => {
                      const { headwind, crosswind } = getHeadwindCrossWind(
                        metar.metar.wind.speed,
                        Number(metar.metar.wind.direction),
                        Number(`${rwy.rwy}0`),
                      );
                      return (
                        <tr key={rwy.rwy}>
                          <td>{rwy.rwy}</td>
                          <td>{`${getHeadWindArrow(headwind)} ${Math.abs(headwind)}`}kt</td>
                          <td>{`${getCrossWindArrow(crosswind)} ${Math.abs(crosswind)}`}kt</td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </CardWithTitle>
        )
        : null
    }
  </>
);

export default AerodromeRunwaysTab;
