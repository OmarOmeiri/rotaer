import Translator from './Translator';

const coordinatesTranslator = new Translator({
  N: { 'pt-BR': 'norte', 'en-US': 'north' },
  NNE: { 'pt-BR': 'norte-nordeste', 'en-US': 'north-northeast' },
  NE: { 'pt-BR': 'nordeste', 'en-US': 'northeast' },
  ENE: { 'pt-BR': 'leste-nordeste', 'en-US': 'east-northeast' },
  E: { 'pt-BR': 'leste', 'en-US': 'east' },
  ESE: { 'pt-BR': 'leste-sudeste', 'en-US': 'east-southeast' },
  SE: { 'pt-BR': 'sudeste', 'en-US': 'southeast' },
  SSE: { 'pt-BR': 'sul-sudeste', 'en-US': 'south-southeast' },
  S: { 'pt-BR': 'sul', 'en-US': 'south' },
  SSW: { 'pt-BR': 'sul-sudoeste', 'en-US': 'south-southwest' },
  SW: { 'pt-BR': 'sudoeste', 'en-US': 'south-southwest' },
  WSW: { 'pt-BR': 'oeste-sudoeste', 'en-US': 'west-southwest' },
  W: { 'pt-BR': 'oeste', 'en-US': 'west' },
  WNW: { 'pt-BR': 'oeste-noroeste', 'en-US': 'west-northwest' },
  NW: { 'pt-BR': 'noroeste', 'en-US': 'northwest' },
  NNW: { 'pt-BR': 'norte-noroeste', 'en-US': 'north-northwest' },
}, false);

export default coordinatesTranslator;
