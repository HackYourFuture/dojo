import { useCallback } from 'react';

/**
 * A React hook that calls `onReachEnd` when an element at the end of a list scrolls into view.
 * Returns the ref to put on that element.
 *
 * @param {() => void} onReachEnd called to load more items.
 * @param {boolean} isEnabled whether more items can be loaded right now.
 */
export const useInfiniteScroll = (onReachEnd: () => void, isEnabled: boolean) => {
  return useCallback(
    (element: HTMLElement | null) => {
      if (!element || !isEnabled) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) onReachEnd();
        },
        { rootMargin: '400px' } // Start loading before the user reaches the end.
      );
      observer.observe(element);
      return () => observer.disconnect();
    },
    [onReachEnd, isEnabled]
  );
};
