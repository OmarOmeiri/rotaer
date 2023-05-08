import Link from 'next/link';
import GoToIcon from '@icons/go-to.svg';
import { TAerodromPrelimInfo } from '../../types/app/aerodrome';
import { APP_ROUTES } from '../../consts/routes';
import Config from '../../config';
import classes from './AerodromeInfoWindow.module.css';

const aerodromeColors = Config.get('styles').colors.aerodromes;

const contentStyle = (m: TAerodromPrelimInfo): React.CSSProperties => ({
  backgroundColor: aerodromeColors[m.type as keyof typeof aerodromeColors]?.color || aerodromeColors.other.color,
  display: 'inline-block',
  padding: '3px 5px',
  borderRadius: '2px',
  height: 'fit-content',
});

const AerodromeInfoWindow = (m: TAerodromPrelimInfo, lang: Langs) => (
  <div className={classes.Wrapper}>
    <Link href={m.icao ? APP_ROUTES.aerodromeInfo(m.icao, lang) : '#'} className={classes.Link}>
      <div>
        <div className={classes.Main}>
          <div>
            <div className={classes.Title}>
              <span style={{ margin: '0', fontSize: '1.2rem', fontWeight: 'bold' }}>{m.icao}</span>
              <div>
                <GoToIcon/>
              </div>
            </div>
            <span style={contentStyle(m)}>{m.type}</span>
          </div>
          <div><small>{m.elev}m</small></div>
        </div>
        <div>{m.name}</div>
        <div>{`${m.city}/${m.uf}`}</div>
      </div>
    </Link>
  </div>
);

export default AerodromeInfoWindow;
