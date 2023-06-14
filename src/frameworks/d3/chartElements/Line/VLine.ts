import {
  BaseType,
  Selection,
  Transition,
} from 'd3';
import { D3OnTransitionEnd } from '../../helpers/d3OnTransitionEnd';
import { D3ScaleLinear } from '../../Scales';
import D3ScaleBand from '../../Scales/ScaleBand';
import D3ScaleLog from '../../Scales/ScaleLog';
import D3ScaleTime from '../../Scales/ScaleTime';
import {
  ID3Attrs,
} from '../../types';
import D3Mouse from '../Mouse/D3Mouse';

import type D3Chart from '../../Chart';
import { D3Classes } from '../../consts/classes';
import { d3AppendIfNotExists } from '../../helpers/d3Exists';
import { D3GetMousePositionToViewPort } from '../Mouse/helpers/getMousePosition';

export interface ID3VLineSerie {
  id: string,
  name?: string,
  x: number | string | Date,
  stroke?: string;
  strokeWidth?: string;
  strokeOpacity?: string;
}

type VLineScales<
D extends Record<string, unknown>,
> =
| D3ScaleLinear<D>
| D3ScaleBand<D>
| D3ScaleLog<D>
| D3ScaleTime<D>

type D3VLineScales<
D extends Record<string, unknown>,
> =
| D3ScaleLinear<D>['scale']
| D3ScaleBand<D>['scale']
| D3ScaleLog<D>['scale']
| D3ScaleTime<D>['scale']

export interface ID3VLine<
D extends Record<string, unknown>,
> {
  chart: D3Chart
  xScale: VLineScales<D>;
  transitionMs?: number
  series: ID3VLineSerie[]
  mouseOver?: (d: ID3VLineSerie, position: [number, number]) => void
  mouseMove?: (position: [number, number]) => void
  mouseOut?: () => void
}

type LineTransition = Transition<SVGLineElement, ID3VLineSerie, BaseType, unknown>;
type LineSelection = Selection<SVGLineElement, ID3VLineSerie, BaseType, unknown>

const DEFAULT_LINE_ATTRS: Record<keyof ID3Attrs<any>, string> = {
  stroke: 'black',
  strokeWidth: '2',
  strokeOpacity: '1',
};

class VLine <
D extends Record<string, unknown>,
> {
  private chart: D3Chart;
  private xScale: VLineScales<D>;
  private group!: Selection<SVGGElement, unknown, null, unknown>;
  private lines!: LineSelection;
  private series: ID3VLineSerie[];
  private transitionMs: number;
  private mouseOut: () => void;
  private mouseMove: (position: [number, number]) => void;
  private mouseOver: (d: ID3VLineSerie, position: [number, number]) => void;
  private mouse: D3Mouse;
  private formatCrosshair?: {
    x?: (val: string | number | Date) => string
    y?: (val: string | number | Date) => string
  };

  constructor({
    chart,
    xScale,
    series,
    transitionMs,
    mouseOut,
    mouseMove,
    mouseOver,
  }: ID3VLine<D>) {
    this.chart = chart;
    this.mouse = new D3Mouse(this.chart);
    this.xScale = xScale;

    this.series = series;

    this.transitionMs = transitionMs || 250;

    this.mouseOut = mouseOut || (() => {});
    this.mouseOver = mouseOver || (() => {});
    this.mouseMove = mouseMove || (() => {});

    this.group = d3AppendIfNotExists(
      this.chart.chart.select(`.${D3Classes.chartElements.vLine.group}`),
      () => this.chart.chart
        .append('g')
        .attr('class', D3Classes.chartElements.vLine.group),
    );

    this.chart.zoomSubscribe(() => this.update().all());

    this.pattern();
  }

  private getAttr(
    attrs: ID3VLineSerie,
    key: keyof ID3Attrs<D>,
  ): ((d: ID3VLineSerie, index: number) => string) {
    const attr = attrs[key];

    if (!attr) {
      return () => DEFAULT_LINE_ATTRS[key] || '';
    }

    return () => attr;
  }

  private getPosition(v: any, scale: D3VLineScales<D>) {
    return Number(scale(v)) + (
      'bandwidth' in scale
        ? (scale.bandwidth() / 2)
        : 0
    );
  }

  private setEvents<
  T extends LineSelection | LineTransition
>(line: T) {
    line
      .on('mouseover', (e, d) => {
        this.mouseOver(d as any, D3GetMousePositionToViewPort(e, this.chart));
      });
    line
      .on('mouseMove', (e) => {
        this.mouseMove(D3GetMousePositionToViewPort(e, this.chart));
      });
    line
      .on('mouseout', () => {
        this.mouseOut();
      });
  }

  private lineStart<
    T extends LineSelection
    | LineTransition
  >(lines: T): T {
    return (lines as LineSelection)
      .attr('clip-path', `url(#${this.chart.chartAreaClipId})`)
      .attr('class', D3Classes.chartElements.vLine.line)
      .attr('stroke', (d, i) => this.getAttr(d, 'stroke')(d as any, i))
      .attr('x1', (d) => this.getPosition(d.x, this.xScale.getScale()))
      .attr('x2', (d) => this.getPosition(d.x, this.xScale.getScale()))
      .attr('y1', this.chart.dims.innerDims.height)
      .attr('y2', this.chart.dims.innerDims.height)
      .attr('fill-opacity', 1)
      .attr('stroke-width', (d, i) => this.getAttr(d, 'strokeWidth')(d as any, i)) as T;
  }

  private pathEnd<
  T extends LineSelection
  | LineTransition
    >(lines: T): T {
    return (lines as LineSelection)
      .attr('stroke', (d, i) => this.getAttr(d, 'stroke')(d as any, i))
      .attr('x1', (d) => this.getPosition(d.x, this.xScale.getScale()))
      .attr('x2', (d) => this.getPosition(d.x, this.xScale.getScale()))
      .attr('y1', 0)
      .attr('y2', this.chart.dims.innerDims.height)
      .attr('fill-opacity', 1)
      .attr('stroke-width', (d, i) => this.getAttr(d, 'strokeWidth')(d as any, i)) as T;
  }

  private pattern() {
    this.dataJoins();
    const exiting = this.exit();
    const entering = this.enter();
    this.onTransitionEnd(...entering, ...exiting);
  }

  private exit() {
    const pathsExit = this.lineStart(
      this.lines
        .exit<ID3VLineSerie>()
        .transition()
        .duration(this.transitionMs),
    ).remove();

    return [pathsExit];
  }

  private dataJoins() {
    this.lines = this.group
      .selectAll<SVGLineElement, ID3VLineSerie>(`.${D3Classes.chartElements.vLine.line}`)
      .data(this.series, (d) => d.id);
  }

  private enter() {
    const pathsInit = this.lineStart(
      this.lines
        .enter()
        .append('line'),
    );

    this.setEvents(pathsInit);

    const pathsEnter = this.pathEnd(
      pathsInit
        .transition()
        .duration(this.transitionMs),
    );

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
      ? this.chart.chart
        .selectAll<SVGLineElement, ID3VLineSerie>(`.${D3Classes.chartElements.vLine.line}`) as LineSelection
      : this.lines;
  }

  update(transition?: number) {
    return {
      new: () => {
        const updtSelection = this.getUpdateSelection();
        this.pathEnd(
          updtSelection
            .transition()
            .duration(transition ?? this.transitionMs),
        );

        this.setEvents(updtSelection);
      },
      all: () => {
        const updtSelection = this.getUpdateSelection(true);
        this.pathEnd(
          updtSelection
            .transition()
            .duration(transition ?? this.transitionMs),
        );
        this.setEvents(updtSelection);
      },
    };
  }
}

export default VLine;

