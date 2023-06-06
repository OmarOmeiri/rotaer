'use client';

import React, { useState } from 'react';
import {
  dehydrate,
  Hydrate,
  QueryClientProvider,
} from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Wrapper as GMapWrapper } from '@googlemaps/react-wrapper';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Session } from 'next-auth';
import MyQueryClient from '@/frameworks/react-query/getQueryClient';

/** */
function Providers({
  children,
  session,
}: React.PropsWithChildren<{session?: Session}>) {
  const [qClient] = useState(MyQueryClient.init());
  const dehydratedState = dehydrate(qClient);
  return (
    <QueryClientProvider client={qClient}>
      <Hydrate state={dehydratedState}>
        <GMapWrapper apiKey={process.env.NEXT_PUBLIC_GMAPS_API_KEY} version='beta' libraries={['marker']}>
          <SessionProvider session={session}>
            { children }
          </SessionProvider>
        </GMapWrapper>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Providers;

