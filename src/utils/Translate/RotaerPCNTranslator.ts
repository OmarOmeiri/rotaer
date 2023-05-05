import Translator from './Translator';

const rotaerPCNPavementTranslator = new Translator({
  R: { 'pt-BR': 'Rígido', 'en-US': 'Rigid' },
  F: { 'pt-BR': 'Flexível', 'en-US': 'Flexible' },
}, false);

const rotaerPCNSubGradeTranslator = new Translator({
  A: { 'pt-BR': 'Alta', 'en-US': 'High' },
  B: { 'pt-BR': 'Média', 'en-US': 'Medium' },
  C: { 'pt-BR': 'Baixa', 'en-US': 'Low' },
  D: { 'pt-BR': 'Ultra baixa', 'en-US': 'Ultra low' },
}, false);

const rotaerPCNTirePressureTranslator = new Translator({
  W: { 'pt-BR': 'Ilimitada', 'en-US': 'Unlimited' },
  X: { 'pt-BR': '1.75MPa', 'en-US': '1.75MPa' },
  Y: { 'pt-BR': '1.25MPa', 'en-US': '1.25MPa' },
  Z: { 'pt-BR': '0.5MPa', 'en-US': '0.5MPa' },
}, false);

const rotaerPCNEvalMethodTranslator = new Translator({
  T: { 'pt-BR': 'Técnica', 'en-US': 'Technical' },
  U: { 'pt-BR': 'Empirica', 'en-US': 'Empiric' },
}, false);

const rotaerPCNTranslator = {
  pavement: rotaerPCNPavementTranslator,
  subGrade: rotaerPCNSubGradeTranslator,
  tirePressure: rotaerPCNTirePressureTranslator,
  evalMethod: rotaerPCNEvalMethodTranslator,
};

export default rotaerPCNTranslator;
