/* eslint-disable no-restricted-properties */
// eslint-disable-next-line no-restricted-imports
import { AppConfig, cfg } from './config';

class Config {
  private static config: AppConfig;
  private static env: string;

  static init() {
    const env = process.env.NODE_ENV ?? 'development';
    Config.env = env;
    Config.config = cfg[env];
  }

  static get<K extends keyof AppConfig>(key: K, fallback?: AppConfig[K]): AppConfig[K] {
    if (!Config.config) {
      Config.init();
    }
    const val = Config.config[key];
    if (!val && fallback) return fallback;
    return val;
  }
}

export default Config;
