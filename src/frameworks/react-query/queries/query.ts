/* eslint-disable react-hooks/exhaustive-deps */
import {
  MyQuery,
  QueryKey,
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  useCallback,
} from 'react';

export const useMyQuery = <
TQueryFnData = unknown,
TError = unknown,
TData = TQueryFnData,
TQueryKey extends QueryKey = QueryKey,
>(options: Omit<
  UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  'initialData'
> & { initialData?: () => undefined, invalidationKeys?: any }) => {
  const query = useQuery(options);
  const client = useQueryClient();

  const invalidate = useCallback(() => {
    const keys = options.invalidationKeys || options.queryKey;
    if (keys) {
      client
        .invalidateQueries(options.invalidationKeys || options.queryKey);
    }
  }, [
    client,
    JSON.stringify(options.queryKey),
    JSON.stringify(options.invalidationKeys),
  ]);

  (query as MyQuery<TData, TError>).invalidate = invalidate;

  return query as MyQuery<TData, TError>;
};
