import Config from '../../config';

export const FloatingSpinner = ({
  color = Config.get('styles').colors.green,
}: {
  color?: string
}) => (
  <svg stroke={color} style={{ height: '100%', strokeWidth: '8px' }} viewBox="-4 -4 75 75" xmlns="http://www.w3.org/2000/svg">
    <g>
      <animateTransform attributeName="transform" type="rotate" values="0 33 33;270 33 33" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite"/>
      <circle fill="none" strokeLinecap="round" cx="33" cy="33" r="30" strokeDasharray="187" strokeDashoffset="610">
        <animateTransform attributeName="transform" type="rotate" values="0 33 33;135 33 33;450 33 33" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite"/>
        <animate attributeName="stroke-dashoffset" values="187;46.75;187" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite"/>
      </circle>
    </g>
  </svg>
);
