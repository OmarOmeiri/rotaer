import dayjs from 'dayjs';
import { round } from 'lullo-utils/Math';
import {
  ID3Attrs,
  ID3ShapeAttrs,
  ID3TooltipDataMulti,
} from '../../../types';

import type {
  DensityData,
} from '../Density';

let tooltipTimeout: NodeJS.Timeout | null = null;

export const filterDensityTooltipValues = <D extends Record<string, [number, number][]>>(
  data: DensityData[],
  xVal: string | number | Date | null,
  defaultAttrs: ID3ShapeAttrs<D> | ID3Attrs<D>,
): ID3TooltipDataMulti<D> | undefined => {
  if (!tooltipTimeout) {
    const tooltipData = data.reduce((merged, dt) => {
      const dataWithAttributes = dt.data.reduce((values, d, i) => {
        let isMatch = false;
        if (typeof xVal === 'object' && (xVal as any).getTime) {
          isMatch = dayjs(d[0]).isSame(xVal, 'day');
        } else if (typeof xVal === 'number') {
          isMatch = round(d[0], 2) === round(xVal, 2);
        }

        if (!isMatch) return values;
        return {
          data: {
            ...values.data,
            [dt.attrs.id]: d,
          },
          attrs: {
            ...values.attrs,
            [dt.attrs.id]: {
              ...defaultAttrs,
              ...dt.attrs,
            },
          },
        };
      }, {} as ID3TooltipDataMulti<D>);

      return {
        data: {
          ...merged.data,
          ...dataWithAttributes.data,
        },
        attrs: {
          ...merged.attrs,
          ...dataWithAttributes.attrs,
        },
      };
    }, {} as ID3TooltipDataMulti<D>);
    if (!Object.keys(tooltipData.data).length || !Object.keys(tooltipData.attrs).length) {
      return undefined;
    }

    tooltipTimeout = setTimeout(() => {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
      tooltipTimeout = null;
    }, 100);
    return tooltipData;
  }
};
