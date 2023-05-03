import { notFound } from 'next/navigation';
import { fetchAerodromeInfo } from '../../API/fetch/aerodrome';
import classes from './AerodromeInfo.module.css';
import AssetTypeBadge from '../../components/Badges/AssetTypeBadge';
import Tabs from '../../components/Tabs/Tabs';
import { Tab } from '../../components/Tabs/Tab';
import AerodromeMainInfoTab from './Tabs/MainInfo';
import AerodromeRunwaysTab from './Tabs/AerodromeRunwaysTab';
import AerodromeRadioTab from './Tabs/AerodromeRadioTab';
import AerodromeMetTab from './Tabs/AerodromeMetTab';
import { fetchAerodromeMETAR } from '../../API/fetch/metar';
import MetarStatusBadge from '../../components/Badges/MetarStatusBadge';
import { TooltipHover } from '../../components/Tooltips/TooltipHover';
import StyledTooltip from '../../components/Tooltips/StyledTooltip';

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
  const metar = await fetchAerodromeMETAR({ icao: info.icao });

  return (
    <div>
      <div className={classes.Title}>
        <h1>{info.name} - {info.icao}</h1>
        <div className={classes.TitleBadges}>
          <AssetTypeBadge type={info.type}/>
          {
            metar?.metar
              ? (
                <TooltipHover
                  tooltip={
                    <StyledTooltip title={`Condição ${metar.metar.status}`}>
                      {
                        metar.metar.status === 'VMC'
                          ? 'Condições visuais de vôo'
                          : 'Condições de vôo por instrumentos'
                      }
                    </StyledTooltip>
                  }
                  placement='bottom'>
                  <MetarStatusBadge status={metar.metar.status}/>
                </TooltipHover>
              )
              : null
          }
        </div>
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
        <Tab label='rádio' className={classes.Tab} hidden={!(info.com?.length || info.radioNav?.length)}>
          <div className='container'>
            <AerodromeRadioTab info={info}/>
          </div>
        </Tab>
        <Tab label='met' className={classes.Tab}>
          <div className='container'>
            <AerodromeMetTab info={info} metar={metar}/>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AerodromeInfo;

