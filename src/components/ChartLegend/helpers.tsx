import Square from '@icons/charts/square.svg';
import Dot from '@icons/charts/dot.svg';
import LineDot from '@icons/charts/line-dot.svg';
import classes from './ChartLegend.module.css';

export type ChartLegendItem = {
  id: string,
  name: string,
  active: boolean,
  fill?: string,
  stroke?: string
}
export type ChartLegendIconTypes = 'square' | 'line' | 'dot'

const getColor = (item: ChartLegendItem) => (
  item.fill || item.stroke || 'inherit'
);

const Icon = ({
  type,
}:{
  type: ChartLegendIconTypes,
}) => {
  switch (type) {
    case 'dot':
      return <Dot/>;
    case 'line':
      return <LineDot/>;
    case 'square':
    default:
      return <Square/>;
  }
};

export const getChartLegendItem = (
  items: ChartLegendItem[],
  type: ChartLegendIconTypes,
  onClick: (item: ChartLegendItem) => void,
) => (
  items.map((i) => (
    <button
      className={`${classes.LegendItem} ${i.active ? classes.LegendItemActive : ''}`}
      key={i.id}
      onClick={() => onClick(i)}
    >
      <span className={classes.Icon} style={{ color: getColor(i) }}>
        <Icon type={type}/>
      </span>
      <span style={{ whiteSpace: 'nowrap' }}>{i.name}</span>
    </button>
  ))
);
