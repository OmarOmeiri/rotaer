import process from 'process';

const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

/**
 * Returns the type of environment.
 * @returns boolean
 */
export default function isDev(): boolean {
  return development;
}
