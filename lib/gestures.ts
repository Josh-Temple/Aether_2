import type { TouchEvent } from 'react';
import { useRef } from 'react';

export function useSwipe(onLeft: () => void, onRight: () => void) {
  const startX = useRef<number | null>(null);

  function onTouchStart(event: TouchEvent) {
    startX.current = event.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: TouchEvent) {
    if (startX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? startX.current;
    const delta = endX - startX.current;
    if (delta < -50) {
      onLeft();
    } else if (delta > 50) {
      onRight();
    }
    startX.current = null;
  }

  return { onTouchStart, onTouchEnd };
}
