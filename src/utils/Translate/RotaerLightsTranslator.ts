import Translator from './Translator';

const rotaerLightsTranslator = new Translator({
  L1: { 'pt-BR': 'MALS (Sistema de luzes de aproximação de intensidade média, sem flash)', 'en-US': 'MALS (Medium intensity approach lighting system without flash)' },
  L2: { 'pt-BR': 'MALSF. (Sistema de Luzes para aproximação de intensidade média com flash)', 'en-US': 'MALSF (Medium intensity approach lighting system with flash)' },
  L2A: { 'pt-BR': 'MALSR (Sistema de luzes para aproximação de intensidade média com luzes indicadoras de alinhamento de pista', 'en-US': 'MALSR (Medium intenisty approach lighting system with alignment indication)' },
  L3: { 'pt-BR': 'ALS (Sistema de luzes de aproximação sem flash)', 'en-US': 'ALS (Approach lighting sistem without flash)' },
  L4: { 'pt-BR': 'ALSF-1 (ALS Categoria I, com flash)', 'en-US': 'ALSF-1 (ALS cat 1 with flash)' },
  L5: { 'pt-BR': 'ALSF-2 (ALS Categoria II, com flash)', 'en-US': 'ALSF-2 (ALS cat 2 with flash)' },
  L6: { 'pt-BR': 'VASIS (Sistema indicador de rampa de aproximação visual) de 2 barras e rampa de 3°. Quando diferente de 3°, o ângulo de rampa aparecerá entre parênteses, após a indicação L6', 'en-US': 'VASIS (Visual Approach Slope Indicator System) with 2 bars and 3° ramp angle. When different than 3°, it will be between parentheses.' },
  L7: { 'pt-BR': 'VASIS de 3 barras (duas rampas de aproximação). Os ângulos da 1ª e 2ª rampas aparecerão entre parênteses, após a indicação L7', 'en-US': 'VASIS (Visual Approach Slope Indicator System) with 3 bars. The angles between the first and second will be between parentheses.' },
  L8: { 'pt-BR': 'AVASIS (VASIS de duas barras com n° reduzido de caixas). Quando diferente de 3°, o ângulo de rampa aparecerá entre parênteses, após a indicação L8', 'en-US': 'AVASIS (Visual Approach Slope Indicator System) with 2 bars with reduced number of boxes and 3° ramp angle. When different than 3°, it will be between parentheses.' },
  L9: { 'pt-BR': 'PAPI (Sistema Indicador de rampa de aproximação de precisão), com rampa normal de 3°. Quando diferente de 3°, o ângulo de rampa aparecerá entre parênteses, após a indicação L9', 'en-US': 'PAPI (Precision approach path indicator) with 3° ramp angle. When different than 3°, it will be between parentheses.' },
  L9A: { 'pt-BR': 'APAPI (Sistema indicador de rampa de aproximação de precisão simplificada)', 'en-US': 'APAPI (Simplified Precision approach path indicator)' },
  L10: { 'pt-BR': 'REIL (Luzes indicadoras de cabeceira de pista)', 'en-US': 'REIL (Runway End Identifier Lights)' },
  L11: { 'pt-BR': 'Luzes de zona de contato', 'en-US': 'Contact zone indication lights.' },
  L11A: { 'pt-BR': 'Luzes de zona de contato de alta intensidade', 'en-US': 'High intensity contact zone indication lights.' },
  L12: { 'pt-BR': 'Luzes de cabeceira (verde no início e vermelha no fim da pista)', 'en-US': 'Runway threshold indication lights (green at the beginning and red at the end)' },
  L12A: { 'pt-BR': 'Luzes de cabeceira de alta intensidade (verde no início e vermelha no fim da pista)', 'en-US': 'High intensity runway threshold indication lights (green at the beginning and red at the end)' },
  L13: { 'pt-BR': 'Luzes intermitentes de direção de pista', 'en-US': 'Runway direction intermittent lights.' },
  L14: { 'pt-BR': 'Luzes ao longo das laterais da pista, de 60 em 60 metros', 'en-US': 'Runway edge lights every 60m.' },
  L14A: { 'pt-BR': 'Luzes ao longo das laterais da pista de alta intensidade, de 60 em 60 metros', 'en-US': 'High intensity runway edge lights every 60m.' },
  L15: { 'pt-BR': 'Luzes (azuis) de pista de táxi, indicando sua trajetória', 'en-US': 'Blue taxiway edge lights.' },
  L16: { 'pt-BR': 'Refletores na cabeceira da pista, indicando sua localização', 'en-US': 'Runway threshold spot lights.' },
  L17: { 'pt-BR': 'Placas refletoras instaladas ao lado das luzes laterais e de fim-de-pista, que refletem a luz dos faróis de pouso', 'en-US': 'Landing lights reflective sheets.' },
  L18: { 'pt-BR': 'Balizamento de emergência (lampiões colocados ao longo das laterais da pista de 60 em 60 metros)', 'en-US': 'Emergency runway lights.' },
  L19: { 'pt-BR': 'Luzes de eixo-de-pista', 'en-US': 'Runway centerline lights.' },
  L19A: { 'pt-BR': 'Luzes de eixo de pista de alta intensidade', 'en-US': 'High intensity runway centerline lights.' },
  L20: { 'pt-BR': 'Luzes de eixo-de-pista-de-táxi para saída à grande velocidade', 'en-US': 'High speed runway exit lights.' },
  L20A: { 'pt-BR': 'Luzes de eixo-de-pista-de-táxi para saída à grande velocidade, de alta intensidade', 'en-US': 'High intensity high speed runway exit lights.' },
  L21: { 'pt-BR': 'Farol rotativo de aeródromo', 'en-US': 'Aerodrome rotating beacon.' },
  L22: { 'pt-BR': 'Farol de identificação de aeródromo', 'en-US': 'Aerodrome identification lights.' },
  L23: { 'pt-BR': 'Luzes de obstáculo', 'en-US': 'Obstacle lights.' },
  L24: { 'pt-BR': 'Farol de perigo', 'en-US': 'Danger lights.' },
  L25: { 'pt-BR': 'Luzes de contorno de área de aeródromo', 'en-US': 'Aerodrome perimeter lights.' },
  L26: { 'pt-BR': 'Indicador de direção de vento iluminado', 'en-US': 'Illuminated wind direction lights.' },
  L27: { 'pt-BR': 'Luzes de Barra de Parada', 'en-US': 'Stop bar lights.' },
  L30: { 'pt-BR': 'Luzes de limite de área de pouso de helipontos', 'en-US': 'Helipad limit lights.' },
  L31: { 'pt-BR': 'Sinal luminoso de identificação de heliponto', 'en-US': 'Helipad identification lights' },
  L32: { 'pt-BR': 'Faróis de heliponto', 'en-US': 'Helipad lights.' },
  L33: { 'pt-BR': 'Luzes indicadoras de direção de aproximação de heliponto', 'en-US': 'Helipad approach direction lights.' },
  L34: { 'pt-BR': 'Luzes indicadoras de área de toque quadradas de heliponto', 'en-US': 'Helipad square touchdown lights.' },
  L35: { 'pt-BR': 'Luzes indicadoras do ângulo de direção do heliponto', 'en-US': 'Helipad angle direction lights.' },
}, false);

export default rotaerLightsTranslator;
