export const relativeHumidity = ({
  temp,
  dewPoint,
}:{
  temp: number,
  dewPoint: number
}) => {
  const BETA = 17.625;
  const GAMMA = 243.04;
  const dp = Math.E ** ((BETA * dewPoint) / (GAMMA + dewPoint));
  const t = Math.E ** ((BETA * temp) / (GAMMA + temp));
  return 100 * (dp / t);
};

