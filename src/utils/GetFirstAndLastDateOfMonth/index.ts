export function getFirstAndLastDateOfMonth(date: Date) {
  const firstDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  const lastDate = new Date(date.getFullYear(), date.getMonth() + 2, 0);
  return { firstDate, lastDate };
}
