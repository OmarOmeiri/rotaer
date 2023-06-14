import {
  select,
  Selection,
  ZoomBehavior,
  ZoomTransform,
  zoomTransform,
} from 'd3';
import { D3Classes } from './consts/classes';
import { D3Dimensions } from './Dimensions';
import { ID3Dimensions } from './Dimensions/Dimensions';
import { d3AppendIfNotExists } from './helpers/d3Exists';
import { D3Zoom } from './helpers/d3Zoom';
import { D3Scales } from './Scales/types';

class D3Chart {
  public svg: Selection<SVGSVGElement, unknown, null, undefined>;
  public chart!: Selection<SVGGElement, unknown, null, undefined>;
  public chartWrapper: Selection<HTMLDivElement, unknown, null, unknown>;
  public chartOverlay: Selection<HTMLDivElement, unknown, null, unknown>;
  public defs!: Selection<SVGDefsElement, unknown, null, undefined>;
  public dims: D3Dimensions;
  public id: string;
  public zoom?: ZoomBehavior<SVGSVGElement, unknown>;
  private onZoomSubscribers = new Set<(zoom: ZoomTransform) => void>();
  public chartAreaClipId: string;
  private chartAreaRectClip!: Selection<SVGClipPathElement, unknown, null, undefined>;
  private brushZoomReset = false;

  constructor({
    id,
    ref,
    dims,
  }: {
    id: string
    ref: HTMLDivElement,
    dims: ID3Dimensions,
  }) {
    this.id = id;
    this.chartAreaClipId = `${this.id}-chart-clip`;
    this.chartWrapper = select(ref);
    this.chartOverlay = d3AppendIfNotExists(
      this.chartWrapper
        .select(`.${D3Classes.chartOverlay}`),
      () => this.chartWrapper
        .append('div')
        .attr('class', D3Classes.chartOverlay),
    );

    this.svg = d3AppendIfNotExists(
      this.chartWrapper
        .select('svg'),
      () => this.chartWrapper
        .append('svg')
        .attr('class', D3Classes.svg),
    );

    this.svg
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('id', this.id);

    this.dims = new D3Dimensions(dims);

    this.appendChartArea();
    this.appendDefs();
  }

  private appendChartArea() {
    this.chart = d3AppendIfNotExists(
      this.svg
        .select('.d3-chart'),
      () => this.svg
        .append('g')
        .attr('class', 'd3-chart')
        .attr('transform', `translate(${this.dims.margin.left}, ${this.dims.margin.top})`)
        .attr('opacity', '0'),
    );

    this.chart
      .transition()
      .duration(200)
      .attr('opacity', 1);
  }

  private appendDefs() {
    this.defs = d3AppendIfNotExists(
      this.chart.select('defs'),
      () => this.chart
        .append('defs'),
    );

    this.chartAreaRectClip = d3AppendIfNotExists(
      this.defs.select(`#${this.chartAreaClipId}`),
      () => this.defs
        .append('clipPath')
        .attr('id', this.chartAreaClipId),
    );

    d3AppendIfNotExists(
      this.chartAreaRectClip.select('rect'),
      () => this.chartAreaRectClip
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', this.dims.innerDims.width)
        .attr('height', this.dims.innerDims.height),
    );
  }

  updateDims(dims: ID3Dimensions) {
    if (dims) this.dims.setDims(dims);
    this.chart
      .attr('transform', `translate(${this.dims.margin.left}, ${this.dims.margin.top})`);

    this.chartAreaRectClip
      .select('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.dims.innerDims.width)
      .attr('height', this.dims.innerDims.height);
  }

  initZoom({
    x,
    y,
    onZoom,
  }:{
    x: D3Scales<any>,
    y: D3Scales<any>,
    onZoom: (e: any) => void
  }) {
    this.zoom = D3Zoom({
      chart: this,
      xScale: x,
      yScale: y,
      onZoom: (e) => {
        onZoom(e);
      },
    });
  }

  getZoomTransform() {
    const node = this.svg.node();
    if (node) return zoomTransform(node);
  }

  isZoomed() {
    const transform = this.getZoomTransform();
    return (transform?.k !== 1 || transform.x !== 0 || transform.y !== 0);
  }

  publishZoomState(transform: ZoomTransform) {
    this.onZoomSubscribers.forEach((callback) => callback(transform));
  }

  resetZoom(brush?: boolean) {
    if (!this.isZoomed()) return;
    if (this.zoom && !this.brushZoomReset) {
      this.svg
        .call(
          this.zoom.scaleTo,
          0,
        );
      if (brush) this.brushZoomReset = true;
    }
  }

  zoomSubscribe(callback: (zoom: ZoomTransform) => void) {
    this.onZoomSubscribers.add(callback);
  }
}

export default D3Chart;
