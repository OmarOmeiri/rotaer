import AirplaneArrival from '@icons/plane-arrival-solid.svg';
import QuestionIcon from '@icons/question-outline.svg';
import CardWithTitle from '../../../components/Card/CardWithTitle';
import { TAerodromeData } from '../../../types/app/aerodrome';
import classes from '../AerodromeInfo.module.css';
import { TooltipClick } from '../../../components/Tooltips/TooltipClick';
import StyledTooltip from '../../../components/Tooltips/StyledTooltip';

const AerodromeRunwaysTab = ({ info }: {info: TAerodromeData}) => (
  <>
    {
      info.rwys.reduce((nodes, rwy) => {
        if (!rwy.rwy) return nodes;
        nodes.push(
          <>
            <CardWithTitle key={rwy.rwy} title={rwy.rwy} Icon={<AirplaneArrival width="25"/>} className={classes.Card} titleClassName={classes.CardTitle}>
              <div className={classes.RunwayContainer}>
                <table>
                  <thead>
                    <tr>
                      <th colSpan={2}>Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Superfície</td>
                      <td>{rwy.surface}</td>
                    </tr>
                    <tr>
                      <td>Comprimento</td>
                      <td>{rwy.length}m</td>
                    </tr>
                    <tr>
                      <td>Largura</td>
                      <td>{rwy.width}m</td>
                    </tr>
                  </tbody>
                </table>
                {
                  rwy.pcn
                    ? (
                      <table>
                        <thead>
                          <tr>
                            <th colSpan={2}>PCN</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            rwy.pcn.PCN
                              ? (
                                <tr>
                                  <td>PCN</td>
                                  <td>{rwy.pcn.PCN}</td>
                                </tr>
                              )
                              : null
                          }
                          {
                            rwy.pcn.pavement
                              ? (
                                <tr>
                                  <td>Pavimento</td>
                                  <td>{rwy.pcn.pavement}</td>
                                </tr>
                              )
                              : null
                          }
                          {
                            rwy.pcn.subGrade
                              ? (
                                <tr>
                                  <td>Sub-leito</td>
                                  <td>{rwy.pcn.subGrade}</td>
                                </tr>
                              )
                              : null
                          }
                          {
                            rwy.pcn.maxWeight
                              ? (
                                <tr>
                                  <td>Peso máximo</td>
                                  <td>{rwy.pcn.maxWeight}</td>
                                </tr>
                              )
                              : null
                          }
                          {
                            rwy.pcn.tirePressure
                              ? (
                                <tr>
                                  <td>Pressão dos pneus</td>
                                  <td>{rwy.pcn.tirePressure}</td>
                                </tr>
                              )
                              : null
                          }
                          {
                            rwy.pcn.maxTirePressure
                              ? (
                                <tr>
                                  <td>Pressão máxima dos pneus</td>
                                  <td>{rwy.pcn.maxTirePressure}</td>
                                </tr>
                              )
                              : null
                          }
                          {
                            rwy.pcn.evalMethod
                              ? (
                                <tr>
                                  <td>Método de avaliação</td>
                                  <td>{rwy.pcn.evalMethod}</td>
                                </tr>
                              )
                              : null
                          }
                        </tbody>
                      </table>
                    )
                    : null
                }
                {
                  rwy.lights && rwy.lights.length
                    ? (
                      <table className={classes.TableLights}>
                        <thead>
                          <tr>
                            <th colSpan={2}>Luzes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rwy.lights.map((l) => (
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
                    )
                    : null
                }
                {
                  rwy.dims
                    ? (
                      <table>
                        <thead>
                          <tr>
                            <th colSpan={2}>Dimensões</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>LDA</td>
                            <td>{rwy.dims['LDA(m)']}m</td>
                          </tr>
                          <tr>
                            <td>TORA</td>
                            <td>{rwy.dims['TORA(m)']}m</td>
                          </tr>
                          <tr>
                            <td>ASDA</td>
                            <td>{rwy.dims['ASDA(m)']}m</td>
                          </tr>
                          <tr>
                            <td>TODA</td>
                            <td>{rwy.dims['TODA(m)']}m</td>
                          </tr>
                        </tbody>
                      </table>
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
