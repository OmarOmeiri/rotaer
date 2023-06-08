import { inputTypes, type IInput } from '../../../../../../components/Forms/typings';
import Translator from '../../../../../../utils/Translate/Translator';

const translator = new Translator({
  name: { 'pt-BR': 'Nome', 'en-US': 'Name' },
  dep: { 'pt-BR': 'Partida', 'en-US': 'Departure' },
  arr: { 'pt-BR': 'Chegada', 'en-US': 'Arrival' },
  altrn: { 'pt-BR': 'Alternativa', 'en-US': 'Alternate' },
  registration: { 'pt-BR': 'Matrícula', 'en-US': 'Registration' },
  model: { 'pt-BR': 'Modelo', 'en-US': 'Model' },
  ias: { 'pt-BR': 'VI de cruzeiro (kt)', 'en-US': 'Cruise IAS (kt)' },
  climbFuelFlow: { 'pt-BR': 'Consumo de subida (L/min)', 'en-US': 'Climb fuel flow (L/min)' },
  descentFuelFlow: { 'pt-BR': 'Consumo de descida (L/min)', 'en-US': 'Descent fuel flow (L/min)' },
  cruiseFuelFlow: { 'pt-BR': 'Consumo de cruzeiro (L/min)', 'en-US': 'Cruise fuel flow (L/min)' },
  climbRate: { 'pt-BR': 'Razão de subida (ft/min)', 'en-US': 'Climb rate (ft/min)' },
  descentRate: { 'pt-BR': 'Razão de descida (ft/min)', 'en-US': 'Descent rate (ft/min)' },
  usableFuel: { 'pt-BR': 'Combustível utilizável (L)', 'en-US': 'Usable fuel (L)' },
});

export const newFlightPlanInfoFormData = {
  name: '',
  dep: '',
  arr: '',
  altrn: '',
};

export const newFlightPlanAcftFormData = {
  ias: '',
  climbFuelFlow: '',
  descentFuelFlow: '',
  cruiseFuelFlow: '',
  climbRate: '',
  descentRate: '',
  usableFuel: '',
};

export const newFlightPlanInfoForms: IInput[] = [
  {
    id: 'fplan-name',
    type: inputTypes.text as const,
    name: 'name' as const,
    label: translator.translate('name'),
  },
  {
    id: 'fplan-dep',
    type: inputTypes.text as const,
    name: 'dep' as const,
    label: translator.translate('dep'),
    inputClassName: 'uppercase',
  },
  {
    id: 'fplan-arr',
    type: inputTypes.text as const,
    name: 'arr' as const,
    label: translator.translate('arr'),
    inputClassName: 'uppercase',
  },
  {
    id: 'fplan-altrn',
    type: inputTypes.text as const,
    name: 'altrn' as const,
    label: translator.translate('altrn'),
    inputClassName: 'uppercase',
  },
];

export const newFlightPlanAcftForms: IInput[] = [
  {
    id: 'fplan-ias',
    type: inputTypes.text as const,
    name: 'ias' as const,
    label: translator.translate('ias'),
  },
  {
    id: 'fplan-climb-fuel-flow',
    type: inputTypes.text as const,
    name: 'climbFuelFlow' as const,
    label: translator.translate('climbFuelFlow'),
  },
  {
    id: 'fplan-descent-fuel-flow',
    type: inputTypes.text as const,
    name: 'descentFuelFlow' as const,
    label: translator.translate('descentFuelFlow'),
  },
  {
    id: 'fplan-cruise-fuel-flow',
    type: inputTypes.text as const,
    name: 'cruiseFuelFlow' as const,
    label: translator.translate('cruiseFuelFlow'),
  },
  {
    id: 'fplan-climb-rate',
    type: inputTypes.text as const,
    name: 'climbRate' as const,
    label: translator.translate('climbRate'),
  },
  {
    id: 'fplan-descent-rate',
    type: inputTypes.text as const,
    name: 'descentRate' as const,
    label: translator.translate('descentRate'),
  },
  {
    id: 'fplan-fuel',
    type: inputTypes.text as const,
    name: 'usableFuel' as const,
    label: translator.translate('usableFuel'),
  },
];
