// import { cache } from 'react';
import { QueryClient } from '@tanstack/react-query';

class MyQueryClient {
  static client: QueryClient;
  static init() {
    MyQueryClient.client = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    });
    return MyQueryClient.client;
  }
}

export default MyQueryClient;
