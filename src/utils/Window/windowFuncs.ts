export const isClientSide = () => typeof window === 'object';
export const isServerSide = () => typeof window === 'undefined';

export const getWindowProp = <K extends keyof typeof window>(
  prop: K,
  fallback: typeof window[K],
): typeof window[K] => {
  if (isServerSide()) return fallback;
  return window[prop];
};
