import { notFound } from 'next/navigation';
import { fetchAerodromeInfo } from '../../../API/fetch/aerodrome';
import classes from './AerodromeInfo.module.css';
import AssetTypeBadge from '../../../components/Badges/AssetTypeBadge';
import Tabs from '../../../components/Tabs/Tabs';
import { Tab } from '../../../components/Tabs/Tab';
import AerodromeMainInfoTab from './Tabs/MainInfo';
import AerodromeRunwaysTab from './Tabs/AerodromeRunwaysTab';
import AerodromeRadioTab from './Tabs/AerodromeRadioTab';
import AerodromeMetTab from './Tabs/AerodromeMetTab';
import { fetchAerodromeMETAR } from '../../../API/fetch/metar';
import MetarStatusBadge from '../../../components/Badges/MetarStatusBadge';
import { TooltipHover } from '../../../components/Tooltips/TooltipHover';
import StyledTooltip from '../../../components/Tooltips/StyledTooltip';
import langStore from '../../../store/lang/langStore';
import type METARParser from '../../../utils/METAR/METAR';
import LangStoreInitializer from '../../../store/LangStoreInitializer';

type Props = {
  searchParams?: {
    id?: string;
  };
  params: {
    lang: Langs
  };
};

const getConditionStatus = (status: ReturnType<METARParser['toObject']>['metar']['status']) => ({
  title: {
    'pt-BR': `Condição ${status}`,
    'en-US': `${status} condition`,
  },
  content: {
    'pt-BR': status === 'VMC'
      ? 'Condições visuais de vôo'
      : 'Condições de vôo por instrumentos',
    'en-US': status === 'VMC'
      ? 'Visual meteorological conditions'
      : 'Instrument meteorological conditions',
  },
});

const tabNames = {
  info: { 'pt-BR': 'info', 'en-US': 'info' },
  runways: { 'pt-BR': 'pistas', 'en-US': 'runways' },
  radio: { 'pt-BR': 'rádio', 'en-US': 'radio' },
  met: { 'pt-BR': 'met', 'en-US': 'met' },
};

const AerodromeInfo = async ({
  searchParams,
  params: { lang },
}: Props) => {
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
      {/* <StoreInitializer storeName='lang' lang={lang}/> */}
      <div className={classes.Title}>
        <h1>{info.name} - {info.icao}</h1>
        <div className={classes.TitleBadges}>
          <AssetTypeBadge type={info.type}/>
          {
            metar?.metar
              ? (
                <TooltipHover
                  tooltip={
                    <StyledTooltip title={getConditionStatus(metar?.metar.status).title[lang]}>
                      {getConditionStatus(metar?.metar.status).content[lang]}
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
        <Tab label={tabNames.info[lang]} className={classes.Tab}>
          <div className='container'>
            <AerodromeMainInfoTab info={info}/>
          </div>
        </Tab>
        <Tab label={tabNames.runways[lang]} className={classes.Tab}>
          <div className='container'>
            <AerodromeRunwaysTab info={info}/>
          </div>
        </Tab>
        <Tab label={tabNames.radio[lang]} className={classes.Tab} hidden={!(info.com?.length || info.radioNav?.length)}>
          <div className='container'>
            <AerodromeRadioTab info={info}/>
          </div>
        </Tab>
        <Tab label={tabNames.met[lang]} className={classes.Tab}>
          <div className='container'>
            <AerodromeMetTab info={info} metar={metar}/>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AerodromeInfo;
