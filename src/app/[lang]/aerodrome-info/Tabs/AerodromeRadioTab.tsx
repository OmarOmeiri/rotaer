import dynamic from 'next/dynamic';
import { TAerodromeData } from '../../../../types/app/aerodrome';

const WalkieTalkieIcon = dynamic(() => import('@icons/walkie-talkie-solid.svg')) as SVGComponent;
const VORIcon = dynamic(() => import('@icons/vor.svg')) as SVGComponent;
const CardWithTitle = dynamic(() => import('../../../../components/Card/CardWithTitle'));

const AerodromeRadioTab = ({ info }: {info: TAerodromeData}) => (
  <>
    {
    info.com
      ? (
        <CardWithTitle title='COM' Icon={<WalkieTalkieIcon width="18"/>} styled>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <table>
              <tbody>
                {info.com?.map((c) => (
                  c.name && c.freq && c.freq.length
                    ? (
                      <tr key={c.name}>
                        <td style={{ paddingRight: '2em' }}>{c.name}</td>
                        <td>{c.freq.join(', ')}</td>
                      </tr>
                    )
                    : null
                ))}
              </tbody>
            </table>
          </div>
        </CardWithTitle>
      )
      : null
    }
    <CardWithTitle title='RDONAV' Icon={<VORIcon width="25"/>} styled>
      <code><pre>{JSON.stringify(info.radioNav, null, 2)}</pre></code>
    </CardWithTitle>
  </>
);

export default AerodromeRadioTab;
