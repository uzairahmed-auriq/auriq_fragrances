export const formatPrice = (amount: number | string): string => {
  const num = Number(amount) || 0;
  return `Rs ${num.toLocaleString('en-PK')}`;
};
