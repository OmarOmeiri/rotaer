'use client';

import React, { useState } from 'react';
import {
  dehydrate,
  Hydrate,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Wrapper as GMapWrapper } from '@googlemaps/react-wrapper';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import getQueryClient from '@/frameworks/react-query/getQueryClient';

/** */
function Providers({ children }: React.PropsWithChildren) {
  const [queryClient] = useState(getQueryClient());
  const dehydratedState = dehydrate(queryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <GMapWrapper apiKey={process.env.GMAPS_API_KEY} version='beta' libraries={['marker']}>
          <>
            { children }
          </>
        </GMapWrapper>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Providers;

