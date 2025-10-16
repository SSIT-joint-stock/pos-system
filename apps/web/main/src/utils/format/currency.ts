export function formatCurrency<T>(currency: T) {
  return Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Number(currency));
}
