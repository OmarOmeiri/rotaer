import { notFound } from 'next/navigation';
import Windy from '../../components/Windy/Windy';
import { fetchAerodromeInfo } from '../../API/fetch/aerodrome';
import classes from './AerodromeInfo.module.css';
import AssetTypeBadge from '../../components/Badges/AssetTypeBadge';
import Tabs from '../../components/Tabs/Tabs';
import { Tab } from '../../components/Tabs/Tab';
import CardWithTitle from '../../components/Card/CardWithTitle';
import AerodromeMainInfoTab from './Tabs/MainInfo';
import AerodromeRunwaysTab from './Tabs/AerodromeRunwaysTab';
import AerodromeRadioTab from './Tabs/AerodromeRadioTab';
import AerodromeMetTab from './Tabs/AerodromeMetTab';

type Props = {
  searchParams?: {
    id?: string;
  };
};

const AerodromeInfo = async ({ searchParams }: Props) => {
  const id = searchParams?.id;

  const info = id
    ? await fetchAerodromeInfo({ id })
    : null;

  if (!id || info === null) {
    return notFound();
  }

  return (
    <div>
      <div className={classes.Title}>
        <h1>{info.name} - {info.icao}</h1>
        <AssetTypeBadge type={info.type}/>
      </div>
      <Tabs>
        <Tab label='info' className={classes.Tab}>
          <div className='container'>
            <AerodromeMainInfoTab info={info}/>
          </div>
        </Tab>
        <Tab label='pistas' className={classes.Tab}>
          <div className='container'>
            <AerodromeRunwaysTab info={info}/>
          </div>
        </Tab>
        <Tab label='rádio' className={classes.Tab}>
          <div className='container'>
            <AerodromeRadioTab info={info}/>
          </div>
        </Tab>
        <Tab label='met' className={classes.Tab}>
          <div className='container'>
            <AerodromeMetTab info={info}/>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AerodromeInfo;
