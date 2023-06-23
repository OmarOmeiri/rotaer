/* eslint-disable no-nested-ternary */
import { useCallback, useMemo, useState } from 'react';
import { curveLinear } from 'd3';
import { round } from 'lullo-utils/Math';
import CardWithTitle from '../../../../../../components/Card/CardWithTitle';
import ReactD3Chart from '../../../../../../components/d3/Chart/Chart';
import ReactD3Line from '../../../../../../components/d3/components/Line';
import { Route, TLeg } from '../../../../../../utils/Route/Route';
import Translator from '../../../../../../utils/Translate/Translator';
import ReactD3ScaleLinear from '../../../../../../components/d3/Scales/ScaleLinear';
import classes from './FlightPlanVerticalProfile.module.css';
import { ID3AreaLineSerie } from '../../../../../../frameworks/d3/chartElements/AreaLine/AreaLine';
import { RouteVProfile } from '../../../../../../utils/Route/VerticalProfile';
import { TimeConverter } from '../../../../../../utils/converters/time';
import ReactD3Circle from '../../../../../../components/d3/components/Circle';
import { ID3TooltipDataSingle } from '../../../../../../frameworks/d3/types';
import ReactD3TooltipSingle from '../../../../../../components/d3/components/Tooltip/TooltipSingle';
import ReactD3ChartOverlay, { ReactD3ChartOverlayElement } from '../../../../../../components/d3/components/ChartOverlay';
import { RouteErrorBanner } from './ErrorBanner';
import errorHelper from '../../../../../../utils/Errors/errorHelper';

const translator = new Translator({
  title: { 'pt-BR': 'Perfil Vertical', 'en-US': 'Vertical Profile' },
  labelTime: { 'pt-BR': 'Tempo', 'en-US': 'Time' },
  labelDistance: { 'pt-BR': 'Distância (nm)', 'en-US': 'Distance (nm)' },
  vProfileError: { 'pt-BR': 'Impossível calcular o perfil vertical.', 'en-US': 'Could not calculate the vertical profile.' },
});
const serie: ID3AreaLineSerie<RouteVProfile>[] = [
  {
    name: 'Vertical Profile',
    id: 'v-prof',
    active: true,
    xKey: 'distance',
    yKey: 'altitude',
    stroke: 'rgb(241, 20, 133)',
    fill: 'rgb(241, 20, 133)',
  },
];
const chartMargins = {
  top: 0,
  left: 70,
  right: 40,
  bottom: 50,
};

// const xTickFormatter = (value: any) => TimeConverter.MIN(value).tohhmmss();
const crosshairFormatter = {
  x: (value: any) => {
    console.log('value: ', value);
    return `${round(value, 2)}nm`;
  },
  y: (value: any) => `${round(value, 2)}ft`,
};

const getLabelPositionX = ({ width }: {width: number}) => width / 2;

const FlightPlanVerticalProfile = ({
  route,
}:{route: Route | null}) => {
  const [tooltip, setTooltip] = useState<ID3TooltipDataSingle<RouteVProfile> | null>(null);
  const [data, errors] = useMemo(() => {
    if (!route) return [[], null];
    const vProf = route.getVerticalProfile();
    if (vProf) {
      try {
        const points = vProf.getPoints();
        const { errors } = vProf;
        return [points, errors];
      } catch (error) {
        errorHelper(error);
        return [[], null];
      }
    }
    return [[], null];
  }, [route]);

  const onMouseOver = useCallback((d: ID3TooltipDataSingle<RouteVProfile>) => {
    setTooltip(d);
  }, []);

  const onMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <CardWithTitle
      title={translator.translate('title')}
      className={classes.VProfileWrapper}
      styled
    >
      {
        data.length && errors === null
          ? (
            <div className={classes.VProfileChartWrapper}>
              <ReactD3Chart margin={chartMargins}>
                <ReactD3ScaleLinear
                  id='x-scale'
                  data={data}
                  dataKey='distance'
                  label={translator.translate('labelDistance')}
                  domain={['dataMin-5%', 'dataMax+5%']}
                  type='bottom'
                />
                <ReactD3ScaleLinear
                  id='y-scale'
                  data={data}
                  dataKey='altitude'
                  type='left'
                  label='Altitude'
                  domain={['dataMin-5%', 'dataMax+5%']}
                />
                <ReactD3Line
                  curve={curveLinear}
                  data={data}
                  withDots={false}
                  series={serie}
                  crosshair={true}
                  formatCrosshair={crosshairFormatter}
                  disableZoom
                />
                <ReactD3Circle
                  data={data}
                  xKey='distance'
                  yKey='altitude'
                  radius="5"
                  fill='rgb(241, 20, 133)'
                  mouseOver={onMouseOver}
                  mouseOut={onMouseLeave}
                  disableZoom
                />
                <ReactD3TooltipSingle
                  data={tooltip}
                >
                  {
                  tooltip
                    ? (
                      <div className={classes.Tooltip}>
                        <div className={classes.TooltipName}>
                          {tooltip.data.name}
                        </div>
                        <table>
                          <tbody>
                            <tr>
                              <td>Altitude: </td>
                              <td>{round(tooltip.data.altitude, 2)}ft</td>
                            </tr>
                            <tr>
                              <td>{translator.translate('labelDistance')}: </td>
                              <td>{round(tooltip.data.distance, 2)}nm</td>
                            </tr>
                            <tr>
                              <td>{translator.translate('labelTime')}: </td>
                              <td>{TimeConverter.H(tooltip.data.time).tohhmmss()}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )
                    : null
                }
                </ReactD3TooltipSingle>
                <ReactD3ChartOverlay>
                  {
                    data
                      .filter((d) => d.showName !== false)
                      .map((d, i) => (
                        <ReactD3ChartOverlayElement
                        key={`${d.name}-${i}`}
                        dx={getLabelPositionX}
                        dy={10}
                        position={{ x: d.distance, y: d.altitude }}
                        xScaleId='x-scale'
                        yScaleId='y-scale'
                      >
                          <span className={classes.ProfilePointLabel}>{d.name}</span>
                        </ReactD3ChartOverlayElement>
                      ))
                  }
                </ReactD3ChartOverlay>
              </ReactD3Chart>
            </div>
          )
          : (
            errors?.length
              ? (
                <RouteErrorBanner>
                  {errors}
                </RouteErrorBanner>
              )
              : (
                <RouteErrorBanner>
                  {translator.translate('vProfileError')}
                </RouteErrorBanner>
              )
          )
      }
    </CardWithTitle>
  );
};

export default FlightPlanVerticalProfile;
