export const convertAmountToCurrency = (value: number) => {
  return `$${value.toFixed(2)}`;
};
