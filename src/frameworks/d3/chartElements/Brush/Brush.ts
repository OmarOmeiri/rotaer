import {
  Selection,
  brushX,
  BrushBehavior,
  xml,
} from 'd3';
import BrushHandle from '@icons/charts/brush-handle.svg?url';
import { isHtmlNode } from '@utils/HTML/htmlFuncs';
import { scaleSVGElement, SVGElementRescale } from '@utils/SVG/svgFuncs';
import type D3Chart from '../../Chart';
import { D3Classes } from '../../consts/classes';
import { d3AppendIfNotExists } from '../../helpers/d3Exists';
import { D3AxedScales } from '../../Scales/types';

const DEFAULT_HEIGHT = 30;
const DEFAULT_HANDLE_WIDTH = 8;
const DEFAULT_HANDLE_HEIGHT = (brushHeight: number) => brushHeight + 2;

export interface ID3Brush {
  chart: D3Chart;
  xScale: D3AxedScales<any>;
  onBrush: () => void;
  height?: number;
  handleWidth?: number;
}

class Brush {
  private chart: D3Chart;
  private xScale: D3AxedScales<any>;
  private onBrush: () => void;
  private height = DEFAULT_HEIGHT;
  private group: Selection<SVGGElement, unknown, null, undefined>;
  private handleLeft!: Selection<SVGGElement, unknown, null, undefined>;
  private handleRight!: Selection<SVGGElement, unknown, null, undefined>;
  private handleScale?: SVGElementRescale;
  private brush: BrushBehavior<unknown>;
  private handleHeight: number;
  private handleWidth: number;

  constructor({
    chart,
    xScale,
    onBrush,
    height = DEFAULT_HEIGHT,
    handleWidth = DEFAULT_HANDLE_WIDTH,
  }: ID3Brush) {
    this.chart = chart;
    this.xScale = xScale;
    this.onBrush = onBrush;
    this.height = height;
    this.handleWidth = handleWidth;
    this.handleHeight = DEFAULT_HANDLE_HEIGHT(this.height);
    this.group = d3AppendIfNotExists(
      this.chart.svg.select<SVGGElement>(`.${D3Classes.chartElements.brush.group}`),
      () => this.chart.svg
        .append('g')
        .attr('class', D3Classes.chartElements.brush.group),
    );

    this.brush = brushX()
      .extent([[
        this.chart.dims.margin.left,
        this.chart.dims.height - this.height,
      ], [
        this.chart.dims.innerDims.width + this.chart.dims.margin.left,
        this.chart.dims.height,
      ]])
      .on('start brush end', (e) => {
        this.group.call(() => this.brushHandle(e.selection));
        if (e.type === 'end') {
          this.onEnd(e.selection);
          this.onBrush();
        }
      });

    this.group.call(this.brush);
    this.appendHandles();
    this.setClasses();
    // this.chart.zoomSubscribe((zoom) => this.syncToMouseZoom(zoom));
    this.chart.zoomSubscribe(() => this.resetBrush());
  }

  // private syncToMouseZoom(zoom: any) {
  //   const width = this.chart.dims.innerDims.width / zoom.k;
  //   const zoomX = (-zoom.x) / 2;// - this.chart.dims.margin.left;

  //   this.brush.move(
  //     this.group,
  //     [
  //       this.chart.dims.margin.left + zoomX,
  //       this.chart.dims.margin.left + zoomX + width,
  //     ],
  //     new Event('move-cancel'),
  //   );
  // }

  private resetBrush() {
    this.group.call(
      this.brush.move,
      [
        this.chart.dims.margin.left,
        this.chart.dims.innerDims.width + this.chart.dims.margin.left,
      ],
      new Event('move-cancel'),
    );

    this.group
      .selectAll(`.${D3Classes.chartElements.brush.handleL}, .${D3Classes.chartElements.brush.handleR}`)
      .attr('transform', (_, i, nodes) => {
        const node = nodes[i];
        if (isHtmlNode(node, 'g')) {
          return `${this.getHandleTransform(node)}`;
        }
        return 'scale(0)';
      });
  }

  private getHandleScale(node: SVGGElement) {
    if (this.handleScale) return this.handleScale;
    const scale = scaleSVGElement(node, { width: this.handleWidth, height: this.handleHeight });
    this.handleScale = scale;
    return scale;
  }

  private appendHandles() {
    this.handleLeft = d3AppendIfNotExists(
      this.group.select<SVGGElement>(`.${D3Classes.chartElements.brush.handleL}`),
      () => this.group
        .append('g')
        .attr('class', D3Classes.chartElements.brush.handleL)
        .attr('pointer-events', 'none'),
    );

    this.handleRight = d3AppendIfNotExists(
      this.group.select<SVGGElement>(`.${D3Classes.chartElements.brush.handleR}`),
      () => this.group
        .append('g')
        .attr('class', D3Classes.chartElements.brush.handleR)
        .attr('pointer-events', 'none'),
    );

    xml(BrushHandle).then((svg) => {
      const leftHandle = this.handleLeft.node();
      const rightHandle = this.handleRight.node();
      const clone = svg.documentElement.cloneNode(true) as HTMLElement;
      if (!leftHandle?.childElementCount) {
        leftHandle?.append(...svg.documentElement.children);
      }
      if (!rightHandle?.childElementCount) {
        rightHandle?.append(...clone.children);
      }
    });
  }

  private setClasses() {
    this.group
      .select('.overlay')
      .classed(D3Classes.chartElements.brush.overlay, true);

    this.group
      .select('.selection')
      .classed(D3Classes.chartElements.brush.selection, true);
  }

  private getHandleTransform(node: SVGGElement, selection?: number) {
    const isLeft = node.classList.contains(D3Classes.chartElements.brush.handleL);
    const sel = (Number(selection) - this.chart.dims.margin.left) || 0;
    const y = this.chart.dims.height - (this.handleHeight - ((this.handleHeight - this.height) / 2));

    if (isLeft) {
      return {
        x: this.chart.dims.margin.left - (this.handleWidth / 2) + sel,
        y,
        scale: this.getHandleScale(node),
        toString() {
          return `translate(${this.x}, ${this.y}) ${this.scale}`;
        },
      };
    }
    return {
      x: (((sel || NaN) + this.chart.dims.margin.left) || this.chart.dims.width - this.chart.dims.margin.right) - (this.handleWidth / 2),
      y,
      scale: this.getHandleScale(node),
      toString() {
        return `translate(${this.x}, ${this.y}) ${this.scale}`;
      },
    };
  }

  private brushHandle(selection: number[]) {
    this.group
      .selectAll(`.${D3Classes.chartElements.brush.handleL}, .${D3Classes.chartElements.brush.handleR}`)
      .attr('transform', (_, i, nodes) => {
        if (!selection) return null;
        const node = nodes[i];
        if (isHtmlNode(node, 'g')) {
          return `${this.getHandleTransform(node, selection[i])}`;
        }
        return 'scale(0)';
      });
  }

  private onEnd(selection: [number, number] | null) {
    if (!selection) {
      this.setBrushToFull();
      return;
    }
    this.xScale.brushRescale([selection[0] - this.chart.dims.margin.left, selection[1] - this.chart.dims.margin.left]);
  }

  private setBrushToFull() {
    this.group.call(
      this.brush.move,
      [
        this.chart.dims.margin.left,
        this.chart.dims.innerDims.width + this.chart.dims.margin.left,
      ],
    );

    this.group
      .selectAll(`.${D3Classes.chartElements.brush.handleL}, .${D3Classes.chartElements.brush.handleR}`)
      .attr('transform', (_, i, nodes) => {
        const node = nodes[i];
        if (isHtmlNode(node, 'g')) {
          return `${this.getHandleTransform(node)}`;
        }
        return 'scale(0)';
      });
  }

  update() {
    this.brush = brushX()
      .extent([[
        this.chart.dims.margin.left,
        this.chart.dims.height - this.height,
      ], [
        this.chart.dims.innerDims.width + this.chart.dims.margin.left,
        this.chart.dims.height,
      ]])
      .on('start', (e) => {
        this.group.call(() => this.brushHandle(e.selection));
        if (typeof e.mode !== 'undefined') {
          this.chart.resetZoom();
        }
      })
      .on('brush', (e) => {
        this.group.call(() => this.brushHandle(e.selection));
      })
      .on('end', (e) => {
        if (!e.selection) {
          this.setBrushToFull();
          return;
        }
        this.group.call(() => this.brushHandle(e.selection));
        if (e?.sourceEvent?.type !== 'move-cancel') {
          this.onEnd(e.selection);
          this.onBrush();
        }
      });

    this.group.call(this.brush);

    this.setBrushToFull();

    this.setClasses();
  }
}

export default Brush;
