/* eslint-disable camelcase */
import z from 'zod';
import Translator from '../../utils/Translate/Translator';

const translator = new Translator({
  invalidIcao: { 'en-US': 'Invalid icao code', 'pt-BR': 'ICAO inválido' },
});

export const zodAdIcaoValidator = (value: unknown) => z.string({
  required_error: translator.translate('invalidIcao'),
  invalid_type_error: translator.translate('invalidIcao'),
})
  .min(4, { message: translator.translate('invalidIcao') })
  .max(4, { message: translator.translate('invalidIcao') })
  .parse(value);

