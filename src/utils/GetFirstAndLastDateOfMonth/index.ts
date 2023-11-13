export function getFirstAndLastDateOfMonth(date: Date) {
  const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { firstDate, lastDate };
}

export function buildDate(date?: string) {
  if (!date) return new Date();

  const [year, month, day] = date.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day));
}
