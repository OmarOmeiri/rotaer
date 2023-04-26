import Config from '@/config';

const { colors } = Config.get('styles');
export const tableStyles = Object.freeze({
  header: {
    height: '65px',
    background: colors.dark,
    color: colors.green,
    sortingIndicator: {
      color: colors.lightGreen,
    },
    resizer: {
      hoverColor: colors.lightGreen,
      resizingColor: colors.green,
    },
    controlIcons: {
      color: colors.lightGrey,
      appliedColor: '#f16a6a',
    },
    tooltip: {
      titleColor: colors.green,
      titleBorder: `1px solid ${colors.green}`,
      background: colors.darklight,
      color: colors.white,
    },
    dragHeaderIndicator: {
      color: colors.lightGreen,
    },
    border: {
      vertical: {
        style: 'solid',
        width: '1px',
        color: `rgba(${colors.rgb.white}, 0.02)`,
      },
      horizontal: {
        style: 'solid',
        width: '1px',
        color: `rgba(${colors.rgb.white}, 0.02)`,
      },
    },
  },
  body: {
    color: colors.white,
    fontSize: '1rem',
    minHeight: '0',
    row: {
      background: {
        odd: '#2B2E32',
        even: '#404145',
      },
      height: '60px',
      border: {
        vertical: {
          style: 'solid',
          width: '1px',
          color: `rgba(${colors.rgb.white}, 0.02)`,
        },
        horizontal: {
          style: 'solid',
          width: '0',
          color: `rgba(${colors.rgb.white}, 0.02)`,
        },
      },
    },
  },
});

export type TableStyles = typeof tableStyles
