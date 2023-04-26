import { devKeys, keys } from './keys';
import {
  stylesConfig,
} from './styles/styles';

const mainConfig = {
  name: 'FinWiz',
  version: '0.0.1',
};

const common = {
  ...mainConfig,
  ...stylesConfig,
};

const configDev = {
  ...common,
  keys: devKeys,
};

const config = {
  ...common,
  keys,
};

export type AppConfig = typeof config;

export const cfg: {
  test: typeof configDev,
  production: typeof config,
  development: typeof configDev
} = {
  test: Object.freeze(configDev),
  production: Object.freeze(config),
  development: Object.freeze(configDev),
};
