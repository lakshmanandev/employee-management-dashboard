import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios.js';
import { PAGE_SIZE } from '../constants.js';

/**
 * Encapsulates loading the paginated employee list. Accepts a `params`
 * object (page + any filters). Exposes data, loading/error flags, and a
 * `refresh()` used after create/update/delete to re-pull the current page.
 *
 * Designed so Phase 4's search/department/status filters just become extra
 * keys on `params` — no change needed here.
 */
export const useEmployees = (params) => {
  const [employees, setEmployees] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { page = 1, search = '', department = '', status = '' } = params;

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/employees', {
        params: {
          page,
          limit: PAGE_SIZE,
          // Only send filters that are set, to keep the query string clean.
          ...(search && { search }),
          ...(department && { department }),
          ...(status && { status }),
        },
      });
      setEmployees(data.data);
      setMeta({ total: data.total, totalPages: data.totalPages });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load employees.');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, department, status]);

  // Re-fetch whenever any query parameter changes.
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return { employees, ...meta, loading, error, refresh: fetchEmployees };
};
