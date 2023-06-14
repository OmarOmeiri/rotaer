import { CurveFactory } from 'd3';
import AreaLine, { ID3AreaLine } from '../AreaLine/AreaLine';

export type ID3Line<D extends Record<string, unknown>> = Omit<ID3AreaLine<D>, 'type' | 'curve'> & {
  curve?: CurveFactory
}
class Line<
D extends Record<string, unknown>,
> extends AreaLine<D> {
  constructor(params: ID3Line<D>) {
    super({
      ...params,
      type: 'line',
    });
  }
}

export default Line;
