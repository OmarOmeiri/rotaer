import Translator from './Translator';

const rotaerFuelTranslator = new Translator({
  PF: { 'pt-BR': 'AVGAS', 'en-US': 'AVGAS' },
  TF: { 'pt-BR': 'Querosene', 'en-US': 'Kerosene' },
}, false);

const rotaerServTranslator = new Translator({
  S1: { 'pt-BR': 'Hangar', 'en-US': 'Hangar' },
  S2: { 'pt-BR': 'Hangar e pequenos reparos em aeronaves', 'en-US': 'Hangar and minor aircraft repairs' },
  S3: { 'pt-BR': 'Hangar e pequenos reparos em aeronaves e motores', 'en-US': 'Hangar and minor aircraft/engine repairs' },
  S4: { 'pt-BR': 'Hangar e grandes reparos em aeronaves; e pequenos reparos em motores', 'en-US': 'Hangar and major aircraft repair; minor engine repair' },
  S5: { 'pt-BR': 'Hangar e grandes reparos em aeronaves e motores.', 'en-US': 'Hangar and major aircraft/engine repair' },
}, false);

const rotaerFuelAndServicesTranslator = {
  fuel: rotaerFuelTranslator,
  serv: rotaerServTranslator,
};

export default rotaerFuelAndServicesTranslator;
