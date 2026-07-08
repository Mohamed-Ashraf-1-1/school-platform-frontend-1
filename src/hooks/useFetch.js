import { useCallback, useEffect, useState } from 'react';

/**
 * Generic data-fetching hook: runs `fetcher` whenever `deps` change,
 * exposes { data, meta, loading, error, refetch }.
 */
export function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, meta: null, loading: true, error: null });

  const run = useCallback(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetcher()
      .then((res) => {
        if (cancelled) return;
        setState({ data: res?.data ?? null, meta: res?.meta ?? null, loading: false, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({ data: null, meta: null, loading: false, error: err?.message || 'Error' });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => run(), [run]);

  return { ...state, refetch: run };
}
