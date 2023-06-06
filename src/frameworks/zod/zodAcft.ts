import z from 'zod';
import Translator from '../../utils/Translate/Translator';

const translator = new Translator({
  ias: { 'en-US': 'Cruise IAS (kt)', 'pt-BR': 'VI de cruzeiro (kt)' },
  climb: { 'en-US': 'Climb rate (ft/min)', 'pt-BR': 'Razão de subida (ft/min)' },
  descent: { 'en-US': 'Descent rate (ft/min)', 'pt-BR': 'Razão de descida (ft/min)' },
  fuel: { 'en-US': 'Usable fuel (L)', 'pt-BR': 'Combustível utilizável (L)' },
  climbFuelFlow: { 'en-US': 'Climb fuel flow (L/h)', 'pt-BR': 'Consumo de subida (L/h)' },
  cruiseFuelFlow: { 'en-US': 'Cruise fuel flow (L/h)', 'pt-BR': 'Consumo de cruzeiro (L/h)' },
  descentFuelFlow: { 'en-US': 'Descent fuel flow (L/h)', 'pt-BR': 'Consumo de descida (L/h)' },
  fuelFlowInvalid: { 'en-US': 'Invalid fuel flow.', 'pt-BR': 'Consumo inválido.' },
  iasInvalid: { 'en-US': 'Invalid IAS', 'pt-BR': 'VI inválida' },
  climbInvalid: { 'en-US': 'Invalid climb rate', 'pt-BR': 'Razão de subida inválida' },
  descentInvalid: { 'en-US': 'Invalid descent rate', 'pt-BR': 'Razão de descida inválida' },
  fuelInvalid: { 'en-US': 'Invalid usable fuel', 'pt-BR': 'Combustível utilizável inválido' },
});

export const acftFuelFlowValidator = (value: string) => {
  const num = value === '' ? undefined : Number(String(value).trim());
  return z.number({
    invalid_type_error: translator.translate('fuelFlowInvalid'),
  })
    .min(1, translator.translate('fuelFlowInvalid'))
    .max(15000, translator.translate('fuelFlowInvalid'))
    .refine((value) => !Number.isNaN(Number(value)), { message: translator.translate('fuelFlowInvalid') })
    .optional()
    .parse(num);
};

export const acftIASValidator = (value: string) => {
  const num = value === '' ? undefined : Number(String(value).trim());
  return z.number({
    invalid_type_error: translator.translate('iasInvalid'),
  })
    .min(30, translator.translate('iasInvalid'))
    .max(1500, translator.translate('iasInvalid'))
    .refine((value) => !Number.isNaN(Number(value)), { message: translator.translate('iasInvalid') })
    .optional()
    .parse(num);
};

export const acftClimbRateValidator = (value: string) => {
  const num = value === '' ? undefined : Number(String(value).trim());
  return z.number({
    invalid_type_error: translator.translate('climbInvalid'),
  })
    .min(30, translator.translate('climbInvalid'))
    .max(5000, translator.translate('climbInvalid'))
    .refine((value) => !Number.isNaN(Number(value)), { message: translator.translate('climbInvalid') })
    .optional()
    .parse(num);
};

export const acftDescentRateValidator = (value: string) => {
  const num = value === '' ? undefined : Number(String(value).trim());
  return z.number({
    invalid_type_error: translator.translate('descentInvalid'),
  })
    .min(30, translator.translate('descentInvalid'))
    .max(5000, translator.translate('descentInvalid'))
    .refine((value) => !Number.isNaN(Number(value)), { message: translator.translate('descentInvalid') })
    .optional()
    .parse(num);
};

export const acftUsableFuelValidator = (value: string) => {
  const num = value === '' ? undefined : Number(String(value).trim());
  return z.number({
    invalid_type_error: translator.translate('fuelInvalid'),
  })
    .min(5, translator.translate('fuelInvalid'))
    .refine((value) => !Number.isNaN(Number(value)), { message: translator.translate('fuelInvalid') })
    .optional()
    .parse(num);
};
