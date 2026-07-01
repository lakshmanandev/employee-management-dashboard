import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms
 * have passed without a change. Used for the search box so we fire one API
 * request after the user stops typing instead of on every keystroke.
 */
export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    // Clear the pending timer if `value` changes again before `delay` elapses.
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
};
