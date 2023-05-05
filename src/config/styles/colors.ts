/* eslint-disable camelcase */
const app_colors = {
  black: '#13151cff',
  dark: '#15171a',
  darklight: '#2b2e32',
  grey: '#707070ff',
  lightGrey: '#bdbdbd',
  green: '#43b843ff',
  greenBright: '#00CC00',
  lightGreen: '#d5e8d2ff',
  white: '#faf9f7ff',
  offWhite: '#eaeaea',
  rgb: {
    black: '19, 21, 28',
    dark: '21, 23, 26',
    darklight: '43, 46, 50',
    grey: '112, 112, 112',
    lightGrey: '189, 189, 189',
    green: '67, 184, 67',
    greenBright: '0, 204, 0',
    lightGreen: '213, 232, 210',
    white: '250, 249, 247',
    offWhite: '234, 234, 234',
  },
};

const aerodrome_colors = {
  aerodromes: {
    AD: {
      color: app_colors.green,
      content: { 'pt-BR': 'Aeródromo', 'en-US': 'Aerodrome' },
    },
    HP: {
      color: '#e2c15d',
      content: { 'pt-BR': 'Heliponto', 'en-US': 'Helipad' },
    },
    HD: {
      color: '#5da4e2',
      content: { 'pt-BR': 'Plataforma', 'en-US': 'Platform' },
    },
    other: {
      color: '#e2835d',
      content: { 'pt-BR': 'Outros', 'en-US': 'Other' },
    },
  },
};

export const colors = {
  ...app_colors,
  ...aerodrome_colors,
};
