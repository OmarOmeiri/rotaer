export function nodeEnv(check?: undefined): NODE_ENV
export function nodeEnv(check: NODE_ENV): boolean
/**
 * Returns the node Env if no arguments passed.
 * Returns boolean if an env is passed
 * @param check
 * @returns
 */
export function nodeEnv(check?: NODE_ENV): NODE_ENV | boolean {
  const env = process.env.NODE_ENV;
  if (check) return check.trim() === env;
  return env;
}
