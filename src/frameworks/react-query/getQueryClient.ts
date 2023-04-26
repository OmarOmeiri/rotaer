// import { cache } from 'react';
import { QueryClient } from '@tanstack/react-query';

const getQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
export default getQueryClient;
