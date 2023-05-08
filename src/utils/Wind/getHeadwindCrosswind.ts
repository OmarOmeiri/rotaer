export const getHeadwindCrossWind = (speed: number, direction: number, refCoord: number) => {
  const diff = refCoord - direction;
  return {
    headwind: Number((speed * Math.cos(diff * (Math.PI / 180))).toFixed(2)),
    crosswind: Number((speed * Math.sin(diff * (Math.PI / 180)) * -1).toFixed(2)),
  };
};
