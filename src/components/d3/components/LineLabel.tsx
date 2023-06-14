import { PinWithContent } from '../../Icons/Pin/PinWithContent';
import { ReactD3ChartOverlayElement, TD3ChartOverlayElementXScaled } from './ChartOverlay';
import { SimpleTippy } from '../../Tooltips/SimpleTippy';
import TooltipHover from '../../Tooltips/TooltipHover';

type Props = {
  style?: React.CSSProperties
  position: TD3ChartOverlayElementXScaled['position'],
  xScaleId: string,
  children: React.ReactNode
  tooltip?: React.ReactNode
}

const Tip = ({ children }: {children: React.ReactNode}) => (
  <SimpleTippy arrow='bottom'>
    {children}
  </SimpleTippy>
);

export const ReactD3LineLabel = ({
  style,
  position,
  xScaleId,
  children,
  tooltip,
}: Props) => {
  if (tooltip) {
    return (
      <>
        <TooltipHover tooltip={<Tip>{tooltip}</Tip>} delay={100} placement='top'>
          <ReactD3ChartOverlayElement xScaleId={xScaleId} position={position}>
            <div style={style}>
              {children}
            </div>
          </ReactD3ChartOverlayElement>
        </TooltipHover>
      </>
    );
  }
  return (

    <ReactD3ChartOverlayElement xScaleId={xScaleId} position={position}>
      <div style={style}>
        {children}
      </div>
    </ReactD3ChartOverlayElement>

  );
};

type PropsWithLogo = {
  style?: React.CSSProperties
  position: TD3ChartOverlayElementXScaled['position'],
  xScaleId: string,
  code: string,
  name: string
  tooltip?: React.ReactNode
}

export const ReactD3CompanyLogoLineLabel = ({
  style,
  position,
  xScaleId,
  code,
  name,
  tooltip,
}: PropsWithLogo) => (
  <ReactD3LineLabel xScaleId={xScaleId} position={position} style={style} tooltip={tooltip}>
    <PinWithContent withArrow>
    </PinWithContent>
  </ReactD3LineLabel>
);
