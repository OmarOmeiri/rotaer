import { colors } from './colors';
// import { modalStyles } from './modals';

const main = {
  paddingY: '0rem',
  paddingX: '0rem',
};

const container = {
  paddingY: '0rem',
  paddingX: '2rem',
};

const scrollBar = {
  width: 6,
  height: 6,
  track: {
    bg: 'rgba(0, 0, 0, 0.2)',
  },
  thumb: {
    bg: colors.green,
    borderRadius: 20,
    border: `1px solid ${colors.grey}`,
  },
};

const navBar = {
  colors: {
    bg: colors.dark,
    text: colors.lightGreen,
    textHover: colors.white,
  },
  icons: {
    colors: {
      bg: colors.grey,
      stroke: colors.lightGreen,
      fill: colors.lightGreen,
    },
    size: 30,
    borderRadius: 3,
  },
  dropdown: {
    colors: {
      bg: colors.grey,
      border: colors.white,
    },
    borderRadius: 5,
    borderWidth: 2,
  },
  height: 60,
  fontWeight: 'bold',
  fontSize: '1.1rem',
};

const mainMenu = {
  colors: {
    bg: navBar.colors.bg,
    text: navBar.colors.text,
    textHover: navBar.colors.textHover,
  },
  icons: {
    colors: {
      bg: navBar.icons.colors.bg,
      stroke: navBar.icons.colors.stroke,
      fill: navBar.icons.colors.fill,
    },
    size: navBar.icons.size,
    margin: 10,
    borderRadius: navBar.icons.borderRadius,
  },
  dropdown: {
    colors: {
      bg: navBar.dropdown.colors.bg,
      border: navBar.dropdown.colors.border,
    },
    borderRadius: navBar.dropdown.borderRadius,
    borderWidth: navBar.dropdown.borderWidth,
  },
  width: '20%',
  minWidth: 200,
  maxWidth: 350,
  fontWeight: 'bold',
  fontSize: '1.1rem',
  padding: `${navBar.height}px 0 0 0`,
};

const footer = {
  height: 255,
};

export const stylesConfig = {
  styles: {
    colors,
    main,
    scrollBar,
    container,
    navBar,
    mainMenu,
    // modal: modalStyles,
    footer,
  },
};
