import {
  useEffect,
  useRef,
} from 'react';
import Title from '@frameworks/d3/chartElements/Title/Title';
import { useD3Context } from '../context/D3Context';

const ReactD3Title = ({ title }: {title: string}) => {
  const d3Title = useRef<Title | null>(null);
  const {
    chart,
    dims,
    scales,
    updateChart,
  } = useD3Context();

  useEffect(() => {
    if (chart && scales.length) {
      d3Title.current = new Title({
        chart,
        dims: chart.dims,
        title,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, scales]);

  useEffect(() => {
    if (chart && d3Title.current) {
      d3Title.current.updateTitle(chart.dims, title);
    }
  }, [
    chart,
    dims,
    title,
    updateChart,
  ]);

  return null;
};

(ReactD3Title as React.FC).displayName = 'ReactD3Title';
export default ReactD3Title;
