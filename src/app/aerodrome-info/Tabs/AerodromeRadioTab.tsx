import WalkieTalkieIcon from '@icons/walkie-talkie-solid.svg';
import VORIcon from '@icons/vor.svg';
import CardWithTitle from '../../../components/Card/CardWithTitle';
import { TAerodromeData } from '../../../types/app/aerodrome';
import classes from '../AerodromeInfo.module.css';

const AerodromeRadioTab = ({ info }: {info: TAerodromeData}) => (
  <>
    {
    info.com
      ? (
        <CardWithTitle title='COM' Icon={<WalkieTalkieIcon width="18"/>} className={classes.Card} titleClassName={classes.CardTitle}>
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
    <CardWithTitle title='RDONAV' Icon={<VORIcon width="25"/>} className={classes.Card} titleClassName={classes.CardTitle}>
      <code><pre>{JSON.stringify(info.radioNav, null, 2)}</pre></code>
    </CardWithTitle>
  </>
);

export default AerodromeRadioTab;
