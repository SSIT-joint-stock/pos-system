type FormatDateOptions = {
  showTime?: boolean;
};

export function formatDate(dateInput: string | number | Date, options?: FormatDateOptions) {
  const { showTime = false } = options || {};
  const date = new Date(dateInput);

  const datePart = date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (!showTime) return datePart;

  const timePart = date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `lúc ${timePart}, ${datePart}`;
}
