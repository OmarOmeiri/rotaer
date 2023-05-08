import InfoIcon from '@icons/info.svg';
import CardWithTitle from '../../../../components/Card/CardWithTitle';
import { TAerodromeData } from '../../../../types/app/aerodrome';
import classes from '../AerodromeInfo.module.css';

const AerodromeRMKTab = ({ info }: {info: TAerodromeData}) => (
  <>
    {
        info.rmk && Object.keys(info.rmk).length
          ? (
            <CardWithTitle title='Remarks' Icon={<InfoIcon width="20"/>} className={classes.Card} titleClassName={classes.CardTitle}>
              <ul className={classes.RMKList}>
                {
                  Object.entries(info.rmk).map(([k, vals]) => (
                    <li key={k}>
                      <div>{k}</div>
                      <ul>
                        {
                          vals.map((v) => (
                            <li key={v}>
                              {v}
                            </li>
                          ))
                        }
                      </ul>
                    </li>
                  ))
                }
              </ul>
            </CardWithTitle>
          )
          : null
      }
  </>
);
export default AerodromeRMKTab;
