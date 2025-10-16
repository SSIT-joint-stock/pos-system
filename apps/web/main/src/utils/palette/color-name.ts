const COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#00C49F',
  '#FF9F43',
  '#7367F0',
  '#EA5455',
  '#28C76F',
  '#9C27B0',
  '#00BCD4',
  '#4CAF50',
  '#F44336',
  '#E91E63',
  '#009688',
  '#CDDC39',
];

// Lưu màu đã gán cho từng name
const colorCache = new Map<string, string>();

export function getColorFromName(name: string) {
  if (colorCache.has(name)) return colorCache.get(name)!;

  const assigned = new Set(colorCache.values());
  const availableColors = COLORS.filter((c) => !assigned.has(c));

  // Lấy màu chưa dùng, hoặc fallback ngẫu nhiên
  const color =
    availableColors.length > 0
      ? availableColors[0]
      : COLORS[Math.floor(Math.random() * COLORS.length)];

  colorCache.set(name, color);
  return color;
}
