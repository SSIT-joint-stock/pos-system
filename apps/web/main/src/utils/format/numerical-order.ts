export function numericalOrder(
  idx: number,
  page?: number,
  limit?: number,
  defaultLimit = 10
): number {
  const currentPage = page ?? 1;
  const currentLimit = limit ?? defaultLimit;
  return (currentPage - 1) * currentLimit + idx + 1;
}
