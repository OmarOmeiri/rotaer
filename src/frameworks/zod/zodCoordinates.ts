import z from 'zod';
import Translator from '../../utils/Translate/Translator';
import { convertUnknownCoordinatesToDecimal } from '../../utils/converters/coordinates';

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
  .transform((value) => convertUnknownCoordinatesToDecimal(value))
  .parse(value);

