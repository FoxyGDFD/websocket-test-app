import type { CursorData } from '@entities/cursor/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
) {
  let last = 0;
  return (...args: Parameters<typeof fn>) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args);
    }
  };
}

export function hasSignificantChange(
  prev: CursorData,
  next: CursorData,
  threshold: number = 1
) {
  return (
    Math.abs(prev.x - next.x) > threshold ||
    Math.abs(prev.y - next.y) > threshold
  );
}
