'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import AnimateHeight from 'react-animate-height';
import styled from 'styled-components';
import LogoAbducted from '@assets/icons/logo-abducted.svg';
import { useQuery } from '@tanstack/react-query';
import { useQueryState } from '@/hooks/react-query/useQueryState';
import { fetchAerodrome } from '../../Http/requests/aerodrome';
import { colors } from '../../config/styles/colors';
import { APP_ROUTES } from '../../consts/routes';
import { useClickOutside } from '../../hooks/DOM/useClickOutside';
import { useDebouncedState } from '../../hooks/React/useDebouncedState';
import { useSetRefWithCallback } from '../../hooks/React/useSetRefWithCallback';
import AssetTypeBadge from '../Badges/AssetTypeBadge';
import UnstyledLink from '../Navigation/Link/UnstyledLink';
import Search from '../SearchBox/Search';
import { Tooltip } from '../Tooltips/Tooltip';
import { TAerodrome } from '../../types/app/aerodrome';
import langStore from '../../store/lang/langStore';

const SEARCH_MIN_LENGTH = 3;

const TooltipWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
background-color: ${colors.darklight};
z-index: 2;
max-height: 30vh;
max-width: 50vh;
min-width: 35vh;
overflow-y: scroll;
color: ${colors.white};
border: 2px solid ${colors.green};
border-radius: 4px;
margin-top: 1em;`;

const StyledLink = styled(UnstyledLink)`
display: flex;
align-items: center;
padding: 1em 2em;`;

const Border = styled.div`
&:not(:last-child) {
  border-bottom: 1px solid ${colors.lightGreen};
}`;

const AssetSearchTooltip = ({
  items,
}: {
  items: TAerodrome[],
}) => {
  const locale = langStore((state) => state.lang);
  const [height, setHeight] = useState<0 | 'auto'>(0);
  useLayoutEffect(() => {
    setTimeout(() => {
      setHeight('auto');
    }, 100);
  }, []);
  return (
    <AnimateHeight height={height}>
      <TooltipWrapper>
        {
        items.length
          ? items.map((item) => (
            <Fragment key={item.icao}>
              <StyledLink to={item.icao ? APP_ROUTES.aerodromeInfo(item.icao, locale) : '#'} style={{ width: '100%' }}>
                <div style={{ width: '80%', padding: '0px 2em 0px 1em' }}>
                  <div className='text-ellipsis' style={{ width: '100%' }}>
                    <strong>{item.icao}</strong>&nbsp;-&nbsp;{item.name}
                  </div>
                  <div>
                    {`${item.city}/${item.uf}`}
                  </div>
                </div>
                <div style={{
                  marginLeft: 'auto', width: '10%', display: 'flex', justifyContent: 'center',
                }}>
                  <AssetTypeBadge type={item.type}/>
                </div>
              </StyledLink>
              <Border style={{ height: '0', width: '80%' }}/>
            </Fragment>
          ))
          : (
            <div style={{
              width: '280px',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '1em',
            }}>
              <div style={{ width: '200px', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  height: '100px',
                  width: '75px',
                  color: 'rgb(35 84 35)',
                  transform: 'rotate(12deg)',
                }}>
                  <LogoAbducted/>
                </div>
              </div>
              <span style={{ margin: '1em' }}>Não encontramos isto...</span>
            </div>
          )
        }
      </TooltipWrapper>
    </AnimateHeight>
  );
};

const AssetSearch = ({ disableScroll }: {disableScroll?: boolean}) => {
  const [value, setValue] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const pathName = usePathname();
  const searchParams = useSearchParams().toString();
  const debouncedValue = useDebouncedState(value, 200);
  const [enabled, setEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const setRef = useSetRefWithCallback<React.MutableRefObject<HTMLDivElement | null>>((node) => {
    if (node.current) {
      tooltipRef.current = node.current;
      setLoaded(true);
    }
  });

  const query = useQuery<any>({
    queryKey: ['aerodrome-search', debouncedValue],
    queryFn: () => fetchAerodrome({ id: value }),
    enabled,
    cacheTime: 0,
  });

  const closeTooltip = useCallback(() => {
    if (document.activeElement !== searchInputRef.current) {
      setTooltipOpen(false);
      setValue('');
    }
  }, [searchInputRef]);

  const openTooltip = useCallback(() => {
    setTooltipOpen(true);
  }, []);

  useClickOutside({
    ref: tooltipRef,
    isOpen: tooltipOpen,
    cb: closeTooltip,
  }, [loaded]);

  const queryState = useQueryState(query);

  const onChange = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setValue(target.value);
  }, []);

  const onSubmit = useCallback((e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    setValue(target.value);
  }, []);

  useEffect(() => {
    if (debouncedValue.length >= SEARCH_MIN_LENGTH) {
      setEnabled(true);
    }
  }, [debouncedValue, value]);

  useEffect(() => {
    if (value.length < SEARCH_MIN_LENGTH) {
      setEnabled(false);
      setTooltipOpen(false);
    }
  }, [value]);

  useEffect(() => {
    if (
      !queryState.isLoading
      && queryState.isFetched
      && debouncedValue.length >= SEARCH_MIN_LENGTH
    ) {
      openTooltip();
    }
  }, [
    queryState,
    openTooltip,
    closeTooltip,
    query.data,
    debouncedValue,
  ]);

  useEffect(() => {
    if (!disableScroll) return;
    if (tooltipOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'scroll';
    }
  }, [tooltipOpen, disableScroll]);

  useEffect(() => {
    closeTooltip();
  }, [pathName, searchParams, closeTooltip]);

  return (
    <>
      <Tooltip
        open={tooltipOpen}
        tooltip={
          <AssetSearchTooltip
            items={query.data || []}
          />
        }
        onOpen={setRef}>
        <Search
          onChange={onChange}
          onSubmit={onSubmit}
          value={value}
          ref={searchInputRef}
        />
      </Tooltip>
    </>
  );
};

export default AssetSearch;
