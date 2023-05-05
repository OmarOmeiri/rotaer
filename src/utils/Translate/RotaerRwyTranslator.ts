import Translator from './Translator';

const rotaerRWYSurfaceTranslator = new Translator({
  AÇO: { 'pt-BR': 'Aço', 'en-US': 'Steel' },
  CIN: { 'pt-BR': 'Cinza', 'en-US': 'Ash' },
  MTAL: { 'pt-BR': 'Metálico', 'en-US': 'Metalic' },
  ARE: { 'pt-BR': 'Areia', 'en-US': 'Sand' },
  CONC: { 'pt-BR': 'Concreto', 'en-US': 'Concrete' },
  PAR: { 'pt-BR': 'Paralelepípedo', 'en-US': 'Curbstone' },
  ARG: { 'pt-BR': 'Argila', 'en-US': 'Clay' },
  GRASS: { 'pt-BR': 'Grama', 'en-US': 'Grass' },
  PIÇ: { 'pt-BR': 'Piçarra', 'en-US': 'Slate' },
  ASPH: { 'pt-BR': 'Asfalto ou Conc. Asfáltico', 'en-US': 'Asphalt' },
  GRVL: { 'pt-BR': 'Cascalho', 'en-US': 'Gravel' },
  SAI: { 'pt-BR': 'Saibro', 'en-US': 'Fine clay' },
  BAR: { 'pt-BR': 'Barro', 'en-US': 'Dirt' },
  MAC: { 'pt-BR': 'Macadame', 'en-US': 'Macadam' },
  SIL: { 'pt-BR': 'Sílica', 'en-US': 'Silica' },
  TIJ: { 'pt-BR': 'Tijolo', 'en-US': 'Bricks' },
  MAD: { 'pt-BR': 'Madeira', 'en-US': 'Wood' },
  TER: { 'pt-BR': 'Terra', 'en-US': 'Dirt' },
}, false);

export default rotaerRWYSurfaceTranslator;
