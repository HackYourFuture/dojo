import { useEffect, useState } from 'react';

/**
 * A React hook that sets a timeout as a debounce time for the search box when typing.
 *
 * @param {any} value value coming form search 
 * @param {number} delay the number of ms to delay
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounce(value: any, delay: number) {
  const [debounceValue, setDebounceValue] = useState();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounceValue;
}
