import z from 'zod';
import Translator from '../../utils/Translate/Translator';

const translator = new Translator({
  invalidAlt: { 'en-US': 'Invalid altitude', 'pt-BR': 'Altitude inválida' },
});

export const zodAltitudeValidator = (value: unknown) => z.string({
  required_error: translator.translate('invalidAlt'),
  invalid_type_error: translator.translate('invalidAlt'),
}).or(z.number({
  required_error: translator.translate('invalidAlt'),
  invalid_type_error: translator.translate('invalidAlt'),
}))
  .refine((value) => {
    const num = Number(value);
    if (Number.isNaN(num)) return false;
    if (num < 500) return false;
    if (num > 50000) return false;
    return true;
  }, { message: translator.translate('invalidAlt') })
  .transform((value) => Number(value))
  .parse(value);

