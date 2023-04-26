/* eslint-disable require-jsdoc */
import { cloneDeep } from 'lodash';
import { isObjectLiteral } from 'lullo-utils/Objects';
import { findIndexes } from 'lullo-utils/Arrays';

const isObjectArray = <T extends Record<string, unknown>>(
  val: unknown[],
): val is T[] => (
    val.length > 0 && val.every((e) => isObjectLiteral(e))
  );

export function AddIfMIssingOrRemoveIfExists<
T extends Record<string, unknown>,
K extends keyof T
>(
  arr: T[],
  value: T,
  key: K,
): T[]
export function AddIfMIssingOrRemoveIfExists<
T extends Exclude<Primitives, symbol>,
>(
  arr: T[],
  value: T,
  key?: undefined,
): T[]
export function AddIfMIssingOrRemoveIfExists<
T extends Record<string, unknown> | Exclude<Primitives, symbol>,
K extends keyof T
>(
  arr: T[],
  value: T,
  key?: K,
): T[] {
  let ix = -1;
  const copy = cloneDeep(arr);
  if (isObjectArray(arr)) {
    if (!key) throw new Error('Key missing');
    ix = (copy as Record<string, unknown>[])
      .findIndex((e) => (
        e[key as string] === value[key]
      ));
  } else {
    ix = copy.findIndex((e) => e === value);
  }

  if (ix > -1) {
    copy.splice(ix, 1);
    return copy;
  }
  copy.push(value);
  return copy;
}

export const MutateStateArray = <T>(
  state: T[],
  finder: (value: T, i: number) => boolean,
  mutate: (value: T) => Partial<T>,
  options: { multi?: boolean } = {},
): T[] => {
  const ixs = [
    options.multi
      ? findIndexes(state, finder)
      : state.findIndex(finder),
  ].flat().filter((i) => i >= 0);
  if (!ixs.length) return state;
  const copy = [...state];
  for (const ix of ixs) {
    copy[ix] = { ...copy[ix], ...mutate(copy[ix]) };
  }
  return copy;
};

export const MutateStateArrayAll = <T>(
  state: T[],
  mutate: (value: T) => Partial<T>,
): T[] => state.map((s) => ({ ...s, ...mutate(s) }));
