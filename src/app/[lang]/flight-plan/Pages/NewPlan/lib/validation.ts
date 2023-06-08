import z from 'zod';
import Translator from '../../../../../../utils/Translate/Translator';
import { FlightPlanEditableIds } from '../../../types';
import {
  acftClimbRateValidator, acftDescentRateValidator, acftFuelFlowValidator, acftIASValidator, acftUsableFuelValidator,
} from '../../../../../../frameworks/zod/zodAcft';
import { zodAdIcaoValidator } from '../../../../../../frameworks/zod/zodAerodrome';

const translator = new Translator({
  invalidAltitude: { 'en-US': 'Invalid altitude', 'pt-BR': 'Altitude inválida' },
  invalidIas: { 'en-US': 'Invalid IAS', 'pt-BR': 'VI inválida' },
  invalidWind: { 'en-US': 'Invalid wind', 'pt-BR': 'Vento inválido' },
  genericInvalid: { 'en-US': 'Invalid data', 'pt-BR': 'Dados inválidos' },
});

export const userWaypointInputValidators = {
  altitude: (input: string, key: FlightPlanEditableIds) => z.string({
    required_error: translator.translate('invalidAltitude'),
    invalid_type_error: translator.translate('invalidAltitude'),
  })
    .refine((value) => {
      const valTr = value
        .trim()
        .replace(/ft$/i, '');
      const altNum = Number(valTr);
      if (Number.isNaN(altNum)) return false;
      if (altNum < 500) return false;
      if (altNum > 50000) return false;
      return true;
    }, { message: translator.translate('invalidAltitude') })
    .transform((val) => {
      const valTr = val
        .trim()
        .replace(/ft$/i, '');
      return { [key]: Number(valTr) };
    }).parse(input),
  ias: (input: string, key: FlightPlanEditableIds) => z.string({
    required_error: translator.translate('invalidIas'),
    invalid_type_error: translator.translate('invalidIas'),
  })
    .refine((value) => {
      const valTr = value
        .trim()
        .replace(/kt$/i, '');
      const speedNum = Number(valTr);
      if (Number.isNaN(speedNum)) return false;
      if (speedNum < 30) return false;
      if (speedNum > 1500) return false;
      return true;
    }, { message: translator.translate('invalidIas') })
    .transform((val) => {
      const valTr = val
        .trim()
        .replace(/kt$/, '');
      return { [key]: Number(valTr) };
    }).parse(input),
  wind: (input: string, _key: FlightPlanEditableIds) => z.string({
    required_error: translator.translate('invalidWind'),
    invalid_type_error: translator.translate('invalidWind'),
  })
    .refine((value) => {
      const [dir, speed] = value
        .split('/')
        .map((s) => Number(s.replace(/(°|kt)$/i, '').trim()));
      if (Number.isNaN(dir) || Number.isNaN(speed)) return false;
      if (dir < 0 || dir > 360) return false;
      if (speed < 0 || speed > 100) return false;
      return true;
    }, { message: translator.translate('invalidWind') })
    .transform((val) => {
      const [windDirection, windSpeed] = val
        .split('/')
        .map((s) => Number(s.replace(/(°|kt)$/i, '').trim()));
      return { windSpeed, windDirection };
    }).parse(input),
};

export const newFlightPlanAcftValidator = {
  ias: acftIASValidator,
  climbFuelFlow: acftFuelFlowValidator,
  descentFuelFlow: acftFuelFlowValidator,
  cruiseFuelFlow: acftFuelFlowValidator,
  climbRate: acftClimbRateValidator,
  descentRate: acftDescentRateValidator,
  usableFuel: acftUsableFuelValidator,
};

export const flightPlanInfoValidators = {
  name: () => true,
  dep: (value: string) => (value ? (
    zodAdIcaoValidator(value)
  ) : value),
  arr: (value: string) => (value ? (
    zodAdIcaoValidator(value)
  ) : value),
  altrn: (value: string) => (value ? (
    zodAdIcaoValidator(value)
  ) : value),
};
