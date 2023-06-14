import {
  area,
  curveCatmullRom,
  scaleLinear,
  ScaleLinear,
  Selection,
  Transition,
} from 'd3';
import D3Axis from '../../Axes/Axis';
import { D3Classes } from '../../consts/classes';
import { d3AppendIfNotExists } from '../../helpers/d3Exists';
import { D3OnTransitionEnd } from '../../helpers/d3OnTransitionEnd';

import { D3ScaleLinear } from '../../Scales';
import D3ScaleBand from '../../Scales/ScaleBand';
import {
  D3NumberKey,
  ID3ShapeAttrs,
} from '../../types';
import { D3FormatCrosshair } from '../helpers/formatCrosshair';
import D3Mouse from '../Mouse/D3Mouse';
import { D3GetMousePosition } from '../Mouse/helpers/getMousePosition';

import type D3Chart from '../../Chart';

export interface ID3BinnedViolinSerie<
D extends Record<string, [number, number][]>
> {
  id: string,
  yKey: keyof D,
  name: string;
  active?: boolean,
  fill?: string | ((d: BinnedData<D>[number], index: number) => string);
  fillOpacity?: string | ((d: BinnedData<D>[number], index: number) => string);
  stroke?: string | ((d: BinnedData<D>[number], index: number) => string);
  strokeWidth?: string | ((d: BinnedData<D>[number], index: number) => string);
  strokeOpacity?: string | ((d: BinnedData<D>[number], index: number) => string);
  formatCrosshair?: {
    x?: (val: string | number | Date) => string
    y?: (val: string | number | Date) => string
  }
}

type BinnedData<D extends Record<string, [number, number][]>> = {
  attrs: ID3BinnedViolinSerie<D>
  bins: [number, number][];
}[]

const DEFAULT_VIOLIN_ATTRS: Partial<Record<keyof ID3ShapeAttrs<any>, string>> = {
  fill: 'purple',
  fillOpacity: '1',
  strokeWidth: '1',
  strokeOpacity: '1',
};

export interface ID3BinnedViolin<
D extends Record<string, [number, number][]>,
> {
  chart: D3Chart,
  data: D,
  xScale: D3ScaleBand<D>,
  yScale: D3ScaleLinear<D>,
  series: ID3BinnedViolinSerie<D>[],
  transitionMs?: number,
  disableZoom?: boolean,
  crosshair?: boolean
  formatCrosshair?: {
    x?: (val: string | number | Date) => string
    y?: (val: string | number | Date) => string
  }
}

type ViolinSelection<D extends Record<string, any>> = Selection<SVGPathElement, BinnedData<D>[number], SVGGElement, BinnedData<D>[number]>;
type ViolinTransition<D extends Record<string, any>> = Transition<SVGPathElement, BinnedData<D>[number], SVGGElement, BinnedData<D>[number]>;

class BinnedViolin<
D extends Record<string, [number, number][]>,
> {
  private chart: D3Chart;
  private xScale: D3ScaleBand<D>;
  private xScaleNum!: ScaleLinear<number, number, never>;
  private yScale: D3ScaleLinear<D>;
  private group!: Selection<SVGGElement, BinnedData<D>[number], SVGGElement, unknown>;
  private parentGroup!: Selection<SVGGElement, unknown, null, undefined>;
  private violin!: Selection<SVGPathElement, BinnedData<D>[number], SVGGElement, BinnedData<D>[number]>;
  private data: D;
  private bins!: BinnedData<D>;
  private series: ID3BinnedViolinSerie<D>[];
  private mouse: D3Mouse;
  private transitionMs: number;
  private disableZoom: boolean;
  private crosshair: boolean;
  private binsMaxX!: number;
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
    transitionMs = 150,
    disableZoom = false,
    crosshair = true,
    formatCrosshair,
  }: ID3BinnedViolin<D>) {
    this.chart = chart;
    this.series = series;
    this.xScale = xScale;
    this.yScale = yScale;

    this.data = data;
    this.transitionMs = transitionMs;
    this.disableZoom = disableZoom;
    this.crosshair = crosshair;
    this.mouse = new D3Mouse(this.chart);
    this.formatCrosshair = formatCrosshair;

    this.parentGroup = d3AppendIfNotExists(
      this.chart.chart
        .select<SVGGElement>(`.${D3Classes.chartElements.violin.allViolinsGroup}`),
      () => this.chart.chart
        .append('g')
        .attr('class', D3Classes.chartElements.violin.allViolinsGroup)
        .attr('clip-path', `url(#${this.chart.chartAreaClipId})`),
    );

    this.pattern(data);
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
        const xScaled = Number(this.xScale.getScale()(xVal)) + (this.xScale.getScale().bandwidth() / 2);
        const yScaled = Number(this.yScale.getScale()(yVal));
        mouseCallback(xScaled, yScaled);

        this.mouse.setCrosshairText(
          this.formatCrosshair?.x ? this.formatCrosshair.x(xVal as any) : D3FormatCrosshair(xVal),
          this.formatCrosshair?.y ? this.formatCrosshair.y(yVal as any) : D3FormatCrosshair(yVal),
        );
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

  private setData(data: D) {
    this.data = data;
    this.binsMaxX = -Infinity;
    this.bins = this.series.reduce((d, s) => {
      const dt = data[s.id];
      if (!dt) return d;
      const maxX = Math.max(this.binsMaxX, ...dt.map((v) => v[1]));
      this.binsMaxX = Math.max(this.binsMaxX, maxX);
      return ([
        ...d,
        {
          bins: dt,
          attrs: s,
        },
      ]);
    }, [] as BinnedData<D>);
    this.xScaleNum = scaleLinear()
      .domain([-this.binsMaxX, this.binsMaxX])
      .range([0, this.xScale.getScale().bandwidth()]);
  }

  private getAttr(
    attrs: BinnedData<D>[number]['attrs'],
    key: keyof ID3ShapeAttrs<D>,
  ): ((d: BinnedData<D>[number], index: number) => string) {
    const attr = key === 'fill' && !attrs.fill
      ? attrs.stroke
      : attrs[key];
    if (!attr) {
      return () => DEFAULT_VIOLIN_ATTRS[key] || '';
    }

    return typeof attr === 'function'
      ? (d: BinnedData<D>[number], i: number) => attr(d, i)
      : () => attr;
  }

  private pathsStart<
  T extends ViolinSelection<D>
  | ViolinTransition<D>
  >(violins: T): T {
    return (violins as ViolinSelection<D>)
      .attr('class', D3Classes.chartElements.violin.violin)
      .attr('fill-opacity', 0)
      .attr('d', (d) => (
        area()
          .x0(() => (this.xScale.getScale().bandwidth() / 2))
          .x1(() => (this.xScale.getScale().bandwidth() / 2))
          .y((d) => this.yScale.getScale()(d[0]))
          .curve(curveCatmullRom)(d.bins)
      )) as T;
  }

  private pathsEnd<
  T extends ViolinSelection<D>
  | ViolinTransition<D>
  >(violins: T): T {
    return (violins as ViolinSelection<D>)
      .attr('class', D3Classes.chartElements.violin.violin)
      .attr('stroke', (d, i) => this.getAttr(d.attrs, 'stroke')(d, i))
      .attr('stroke-width', (d, i) => this.getAttr(d.attrs, 'strokeWidth')(d, i))
      .attr('stroke-opacity', (d, i) => this.getAttr(d.attrs, 'strokeOpacity')(d, i))
      .attr('fill', (d, i) => this.getAttr(d.attrs, 'fill')(d, i))
      .attr('fill-opacity', (d, i) => this.getAttr(d.attrs, 'fillOpacity')(d, i))
      .attr('d', (d) => (
        area()
          .x0((d) => (this.xScaleNum(-d[1])))
          .x1((d) => (this.xScaleNum(d[1])))
          .y((d) => (this.yScale.getScale()(d[0])))
          .curve(curveCatmullRom)(d.bins)
      )) as T;
  }

  private pattern(data: D) {
    this.mouseEventHandlers();
    this.setData(data);
    this.groupDataJoin();
    const exiting = this.exit();
    this.enterGroups();
    this.dataJoins();
    const entering = this.enter();
    this.onTransitionEnd(entering, exiting);
  }

  private groupDataJoin() {
    this.group = this.parentGroup
      .selectAll<SVGGElement, BinnedData<D>>(`.${D3Classes.chartElements.violin.violinGroup}`)
      .data(this.bins, (d) => (d as BinnedData<D>[number]).attrs.name);
  }

  private exit() {
    const exiting = this.pathsStart(
      this.group
        .exit()
        .selectAll<SVGPathElement, BinnedData<D>[number]>(`.${D3Classes.chartElements.violin.violin}`)
        .transition()
        .duration(this.transitionMs),
    ).remove();

    this.group
      .exit()
      .transition()
      .duration(this.transitionMs)
      .remove();
    return exiting;
  }

  private dataJoins() {
    this.violin = this.group
      .selectAll<SVGPathElement, BinnedData<D>>(`.${D3Classes.chartElements.violin.violin}`)
      .data((d) => [d], (d) => (d as BinnedData<D>[number]).attrs.name);
  }

  private enterGroups() {
    const groupEnter = this.group
      .enter()
      .append('g')
      .attr('class', D3Classes.chartElements.violin.violinGroup)
      .attr('transform', (d) => (`translate(${this.xScale.getScale()(d.attrs.name)} ,0)`));
    this.group = groupEnter.merge(this.group);
  }

  private enter() {
    const pathsInit = this.pathsStart(
      this.violin
        .enter()
        .append('path'),
    );

    const entering = this.pathsEnd(
      pathsInit
        .transition()
        .duration(this.transitionMs),
    );
    return entering;
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
        paths: this.parentGroup
          .selectAll<SVGPathElement, BinnedData<D>[number]>(`.${D3Classes.chartElements.violin.violin}`),
        groups: this.parentGroup
          .selectAll<SVGGElement, BinnedData<D>[number]>(`.${D3Classes.chartElements.violin.violinGroup}`),
      }
      : {
        paths: this.violin,
        groups: this.group,
      };
  }

  update(transition?: number) {
    this.xScaleNum = scaleLinear()
      .domain([-this.binsMaxX, this.binsMaxX])
      .range([0, this.xScale.getScale().bandwidth()]);

    return {
      new: () => {
        const selection = this.getUpdateSelection();
        this.pathsEnd(
          selection
            .paths
            .transition()
            .duration(transition ?? this.transitionMs),
        );
        selection
          .groups
          .transition()
          .duration(transition ?? this.transitionMs)
          .attr('transform', (d) => (`translate(${this.xScale.getScale()(d.attrs.name)} ,0)`));
      },
      all: () => {
        const selection = this.getUpdateSelection(true);
        this.pathsEnd(
          selection
            .paths
            .transition()
            .duration(transition ?? this.transitionMs),
        );
        selection
          .groups
          .transition()
          .duration(transition ?? this.transitionMs)
          .attr('transform', (d) => (`translate(${this.xScale.getScale()(d.attrs.name)} ,0)`));
      },
    };
  }
}

export default BinnedViolin;

