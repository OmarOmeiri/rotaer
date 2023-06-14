import React, { useEffect, useRef } from 'react';
import Question from '@icons/question-outline.svg';
import { useD3Context } from '../context/D3Context';
import { PortalByRef } from '../../../hoc/portal/PortalByRef';
import type D3Chart from '../../../frameworks/d3/Chart';
import { SimpleTippy } from '../../Tooltips/SimpleTippy';
import TooltipClick from '../../Tooltips/TooltipClick';

const getButtonStyles = (chart: D3Chart | null): React.CSSProperties => {
  if (!chart) return { display: 'none' };
  return {
    margin: '0',
    padding: '0',
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.2)',
    position: 'absolute',
    top: chart.dims.margin.top + 2,
    left: chart.dims.margin.left + chart.dims.innerDims.width - 26,
    cursor: 'pointer',
  };
};

const Tip = () => (
  <SimpleTippy arrow='top'>
    <div style={{ textAlign: 'left' }}>
      <div>Zoom:</div>
      <div>Aproxime e role com o mouse.</div>
      <div>Segure &ldquo;Shift&rdquo; para fixar o eixo X.</div>
    </div>
  </SimpleTippy>
);

export const ReactD3ChartHint = () => {
  const chartOverlay = useRef<HTMLDivElement | null>(null);
  const { chart } = useD3Context();

  useEffect(() => {
    if (chart) {
      chartOverlay.current = chart.chartOverlay.node();
    }
  }, [chart]);

  if (chartOverlay.current === null) return null;
  return (
    <PortalByRef container={chartOverlay.current}>
      <TooltipClick tooltip={<Tip/>}>
        <button style={getButtonStyles(chart)}>
          <Question width="24"/>
        </button>
      </TooltipClick>
    </PortalByRef>
  );
};
