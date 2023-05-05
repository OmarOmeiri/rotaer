import AirplaneArrival from '@icons/plane-arrival-solid.svg';
import QuestionIcon from '@icons/question-outline.svg';
import { Fragment } from 'react';
import CardWithTitle from '../../../../components/Card/CardWithTitle';
import { TAerodromeData } from '../../../../types/app/aerodrome';
import classes from '../AerodromeInfo.module.css';
import { TooltipClick } from '../../../../components/Tooltips/TooltipClick';
import StyledTooltip from '../../../../components/Tooltips/StyledTooltip';
import Translator from '../../../../utils/Translate/Translator';
import { TooltipHover } from '../../../../components/Tooltips/TooltipHover';
import rotaerLightsTranslator from '../../../../utils/Translate/RotaerLightsTranslator';
import rotaerPCNTranslator from '../../../../utils/Translate/RotaerPCNTranslator';
import rotaerRWYSurfaceTranslator from '../../../../utils/Translate/RotaerRwyTranslator';

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
});

const AerodromeRunwaysTab = ({ info }: {info: TAerodromeData}) => (
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
                    <div>{translator.capitalize().translate('length')}m</div>
                    <div>{rwy.length}</div>
                    <div>{translator.capitalize().translate('width')}m</div>
                    <div>{rwy.width}</div>
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
  </>
);

export default AerodromeRunwaysTab;
