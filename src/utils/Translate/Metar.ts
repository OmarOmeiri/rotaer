import { METARGroupNames } from '../METAR/METAR';
import Translator from './Translator';

const mainTranslator = new Translator({
  type: { 'pt-BR': 'Tipo', 'en-US': 'Type' },
  location: { 'pt-BR': 'Local', 'en-US': 'Location' },
  time: { 'pt-BR': 'Horário', 'en-US': 'Time' },
  wind: { 'pt-BR': 'Ventos', 'en-US': 'Wind' },
  visibility: { 'pt-BR': 'Visibilidade', 'en-US': 'Visibility' },
  visibilityValueGt10Km: { 'pt-BR': 'Mais de 10km', 'en-US': 'Over 10km' },
  visibilityVariation: { 'pt-BR': 'Variação de visibilidade', 'en-US': 'Visibility variation' },
  runway: { 'pt-BR': 'Pista', 'en-US': 'runway' },
  max: { 'pt-BR': 'Máx.', 'en-US': 'Max.' },
  min: { 'pt-BR': 'Mín.', 'en-US': 'Min' },
  trend: { 'pt-BR': 'Tendência', 'en-US': 'Trend' },
  sigWeather: { 'pt-BR': 'Tempo significativo', 'en-US': 'Significant weather' },
  recentWeather: { 'pt-BR': 'Tempo recente', 'en-US': 'Recent Weather' },
  clouds: { 'pt-BR': 'Nuvens', 'en-US': 'Clouds' },
  temperature: { 'pt-BR': 'Temperatura', 'en-US': 'Temperature' },
  dewPoint: { 'pt-BR': 'Ponto de orvalho', 'en-US': 'Dewpoint' },
  humid: { 'pt-BR': 'Umidade relativa', 'en-US': 'Relative humidity' },
});

const metarGroupNamesTranslator: {[G in METARGroupNames]: {[L in Langs]:{name: string, desc: string, color: string}}} = {
  header: {
    'pt-BR': { name: 'Cabeçalho', desc: 'Contém o tipo da observação e o identificador do aeródromo.', color: '#42ac5f' },
    'en-US': { name: 'Header', desc: 'Informs the type of observation and the aerodrome identifier.', color: '#42ac5f' },
  },
  time: {
    'pt-BR': { name: 'Horário', desc: 'Informações do horário da observação.', color: '#944fa5' },
    'en-US': { name: 'Time', desc: 'Informs the time of the observation.', color: '#944fa5' },
  },
  auto: {
    'pt-BR': { name: 'Automático', desc: 'Informa se a observação foi realizada de forma automaitizada.', color: '#b75328' },
    'en-US': { name: 'Auto', desc: 'Informs if the observation was obtained automatically.', color: '#b75328' },
  },
  wind: {
    'pt-BR': { name: 'Ventos', desc: 'Contém as informações de vento da observação.', color: '#3398b0' },
    'en-US': { name: 'Wind', desc: 'Contains the current wind information.', color: '#3398b0' },
  },
  visibility: {
    'pt-BR': { name: 'Visibilidade', desc: 'Apresenta as características de visibilidade no local.', color: '#3f7fdc' },
    'en-US': { name: 'Visibility', desc: 'Contains the visibility information.', color: '#3f7fdc' },
  },
  weather: {
    'pt-BR': { name: 'Tempo significativo', desc: 'Contém informações sobre o tempo signifcativo aos vôos.', color: '#3732fc' },
    'en-US': { name: 'Significant weather', desc: 'Informs significant weather for flight safety.', color: '#3732fc' },
  },
  recentWeather: {
    'pt-BR': { name: 'Tempo recente', desc: 'Apresenta os dados sobre tempos significativos que ocorreram recentemente.', color: '#4f4be6' },
    'en-US': { name: 'Recent weather', desc: 'Contains data about significant weather that occurred recently.', color: '#4f4be6' },
  },
  clouds: {
    'pt-BR': { name: 'Nuvens', desc: 'Mostra os dados das nuvens atuais sobre o aeródromo.', color: '#7980ac' },
    'en-US': { name: 'Clouds', desc: 'Shows the current clouds above the aerodrome.', color: '#7980ac' },
  },
  atmosphere: {
    'pt-BR': { name: 'Atmosfera', desc: 'Contém os dados da atmosfera no presente momento.', color: '#a93737' },
    'en-US': { name: 'Atmosphere', desc: 'Contains information about the current atmosphere conditions.', color: '#a93737' },
  },
};

const metarWeatherTranslator = {
  qualifier: new Translator({
    '-': { 'pt-BR': 'leve', 'en-US': 'light' },
    '': { 'pt-BR': 'moderada', 'en-US': 'moderate' },
    '+': { 'pt-BR': 'forte', 'en-US': 'heavy' },
    VC: { 'pt-BR': 'nas vizinhanças', 'en-US': 'in the vicinity' },
  }, false),
  descriptor: new Translator({
    MI: { 'en-US': 'shallow', 'pt-BR': 'baixo' },
    PR: { 'en-US': 'partial', 'pt-BR': 'parcial' },
    BC: { 'en-US': 'patches', 'pt-BR': 'banco' },
    DR: { 'en-US': 'low drifting', 'pt-BR': 'flutuante' },
    BL: { 'en-US': 'blowing', 'pt-BR': 'soprada' },
    SH: { 'en-US': 'shower', 'pt-BR': 'pancada' },
    TS: { 'en-US': 'thunderstorm', 'pt-BR': 'trovoada' },
    FZ: { 'en-US': 'freezing', 'pt-BR': 'congelante' },
  }, false),
  precipitation: new Translator({
    RA: { 'pt-BR': 'chuva', 'en-US': 'rain' },
    DZ: { 'pt-BR': 'chuvisco', 'en-US': 'drizzle' },
    SN: { 'pt-BR': 'neve', 'en-US': 'snow' },
    SG: { 'pt-BR': 'grãos de eneve', 'en-US': 'snow grains' },
    IC: { 'pt-BR': 'cristais de gelo', 'en-US': 'ice crystals' },
    PL: { 'pt-BR': 'pelotas de gelo', 'en-US': 'ice pellets' },
    GR: { 'pt-BR': 'granizo', 'en-US': 'hail' },
    GS: { 'pt-BR': 'granizo pequeno', 'en-US': 'small hail' },
    UP: { 'pt-BR': 'precipitação desconhecida', 'en-US': 'unknown precipitation' },
  }, false),
  obscuration: new Translator({
    FG: { 'pt-BR': 'nevoeiro', 'en-US': 'fog' },
    VA: { 'pt-BR': 'cinza vulcânica', 'en-US': 'volcanic ash' },
    BR: { 'pt-BR': 'névoa úmida', 'en-US': 'mist' },
    HZ: { 'pt-BR': 'névoa seca', 'en-US': 'haze' },
    DU: { 'pt-BR': 'poeira', 'en-US': 'dust' },
    FU: { 'pt-BR': 'fumaça', 'en-US': 'smoke' },
    SA: { 'pt-BR': 'areia', 'en-US': 'sand' },
    PY: { 'pt-BR': 'spray', 'en-US': 'spray' },
  }, false),
  other: new Translator({
    SQ: { 'pt-BR': 'tempestade', 'en-US': 'squall' },
    PO: { 'pt-BR': 'redemoinho de poeira', 'en-US': 'dust or sand whirls' },
    DS: { 'pt-BR': 'tempestade de poeira', 'en-US': 'duststorm' },
    SS: { 'pt-BR': 'tempestade de poeira', 'en-US': 'sandstorm' },
    FC: { 'pt-BR': 'nuvem funil', 'en-US': 'funnel cloud' },
  }, false),
};

const metarCloudTranslator = new Translator({
  NCD: { 'pt-BR': 'sem nuvens', 'en-US': 'no clouds' },
  SKC: { 'pt-BR': 'céu claro', 'en-US': 'sky clear' },
  CLR: { 'pt-BR': 'sem nuvens abaixo de 12.000ft', 'en-US': 'no clouds below 12,000ft ' },
  NSC: { 'pt-BR': 'sem nuvens significativas', 'en-US': 'no significant clouds' },
  FEW: { 'pt-BR': 'poucas nuvens', 'en-US': 'few clouds' },
  SCT: { 'pt-BR': 'parcialmente nublado', 'en-US': 'scattered clouds' },
  BKN: { 'pt-BR': 'nublado', 'en-US': 'broken' },
  OVC: { 'pt-BR': 'encoberto', 'en-US': 'overcast' },
  VV: { 'pt-BR': 'visibilidade vertical', 'en-US': 'vertical visibility' },
}, false);

const metarTranslator = {
  main: mainTranslator,
  groupNames: metarGroupNamesTranslator,
  weather: metarWeatherTranslator,
  clouds: metarCloudTranslator,
};

export default metarTranslator;
