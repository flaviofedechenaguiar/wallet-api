export const round = function (value: number, places: number): number {
  return +(Math.round(Number(value + 'e+' + places)) + 'e-' + places);
};
