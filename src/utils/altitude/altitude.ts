const isRight = (magHeading: number) => {
  if (magHeading === 360) return true;
  return magHeading >= 0 && magHeading < 179;
};

const vfr = {
  right: [
    3500,
    5500,
    7500,
    9500,
    11500,
    13500,
  ],
  left: [
    4500,
    6500,
    8500,
    10500,
    12500,
    14500,
  ],
};

const ifr = {
  right: [
    2000,
    4000,
    6000,
    8000,
    10000,
    12000,
    14000,
    16000,
    18000,
    20000,
    22000,
    24000,
    26000,
    28000,
    30000,
    32000,
    34000,
    36000,
    38000,
    40000,
    43000,
    47000,
    51000,
  ],
  left: [
    3000,
    5000,
    7000,
    9000,
    11000,
    13000,
    15000,
    17000,
    19000,
    21000,
    23000,
    25000,
    27000,
    29000,
    31000,
    33000,
    35000,
    37000,
    39000,
    41000,
    45000,
    49000,
    53000,
  ],
};

const getNearestGt = (arr: number[], val: number) => {
  for (const v of arr) {
    if (v >= val) return v;
  }
  return arr[arr.length - 1];
};

export const getNearestAllowedAltitude = (
  magHeading: number,
  alt: number,
  isVfr = true,
) => {
  if (isRight(magHeading)) {
    return getNearestGt(isVfr ? vfr.right : ifr.right, alt);
  }
  return getNearestGt(isVfr ? vfr.left : ifr.left, alt);
};

export const isValidAltitude = (
  magHeading: number,
  alt: number,
  isVfr = true,
) => {
  if (isRight(magHeading)) {
    return (isVfr ? vfr.right : ifr.right).includes(alt);
  }
  return (isVfr ? vfr.left : ifr.left).includes(alt);
};
