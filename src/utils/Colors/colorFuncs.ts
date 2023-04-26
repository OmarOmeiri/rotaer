import { chunkStr } from 'lullo-utils/String';

export const isHexColor = (color: string): boolean => (
  /^#(?:[0-9a-fA-F]{3,4}){1,2}$/i.test(color)
);

export const isRgbColor = (color: string) => (
  /rgba?\(\s*(25[0-5]|2[0-4]\d|1\d{1,2}|\d\d?)\s*,\s*(25[0-5]|2[0-4]\d|1\d{1,2}|\d\d?)\s*,\s*(25[0-5]|2[0-4]\d|1\d{1,2}|\d\d?)\s*,?\s*([01.]\.?\d*)?\s*\)/i
    .test(color)
);

interface IRandomColorProps {
  excludeSimilar?: string,
  minDistance?: number,
}
/**
 * Generates a random HEX color.
 *
 * IMPORTANT: This function will try 30 times to find a color with a distance higher than "minDistance", so DO NOT be to restrictive
 * values higher than 320 are risky!
 * @param [excludeSimilar] - optional a color to be excluded by the random color generator
 * @param [minDistance] - optional The minimum distance between the excludeSimilar and the generated color to be returned. High distance = more different colors. Values between 150 and 150 work fine for differentiating colors.
 * @returns
 */
export const randomHexColorWithDistanceExclusion = ({
  excludeSimilar,
  minDistance,
}: IRandomColorProps): string => {
  let color = randomHexColor();
  if (!excludeSimilar || !minDistance) {
    return `#${color}`;
  }
  let distance = 0;
  let counter = 0;
  while (distance < minDistance && counter <= 30) {
    color = randomHexColor();
    distance = calcEuclDistanceBetweenHexColors(color, excludeSimilar);
    counter += 1;
  }
  return `#${color}`;
};

/**
 * Generates unique colors from an index
 * @param n
 * @returns
 */
export function getUniqueColor(n: number) {
  const rgb = [0, 0, 0];

  for (let i = 0; i < 24; i++) {
    // eslint-disable-next-line no-bitwise
    rgb[i % 3] <<= 1;
    // eslint-disable-next-line no-bitwise
    rgb[i % 3] |= n & 0x01;
    // eslint-disable-next-line no-bitwise, no-param-reassign
    n >>= 1;
  }
  return `#${rgb.reduce((a, c) => (c > 0x0f ? c.toString(16) : `0${c.toString(16)}`) + a, '')}`;
}

/**
 * Calculates the euclidian distance between two hex colors
 * @param hex1
 * @param hex2
 */
export function calcEuclDistanceBetweenHexColors(hex1: string, hex2: string): number {
  const [r1, g1, b1] = chunkStr(hex1.replace('#', ''), 2);
  const [r2, g2, b2] = chunkStr(hex2.replace('#', ''), 2);
  const distance = Math.sqrt(
    (
      singleHexToRGB(r1)
      - singleHexToRGB(r2)
    ) ** 2
    + (
      singleHexToRGB(g1)
      - singleHexToRGB(g2)
    ) ** 2
    + (
      singleHexToRGB(b1)
      - singleHexToRGB(b2)
    ) ** 2,
  );
  return distance;
}

/**
 * generates a random HEX color
 * @returns
 */
export function randomHexColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

/**
 * Receives a hex color code and return its color value
 * @param singleHex a single color. eg: 'ff' or 'aa'
 * @returns
 */
export const singleHexToRGB = (singleHex: string): number => parseInt(singleHex, 16);

export const randomColorBetween = (rgb1: number[], rgb2: number[]) => {
  const rgb3 = [];
  // eslint-disable-next-line no-bitwise
  for (let i = 0; i < 3; i++) rgb3[i] = rgb1[i] + Math.random() * (rgb2[i] - rgb1[i]) | 0;
  return `#${rgb3
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')}`;
};

/**
 * Converts a HEX color to RGB
 * @param hex
 * @returns
 */
export function hexToRgb(
  hex: string,
  overrides: {
    r?: number | string,
    g?: number | string,
    b?: number | string,
    a?: number | string
  } = {},
): {
  r: number,
  g: number,
  b: number,
  a: number,
  toString: () => string
} {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  // Repeats the characters if the hex color is shorthand. Eg: "#F0C" => "#FF00CC"
  const fullHex = hex.replace(shorthandRegex, (m: string, r: string, g: string, b: string) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(fullHex);
  if (!result) throw new Error(`Color: "${hex}" is invalid.`);
  return {
    r: Number(overrides.r) || parseInt(result[1], 16),
    g: Number(overrides.g) || parseInt(result[2], 16),
    b: Number(overrides.b) || parseInt(result[3], 16),
    a: Number(overrides.a) || parseInt(result[4] || 'FF', 16) / 255,
    toString() {
      return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    },
  };
}

export const opacityToHex = (n: number | string) => {
  const num = (Math.min(Math.max(Number(n), 0), 1) * 255);
  if (Number.isNaN(num)) return 'ff';
  return num.toString(16).padStart(2, '0').slice(0, 2);
};

export const cssColorNameToHex = (str: string) => {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) throw new Error('Could not create canvas.');
  ctx.fillStyle = str;
  return ctx.fillStyle;
};

export const shadeRGB = (val: string | number[], pct: number) => {
  let arr: number[];
  if (Array.isArray(val)) {
    arr = val;
  } else {
    arr = val.split(',').map((v) => Number(v.trim()));
    if (
      arr.length !== 3
      || arr.some((v) => Number.isNaN(v))
    ) {
      throw new Error(`Unknown RGB value: ${val}`);
    }
  }

  if (pct > 1) {
    return arr.map((v) => (255 - v) * (1 - (1 / pct)))
      .map((v, i) => v + arr[i]).join(', ');
  }
  return arr.map((v) => v * pct).join(', ');
};

export const colorToRgba = (
  color: string,
  overrides: {
    r?: number | string,
    g?: number | string,
    b?: number | string,
    a?: number | string
  } = {},
) => {
  if (isHexColor(color)) return hexToRgb(color, overrides);
  if (!isRgbColor(color)) {
    return hexToRgb(cssColorNameToHex(color), overrides);
  }
  const digits = color.match(/\b(\d+\.\d+)|(\d+)\b/g);
  if (!digits) throw new Error(`Color: "${color}" is invalid.`);
  const [r, g, b, a = '1'] = digits;
  return {
    r: Number(overrides.r) || Number(r),
    g: Number(overrides.g) || Number(g),
    b: Number(overrides.b) || Number(b),
    a: Number(overrides.a) || Number(a),
    toString() {
      return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    },
  };
};
