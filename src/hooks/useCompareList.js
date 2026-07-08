import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'compare_school_ids';
const MAX_COMPARE = 4;

/**
 * Keeps the "schools selected for comparison" list in localStorage so it
 * survives navigation between the Schools list and the Compare page.
 */
export function useCompareList() {
  const [ids, setIds] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const isSelected = useCallback((id) => ids.includes(id), [ids]);

  const toggle = useCallback((id) => {
    setIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }, []);

  const remove = useCallback((id) => {
    setIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  return { ids, isSelected, toggle, remove, clear, maxReached: ids.length >= MAX_COMPARE };
}
