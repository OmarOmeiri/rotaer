import { useEffect, useRef } from 'react';
import Brush, { ID3Brush } from '../../../frameworks/d3/chartElements/Brush/Brush';
import { D3AxedScales } from '../../../frameworks/d3/Scales/types';
import { useD3Context } from '../context/D3Context';

type IReactD3Brush = Omit<ID3Brush, 'xScale' | 'onBrush' | 'chart'> & {
  xScaleId?: string
}

const ReactD3Brush = ({
  height,
  xScaleId,
  handleWidth,
}: IReactD3Brush) => {
  const brush = useRef<Brush | null>(null);
  const {
    chart,
    dims,
    setUpdateChart,
    scales,
    getScale,
  } = useD3Context();
  useEffect(() => {
    if (chart && scales.length) {
      const scale = getScale({
        id: xScaleId,
        type: 'x',
      }) as D3AxedScales<any>;
      brush.current = new Brush({
        chart,
        xScale: scale,
        onBrush: () => { setUpdateChart((state) => !state); },
        height,
        handleWidth,
      });
    }
  }, [
    chart,
    scales,
    xScaleId,
    height,
    handleWidth,
    getScale,
    setUpdateChart,
  ]);

  useEffect(() => {
    if (dims && brush.current) {
      brush.current.update();
    }
  }, [dims]);

  return null;
};

export default ReactD3Brush;
