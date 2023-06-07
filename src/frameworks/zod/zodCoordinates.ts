import z from 'zod';
import Translator from '../../utils/Translate/Translator';
import { convertUnknownCoordinatesToDecimal, decimalCoordinatesToDegMinSec } from '../../utils/converters/coordinates';

const translator = new Translator({
  invalidCoord: { 'en-US': 'Invalid coordinates', 'pt-BR': 'Coordenadas inválidas' },
});

export const zodCoordinateValidator = (value: unknown) => z.string({
  required_error: translator.translate('invalidCoord'),
  invalid_type_error: translator.translate('invalidCoord'),
})
  .refine((value) => {
    try {
      convertUnknownCoordinatesToDecimal(value);
      return true;
    } catch (error) {
      return false;
    }
  }, { message: translator.translate('invalidCoord') })
  .transform((value) => {
    const decimal = convertUnknownCoordinatesToDecimal(value);
    const degMinSec = decimalCoordinatesToDegMinSec(decimal);
    return { decimal, degMinSec };
  })
  .parse(value);

