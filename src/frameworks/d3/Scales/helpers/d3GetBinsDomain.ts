import { D3LinearDomain } from '../types';
import { getDomainNumber } from './getDomain';

export const D3GetBinsDomain = ({
  data,
  domainX,
  domainY,
}:{
  data: [number, number][],
  domainX: [number | D3LinearDomain, number | D3LinearDomain],
  domainY: [number | D3LinearDomain, number | D3LinearDomain],
}): {
  x: [number, number],
  y: [number, number]
} => {
  try {
    const xs = data.map(([x]) => x);
    const ys = data.map(([, y]) => y);

    return ({
      x: [getDomainNumber(domainX[0], xs), getDomainNumber(domainX[1], xs)],
      y: [getDomainNumber(domainY[0], ys), getDomainNumber(domainY[1], ys)],
    });
  } catch {
    console.log('data: ', data);
    throw new Error('ahahaha');
  }
};
