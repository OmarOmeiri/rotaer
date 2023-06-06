import { ZodError } from 'zod';
import Translator from '../../utils/Translate/Translator';

const translator = new Translator({
  genericInvalid: { 'en-US': 'Invalid value', 'pt-BR': 'Valor inválido' },
});
export const getZodErrorMessage = (error: Error | ZodError) => {
  let msg = '';
  if (error instanceof ZodError) {
    msg = error.issues[0].message;
  } else {
    msg = error.message;
  }
  return msg || translator.translate('genericInvalid');
};
