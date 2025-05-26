export const calculateProgressValue = (value: number, total: number) => {
  if (!value || !total) return 0;
  return Math.min((value / total) * 100, 100);
};
