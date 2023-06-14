import { CurveFactory, CurveFactoryLineOnly } from 'd3';
import AreaLine, { ID3AreaLine } from '../AreaLine/AreaLine';

export type ID3Area<D extends Record<string, unknown>> = Omit<ID3AreaLine<D>, 'type' | 'curve'> & {
  curve?: CurveFactory | CurveFactoryLineOnly
}

class Area<
D extends Record<string, unknown>,
> extends AreaLine<D> {
  constructor(params: ID3Area<D>) {
    super({
      ...params,
      type: 'area',
    });
  }
}

export default Area;
