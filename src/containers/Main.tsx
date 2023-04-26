'use client';

import React, {
  useCallback,
  useState,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAerodrome } from '@/API/fetch/aerodrome';
import AssetSearch from '../components/AssetSearch/AssetSearch';
import { useDebouncedState } from '../hooks/React/useDebouncedState';

/** */
export default function Main() {
  // const [searchValue, setSearchValue] = useState<string>('');
  // const debouncedSearchValue = useDebouncedState(searchValue, 300);

  // const query = useQuery<any>({
  //   queryKey: ['aerodrome', debouncedSearchValue],
  //   queryFn: () => fetchAerodrome(searchValue),
  //   enabled: (debouncedSearchValue || '').length >= 3,
  //   cacheTime: 0
  // });

  // const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
  //   const {target} = e;
  //   const {value} = target;
  //   setSearchValue(value)
  // }, []);

  // return (
  //   <>
  //     <input value={searchValue} onChange={onChange}/>
  //     <code>
  //       <pre>
  //         {JSON.stringify(query.data, null, 2)}
  //       </pre>
  //     </code>
  //   </>
  // );
  return (
    <div>
      <AssetSearch/>
    </div>
  );
}
