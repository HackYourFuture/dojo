import { useEffect, useState } from 'react';

// The value once it stopped changing for the delay in ms.
export function useDebounce(value: string, delay: number): string {
  const [debounceValue, setDebounceValue] = useState<string>('');

  useEffect(() => {
    // Clearing the text is not delayed, so the results close right away.
    const handler = setTimeout(() => setDebounceValue(value), value ? delay : 0);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounceValue;
}
