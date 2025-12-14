type FormatDateOptions = {
  showTime?: boolean;
};
export function formatDate(dateString: string | number | Date, options?: FormatDateOptions) {
  const { showTime = false } = options || {};
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(showTime && { hour: '2-digit', minute: '2-digit', hour12: false }),
  });
}
