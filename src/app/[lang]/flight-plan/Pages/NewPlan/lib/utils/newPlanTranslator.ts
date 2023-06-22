import Translator from '../../../../../../../utils/Translate/Translator';

const newFlightPlanTranslator = new Translator({
  adNotFound: { 'en-US': 'Aerodrome not found', 'pt-BR': 'Aeródromo não encontrado' },
  invalidAcft: { 'en-US': 'Aircraft data is not valid.', 'pt-BR': 'Aeronave inválida.' },
  acftSave: { 'en-US': 'Aircraft saved successfully.', 'pt-BR': 'Aeronave salva com sucesso.' },
  acftSaveFail: { 'en-US': 'Could not save aircraft data.', 'pt-BR': 'Houve um erro ao salvar a aeronave.' },
  map: { 'en-US': 'Map', 'pt-BR': 'Mapa' },
  noRouteToSave: { 'en-US': 'You must fill the route to save.', 'pt-BR': 'Preencha os dados para salvar.' },
  couldNotSave: { 'en-US': 'There was an error while saving your flight plan.', 'pt-BR': 'Houve um erro ao salvar o plano.' },
  saved: { 'en-US': 'Flight plan saved successfully.', 'pt-BR': 'Plano salvo com sucesso.' },
  edited: { 'en-US': 'Flight plan edited successfully.', 'pt-BR': 'Plano editado com sucesso.' },
  cloned: { 'en-US': 'Flight plan cloned successfully.', 'pt-BR': 'Plano clonado com sucesso.' },
  userPlanNotFound: { 'en-US': 'There was an error while loading flight plan.', 'pt-BR': 'Houve um erro ao carregar o plano.' },
});

export default newFlightPlanTranslator;
