import { isDate } from 'lullo-utils/Date';
import { round } from 'lullo-utils/Math';
import { formatDate } from '../../../../utils/format/date';

export const D3FormatCrosshair = (value: string | number | Date): string => {
  if (typeof value === 'string' && !Number.isNaN(Number(value))) {
    return value;
  }

  if (typeof value === 'number' || !Number.isNaN(Number(value))) {
    return String(round(Number(value), 2));
  }
  if (isDate(value)) {
    return formatDate(value);
  }

  return value;
};
