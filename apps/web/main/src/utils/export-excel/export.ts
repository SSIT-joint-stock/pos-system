export function exportExcel(res: any, fallbackFilename = 'tai_xuong', fallbackType?: string) {
  const disposition = res.headers?.['content-disposition'];

  let filename = fallbackFilename;

  if (disposition) {
    const match =
      disposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i) ||
      disposition.match(/filename\s*=\s*"?([^"]+)"?/i);

    if (match?.[1]) {
      filename = decodeURIComponent(match[1]);
    }
  }

  const blob = new Blob([res.data], fallbackType ? { type: fallbackType } : undefined);

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(url);
}
