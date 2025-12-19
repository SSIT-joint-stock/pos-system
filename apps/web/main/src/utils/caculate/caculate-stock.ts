import { STOCK_MOVEMENT_CONFIG } from '../../constants/status';

export function calculateNewOnHand(current: number, delta: number, type?: string) {
  if (!type || !delta) return current;

  const config = STOCK_MOVEMENT_CONFIG[type];
  if (!config) return current;

  const quantity = config.usesAbsoluteValue ? Math.abs(delta) : delta;

  return config.isIncoming ? current + quantity : current - quantity;
}
