import { useEffect } from 'react';

// Sets the browser tab title, like "Trainees | Dojo".
export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | Dojo`;
  }, [title]);
};
