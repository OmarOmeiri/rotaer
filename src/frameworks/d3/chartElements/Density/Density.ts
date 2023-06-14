import {
  area,
  BaseType,
  curveCatmullRom,
  CurveFactory,
  Selection,
  Transition,
} from 'd3';
import {
  sortObjArrayByArrayAndKey,
  windowArray,
} from 'lullo-utils/Arrays';
import { trapezoidArea } from 'lullo-utils/Math';
import { D3Classes } from '../../consts/classes';
import { D3Defined } from '../../helpers/d3Defined';
import { D3OnTransitionEnd } from '../../helpers/d3OnTransitionEnd';
import { D3ScaleLinear } from '../../Scales';
import D3ScaleBand from '../../Scales/ScaleBand';
import D3ScaleLog from '../../Scales/ScaleLog';
import D3ScaleTime from '../../Scales/ScaleTime';
import {
  ID3Events,
  ID3ShapeAttrs,
  ID3TooltipDataMulti,
} from '../../types';
import { D3FormatCrosshair } from '../helpers/formatCrosshair';
import D3Mouse from '../Mouse/D3Mouse';
import { D3GetMousePosition } from '../Mouse/helpers/getMousePosition';
import { filterDensityTooltipValues } from './helpers/tooltip';

import type D3Chart from '../../Chart';

export interface ID3DensitySerie {
  id: string,
  name: string;
  active: boolean,
  fill?: string;
  fillOpacity?: string;
  stroke?: string;
  strokeWidth?: string;
  strokeOpacity?: string;
  formatCrosshair?: {
    x?: (val: string | number | Date) => string
    y?: (val: string | number | Date) => string
  }
}

type DensityScales<
D extends Record<string, [number, number][]>,
> =
| D3ScaleLinear<D>
| D3ScaleBand<D>
| D3ScaleLog<D>
| D3ScaleTime<D>

type D3DensityScales<
D extends Record<string, [number, number][]>,
> =
| D3ScaleLinear<D>['scale']
| D3ScaleBand<D>['scale']
| D3ScaleLog<D>['scale']
| D3ScaleTime<D>['scale']

export interface ID3Density<
D extends Record<string, [number, number][]>,
> extends ID3Events<D, D, ID3TooltipDataMulti<D>> {
  chart: D3Chart
  data: D,
  xScale: DensityScales<D>;
  yScale: DensityScales<D>;
  transitionMs?: number
  series: ID3DensitySerie[]
  withDots?: boolean,
  disableZoom?: boolean,
  crosshair?: boolean,
  curve?: CurveFactory
  formatCrosshair?: {
    x?: (val: string | number | Date) => string
    y?: (val: string | number | Date) => string
  }
}

type DotsData = {
  data: [number, number]
  __attrs__: ID3DensitySerie;
}

export type DensityData = {
  data: [number, number][]
  attrs: ID3DensitySerie
}

type PathTransition = Transition<SVGPathElement, DensityData, BaseType, DensityData>;
type PathSelection = Selection<SVGPathElement, DensityData, BaseType, DensityData>
type DotsSelection = Selection<SVGCircleElement, DotsData, BaseType, DensityData>;
type DotsTransition = Transition<SVGCircleElement, DotsData, BaseType, DensityData>

const DEFAULT_AREA_ATTRS: Record<keyof ID3ShapeAttrs<any>, string> = {
  stroke: 'white',
  fill: 'purple',
  fillOpacity: '0.6',
  strokeWidth: '2',
  strokeOpacity: '1',
};

const AUC = (data: [number, number][], approxCoef = data.length / 5) => {
  let area = 0;
  for (const chunk of windowArray(data, Math.max(Math.floor(approxCoef), 2))) {
    const kArea = trapezoidArea(
      Math.floor(approxCoef - 1),
      Number(chunk[0][0]) || 0,
      Number(chunk[1][1]) || 0,
    );
    area += kArea;
  }
  return area;
};

const sortSeriesByLargestAUC = (
  series: ID3DensitySerie[],
  data: Record<string, [number, number][]>,
) => {
  if (series.length === 1) return series;
  const idsByLargestArea = series
    .map((s) => ([s.id, AUC(data[s.id] || [])] as [string, number]))
    .sort((a, b) => b[1] - a[1])
    .map((s) => s[0]);

  return sortObjArrayByArrayAndKey(
    series.filter((s) => s.active),
    idsByLargestArea,
    'id',
  );
};

class Density <
D extends Record<string, [number, number][]>,
> {
  private chart: D3Chart;
  private xScale: DensityScales<D>;
  private yScale: DensityScales<D>;
  private parentGroup!: Selection<SVGGElement, DensityData, SVGGElement, unknown>;
  private paths!: PathSelection;
  private dots?: DotsSelection;
  private data!: DensityData[];
  private series: ID3DensitySerie[];
  private transitionMs: number;
  private tooltipIndex: number | string | Date | null = null;
  private mouseOut: Required<ID3Events<D>>['mouseOut'];
  private mouseOver: Required<ID3Events<D>>['mouseOver'];
  private mouseMove: (d: ID3TooltipDataMulti<D>) => void;
  private mouse: D3Mouse;
  private withDots: boolean;
  private curve: CurveFactory;
  private crosshair: boolean;
  private disableZoom: boolean;
  private formatCrosshair?: {
    x?: (val: string | number | Date) => string
    y?: (val: string | number | Date) => string
  };

  constructor({
    chart,
    data,
    xScale,
    yScale,
    series,
    transitionMs,
    withDots,
    crosshair = false,
    disableZoom = false,
    formatCrosshair,
    curve,
    mouseOut,
    mouseMove,
    mouseOver,
  }: ID3Density<D>) {
    this.chart = chart;
    this.mouse = new D3Mouse(this.chart);
    this.xScale = xScale;
    this.yScale = yScale;
    this.disableZoom = disableZoom;
    this.crosshair = crosshair;
    this.formatCrosshair = formatCrosshair;

    this.series = sortSeriesByLargestAUC(series, data);
    this.curve = curve || curveCatmullRom.alpha(0.5);
    this.transitionMs = transitionMs || 250;
    this.withDots = withDots ?? true;

    this.mouseOut = mouseOut || (() => {});
    this.mouseMove = mouseMove || (() => {});
    this.mouseOver = mouseOver || (() => {});
    this.setData(data);
    this.pattern(data);
  }

  private setData(data: D) {
    this.data = this.series
      .reduce((d, s) => {
        const dt = data[s.id];
        if (!dt) return d;
        return ([
          ...d,
          {
            data: dt,
            attrs: s,
          },
        ]);
      }, [] as typeof this.data);
  }

  private getAttr(
    attrs: DensityData['attrs'],
    key: keyof ID3ShapeAttrs<D>,
  ): ((d: DensityData, index: number) => string) {
    const attr = key === 'fill' && !attrs.fill
      ? attrs.stroke
      : attrs[key];

    if (!attr) {
      return () => DEFAULT_AREA_ATTRS[key] || '';
    }

    return () => attr;
  }

  private getPosition(v: any, scale: D3DensityScales<D>) {
    return Number(scale(v)) + (
      'bandwidth' in scale
        ? (scale.bandwidth() / 2)
        : 0
    );
  }
  private pathGenerator(d: DensityData) {
    return area<DensityData['data'][number]>()
      .defined((l) => D3Defined(l[0]) && D3Defined(l[1]))
      .x((xd) => this.getPosition(xd[0], this.xScale.getScale()))
      .y0(this.chart.dims.innerDims.height)
      .y1((yd) => this.getPosition(yd[1], this.yScale.getScale()))
      .curve(this.curve)(d.data);
  }

  private mouseEventHandlers() {
    if (this.crosshair) {
      this.mouse.appendCrosshair();
    }
    this.mouse.setEvents({
      mouseMove: (e, mouseCallback) => {
        const [x, y] = D3GetMousePosition(e, this.chart);
        const xVal = this.xScale.invert(x);
        const yVal = this.yScale.invert(y);
        const xScaled = this.getPosition(xVal, this.xScale.getScale());
        const yScaled = this.getPosition(yVal, this.yScale.getScale());

        mouseCallback(xScaled, yScaled);
        this.mouse.setCrosshairText(
          this.formatCrosshair?.x ? this.formatCrosshair.x(xVal as any) : D3FormatCrosshair(xVal),
          this.formatCrosshair?.y ? this.formatCrosshair.y(yVal as any) : D3FormatCrosshair(yVal),
        );

        if (this.tooltipIndex === xVal) return;
        if (this.tooltipIndex !== xVal) {
          this.tooltipIndex = xVal;
          const tooltipData = filterDensityTooltipValues(this.data, xVal, DEFAULT_AREA_ATTRS);
          if (tooltipData) this.mouseMove(tooltipData as ID3TooltipDataMulti<D>);
        }
      },
    });

    if (!this.disableZoom) {
      this.chart.initZoom({
        x: this.xScale,
        y: this.yScale,
        onZoom: () => { this.update(0).all(); },
      });
    }
  }

  private pathStart<
    T extends PathSelection
    | PathTransition
  >(paths: T): T {
    return (paths as PathSelection)
      .attr('clip-path', `url(#${this.chart.chartAreaClipId})`)
      .attr('class', D3Classes.chartElements.density.density)
      .attr('stroke', (d, i) => this.getAttr(d.attrs, 'stroke')(d, i))
      .attr('fill', (d, i) => this.getAttr(d.attrs, 'fill')(d, i))
      .attr('d', (d) => this.pathGenerator(d))
      .attr('fill-opacity', 0)
      .attr('stroke-width', 0) as T;
  }

  private pathEnd<
  T extends PathSelection
  | PathTransition
    >(paths: T): T {
    return (paths as PathSelection)
      .attr('stroke-width', (d, i) => this.getAttr(d.attrs, 'strokeWidth')(d, i))
      .attr('fill-opacity', (d, i) => this.getAttr(d.attrs, 'fillOpacity')(d, i))
      .attr('d', (d) => this.pathGenerator(d)) as T;
  }

  private dotsStart<
  T extends DotsSelection
  | DotsTransition
  >(dots: T): T {
    return (dots as DotsSelection)
      .attr('clip-path', `url(#${this.chart.chartAreaClipId})`)
      .attr('r', 0)
      .attr('class', D3Classes.chartElements.density.densityDot)
      .attr('cx', (xd) => this.getPosition(xd.data[0], this.xScale.getScale()))
      .attr('cy', (yd) => this.getPosition(yd.data[1], this.yScale.getScale())) as T;
  }

  private dotsEnd<
  T extends DotsSelection
  | DotsTransition
  >(dots: T): T {
    return (dots as DotsSelection)
      .attr('r', 4)
      .attr('cx', (xd) => this.getPosition(xd.data[0], this.xScale.getScale()))
      .attr('cy', (yd) => this.getPosition(yd.data[1], this.yScale.getScale())) as T;
  }

  private pattern(newData: D) {
    this.mouseEventHandlers();
    this.setData(newData);
    this.groupDataJoin();
    const exiting = this.exit();
    this.enterGroups();
    this.dataJoins();
    const entering = this.enter();

    this.onTransitionEnd(...entering, ...exiting);
  }

  private groupDataJoin() {
    this.parentGroup = this.chart.chart
      .selectAll<SVGGElement, DensityData>(`.${D3Classes.chartElements.density.densities}`)
      .data(this.data, (d) => d.attrs.id);
  }

  private exit() {
    const dotsExit = this.dotsStart(
      this.parentGroup
        .exit()
        .select(`.${D3Classes.chartElements.density.densityDotGroup}`)
        .selectAll<SVGCircleElement, DotsData>('circle')
        .transition()
        .duration(this.transitionMs),
    ).remove();

    const pathsExit = this.pathStart(
      this.parentGroup
        .exit()
        .select(`.${D3Classes.chartElements.density.densityGroup}`)
        .selectAll<SVGPathElement, DensityData>('path')
        .transition()
        .duration(this.transitionMs),
    ).remove();

    this.parentGroup
      .exit()
      .transition()
      .duration(this.transitionMs)
      .remove();
    return [pathsExit, dotsExit];
  }

  private enterGroups() {
    const parentEnter = this.parentGroup
      .enter()
      .append('g')
      .attr('class', D3Classes.chartElements.density.densities);

    parentEnter.append('g')
      .attr('class', D3Classes.chartElements.density.densityGroup);

    parentEnter.append('g')
      .attr('class', D3Classes.chartElements.density.densityDotGroup);

    this.parentGroup = parentEnter.merge(this.parentGroup);
  }

  private dataJoins() {
    const pathsGroup = this.parentGroup
      .select(`.${D3Classes.chartElements.density.densityGroup}`);

    this.paths = pathsGroup.selectAll<SVGPathElement, DensityData>('path')
      .data((d) => [d], (d) => d.attrs.name);

    if (this.withDots) {
      const dotsGroup = this.parentGroup
        .select(`.${D3Classes.chartElements.density.densityDotGroup}`)
        .attr('fill', (d, i) => this.getAttr(d.attrs, 'fill')(d as any, i));

      this.dots = dotsGroup.selectAll<SVGCircleElement, DotsData>('circle')
        .data((dt) => dt.data.map((d) => ({ data: d, __attrs__: dt.attrs })));
    }
  }

  private enter() {
    const pathsInit = this.pathStart(
      this.paths
        .enter()
        .append('path'),
    );

    const pathsEnter = this.pathEnd(
      pathsInit
        .transition()
        .duration(this.transitionMs),
    );

    if (this.dots) {
      const dotsInit = this.dotsStart(
        this.dots
          .enter()
          .append('circle'),
      );

      const dotsEnter = this.dotsEnd(
        dotsInit
          .transition()
          .duration(this.transitionMs),
      );
      return [pathsEnter, dotsEnter];
    }
    return [pathsEnter];
  }

  private onTransitionEnd(
    ...transitions: Transition<any, any, any, any>[]
  ) {
    D3OnTransitionEnd(...transitions)({
      onResolve: () => this.update().new(),
      onReject: () => this.update().new(),
      onEmpty: () => this.update().new(),
    });
  }

  private getUpdateSelection(all?: true) {
    return all
      ? {
        paths: this.chart.chart
          .selectAll<SVGPathElement, DensityData>(`.${D3Classes.chartElements.density.density}`) as PathSelection,
        dots: this.chart.chart
          .selectAll<SVGCircleElement, DotsData>(`.${D3Classes.chartElements.density.densityDot}`) as DotsSelection,
      }
      : {
        paths: this.paths,
        dots: this.dots,
      };
  }

  update(transition?: number) {
    return {
      new: () => {
        const updtSelection = this.getUpdateSelection();
        this.pathEnd(
          updtSelection
            .paths
            .transition()
            .duration(transition ?? this.transitionMs),
        );
        if (updtSelection.dots) {
          this.dotsEnd(
            updtSelection
              .dots
              .transition()
              .duration(transition ?? this.transitionMs),
          );
        }
      },
      all: () => {
        const updtSelection = this.getUpdateSelection(true);
        this.pathEnd(
          updtSelection
            .paths
            .transition()
            .duration(transition ?? this.transitionMs),
        );
        if (updtSelection.dots) {
          this.dotsEnd(
            updtSelection
              .dots
              .transition()
              .duration(transition ?? this.transitionMs),
          );
        }
      },
    };
  }
}

export default Density;

