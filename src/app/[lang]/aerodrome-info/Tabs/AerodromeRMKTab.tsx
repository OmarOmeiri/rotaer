import dynamic from 'next/dynamic';
import { TAerodromeData } from '../../../../types/app/aerodrome';
import classes from '../AerodromeInfo.module.css';

const InfoIcon = dynamic(() => import('@icons/info.svg')) as SVGComponent;
const CardWithTitle = dynamic(() => import('../../../../components/Card/CardWithTitle'));

const AerodromeRMKTab = ({ info }: {info: TAerodromeData}) => (
  <>
    {
        info.rmk && Object.keys(info.rmk).length
          ? (
            <CardWithTitle title='Remarks' Icon={<InfoIcon width="20"/>} styled>
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
