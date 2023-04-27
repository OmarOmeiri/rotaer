export const removeNonNumericChars = (str: string) => str.replace(/[^0-9.]/g, '');

export const strToChunks = (str: string, n: number) => {
  const splitString = [];
  for (let i = 0; i < str.length; i += n) {
    splitString.push(str.slice(i, i + n));
  }
  return splitString;
};

