const sum = (zeroParam) => (firstParam) =>
  Number.isFinite(firstParam) ? sum(zeroParam + firstParam) : zeroParam;

export default sum;
