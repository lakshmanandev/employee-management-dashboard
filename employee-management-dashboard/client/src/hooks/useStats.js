import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios.js';

/**
 * Fetches the aggregated analytics from GET /api/employees/stats/summary.
 * Returns the stats object plus loading/error flags and a refresh() so the
 * Dashboard can re-pull totals after any create/update/delete.
 */
export const useStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/employees/stats/summary');
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refresh: fetchStats };
};
