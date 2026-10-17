import { useEffect, useState } from 'react';

// The value once it stopped changing for the delay in ms.
export function useDebounce(value: string, delay: number): string {
  // Starts at the value, so a list opened with a search in its URL loads filtered right away.
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounceValue(value), value ? delay : 0);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  // Clearing the text is not delayed, so the results close right away.
  return value === '' ? '' : debounceValue;
}
