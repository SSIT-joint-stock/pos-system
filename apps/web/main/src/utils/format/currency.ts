export function formatCurrency<T>(currency: T) {
  return Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Number(currency));
}

export const formatCompactNumber = (number: number) => {
  if (number < 1000) return number.toString();

  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number);
};
