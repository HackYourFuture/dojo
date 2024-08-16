import { useEffect, useState } from 'react';

/**
 * A React hook that sets a timeout as a debounce time for the search box when typing.
 *
 * @param {string} value string value coming form search
 * @param {number} delay the number of ms to delay
 */

export function useDebounce(value: string, delay: number): string {
  const [debounceValue, setDebounceValue] = useState<string>('');

  useEffect(() => {
    if (!value) {
      return;
    }
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounceValue;
}
