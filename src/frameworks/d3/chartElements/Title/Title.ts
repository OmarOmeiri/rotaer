import { Selection } from 'd3';
import type D3Chart from '../../Chart';
import { D3Classes } from '../../consts/classes';
import { D3Dimensions } from '../../Dimensions';

export interface ID3Title{
  chart: D3Chart,
  title?: string;
  dims: D3Dimensions;
}

class Title {
  private chart: D3Chart;
  private titleG: Selection<SVGGElement, unknown, null, undefined>;
  private title?: string;

  constructor({
    chart,
    dims,
    title,
  }: ID3Title) {
    this.chart = chart;
    this.title = title;

    const hasTitle = this.chart.svg
      .selectAll(`.${D3Classes.chartElements.title.title}`).size();

    if (hasTitle) {
      this.titleG = this.chart.svg
        .select(`.${D3Classes.chartElements.title.group}`);
      this.updateTitle(dims, this.title);
    } else {
      this.titleG = this.chart.svg
        .append('g')
        .attr('class', D3Classes.chartElements.title.group);

      this.titleG
        .append('text')
        .attr('class', D3Classes.chartElements.title.title)
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${dims.width / 2},${0})`)
        .text(this.title || '');
    }
  }

  updateTitle(dims: D3Dimensions, title?: string) {
    if (title) this.title = title;
    if (this.title) {
      const height = this.titleG.node()?.getBBox().height || 0;
      this.titleG
        .select(`.${D3Classes.chartElements.title.title}`)
        .attr('transform', `translate(${dims.width / 2},${height})`)
        .transition()
        .duration(750)
        .text(this.title);
    }
  }
}

export default Title;
