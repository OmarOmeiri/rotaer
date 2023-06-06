import { UseQueryResult } from '@tanstack/react-query';
declare module '@tanstack/react-query' {
  type MyQuery<
    TData = unknown,
    TError = unknown,
  > = UseQueryResult<TData, TError> & {
    invalidate(): void
  }
}

