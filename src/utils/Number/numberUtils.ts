import { round } from 'lullo-utils/Math';

type CashFormat = {
  revert: () => number,
  toString: () => string
}
const multipliers = {
  K: 1e3,
  M: 1e6,
  B: 1e9,
  T: 1e12,
};

export const cashFormatPattern = /\b^(-)?\d+(\.|,)?\d*(K|M|B|T)?$\b/i;
const multiplerPattern = /(K|M|B|T)/i;

const toCashFormat = (num: number, str: string): CashFormat => ({
  revert() { return num; },
  toString() { return str; },
});

export const formatCash = (n: number, precision = 1): CashFormat => {
  const num = Number(n);
  if (Number.isNaN(num)) return toCashFormat(n, 'NaN');
  if (n < 0) {
    return toCashFormat(n, `-${formatCash(-1 * n)}`);
  }
  if (n < 1e3) return toCashFormat(n, n.toString());
  if (n >= 1e3 && n < 1e6) return toCashFormat(n, `${+(n / multipliers.K).toFixed(precision)}K`);
  if (n >= 1e6 && n < 1e9) return toCashFormat(n, `${+(n / multipliers.M).toFixed(precision)}M`);
  if (n >= 1e9 && n < 1e12) return toCashFormat(n, `${+(n / multipliers.B).toFixed(precision)}B`);

  return toCashFormat(n, `${+(n / multipliers.T).toFixed(precision)}T`);
};

export const deFormatCash = (val: string): number => {
  const trimmed = val.trim();
  const mult = multipliers[
    (trimmed.match(multiplerPattern) || [''])[0].toUpperCase() as keyof typeof multipliers
  ] || 1;
  return Number(trimmed.replace(multiplerPattern, '')) * mult;
};

export const asPercentage = (num: number, rnd = 2): string => (
  `${round(num * 100, rnd)}%`
);
