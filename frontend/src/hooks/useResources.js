import { useState, useEffect, useCallback } from 'react';
import { getResourcesApi } from '../services/resources.api.js';

export const useResources = (initialFilters = {}) => {
  const [resources, setResources] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    offerType: 'All',
    condition: 'All',
    availability: 'All',
    sort: 'newest',
    page: 1,
    ...initialFilters,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getResourcesApi(filters);
      setResources(response.data.resources || []);
      setPagination(response.data.pagination || { total: 0, page: 1, totalPages: 1 });
    } catch (err) {
      setError(err.message || 'Failed to fetch resources.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1, // Reset to page 1 on filter/search change
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      offerType: 'All',
      condition: 'All',
      availability: 'All',
      sort: 'newest',
      page: 1,
    });
  };

  return {
    resources,
    pagination,
    filters,
    loading,
    error,
    updateFilter,
    resetFilters,
    refresh: fetchResources,
  };
};
