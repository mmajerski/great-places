export const formatPrice = (price: number) => {
  const formatPrice = Math.round(price / 100);

  return `$${formatPrice}`;
};
