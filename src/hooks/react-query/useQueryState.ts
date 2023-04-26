/* eslint-disable require-jsdoc */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  FetchStatus,
  QueryStatus,
  UseInfiniteQueryResult,
  UseQueryResult,
} from '@tanstack/react-query';
import { useMemo } from 'react';

type BaseQueryState = {
  isLoading: boolean,
  isError: boolean;
  isFetched: boolean;
  fetchStatus: FetchStatus;
  status: QueryStatus;
  isFetching: boolean;
}

export type UseInfiniteQueryState = {
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
} & BaseQueryState

export type UseBaseQueryState = {
  isFetchingNextPage: undefined;
  hasNextPage: undefined;
} & BaseQueryState

export function useQueryState <
T extends UseInfiniteQueryResult<any, any>
>(
  query: T,
): UseInfiniteQueryState
export function useQueryState <
T extends UseQueryResult<any, any> | UseInfiniteQueryResult<any, any>
>(
  query: T,
): UseBaseQueryState
export function useQueryState <
T extends UseQueryResult<any, any> | UseInfiniteQueryResult<any, any>
>(
  query: T,
): UseBaseQueryState | UseInfiniteQueryState
export function useQueryState <
T extends UseQueryResult<any, any> | UseInfiniteQueryResult<any, any>
>(
  query: T,
): UseBaseQueryState | UseInfiniteQueryState {
  return useMemo(() => ({
    isLoading: query.isLoading,
    isError: query.isError,
    isFetched: query.isFetched,
    fetchStatus: query.fetchStatus,
    status: query.status,
    isFetching: query.isFetching,
    isFetchingNextPage: (query as UseInfiniteQueryResult<any, any>).isFetchingNextPage,
    hasNextPage: (query as UseInfiniteQueryResult<any, any>).hasNextPage,
  }), [
    query.isLoading,
    query.isError,
    query.isFetched,
    query.fetchStatus,
    query.status,
    query.isFetching,
    (query as UseInfiniteQueryResult<any, any>).isFetchingNextPage,
    (query as UseInfiniteQueryResult<any, any>).hasNextPage,
  ]);
}
