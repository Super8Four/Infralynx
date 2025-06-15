import { useState, useCallback, useMemo } from 'react';

type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';

interface FilterConfig {
  key: string;
  value: string;
  operator: FilterOperator;
}

interface UseFilteringOptions {
  initialFilters?: FilterConfig[];
}

export const useFiltering = ({ initialFilters = [] }: UseFilteringOptions = {}) => {
  const [filters, setFilters] = useState<FilterConfig[]>(initialFilters);

  const addFilter = useCallback((filter: FilterConfig) => {
    setFilters((prevFilters) => [...prevFilters, filter]);
  }, []);

  const removeFilter = useCallback((key: string) => {
    setFilters((prevFilters) =>
      prevFilters.filter((filter) => filter.key !== key)
    );
  }, []);

  const updateFilter = useCallback(
    (key: string, updates: Partial<FilterConfig>) => {
      setFilters((prevFilters) =>
        prevFilters.map((filter) =>
          filter.key === key ? { ...filter, ...updates } : filter
        )
      );
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const filter = useCallback(
    <T extends Record<string, any>>(items: T[]): T[] => {
      if (filters.length === 0) {
        return items;
      }

      return items.filter((item) =>
        filters.every((filter) => {
          const itemValue = String(item[filter.key]).toLowerCase();
          const filterValue = filter.value.toLowerCase();

          switch (filter.operator) {
            case 'equals':
              return itemValue === filterValue;
            case 'contains':
              return itemValue.includes(filterValue);
            case 'startsWith':
              return itemValue.startsWith(filterValue);
            case 'endsWith':
              return itemValue.endsWith(filterValue);
            case 'greaterThan':
              return Number(itemValue) > Number(filterValue);
            case 'lessThan':
              return Number(itemValue) < Number(filterValue);
            default:
              return true;
          }
        })
      );
    },
    [filters]
  );

  const activeFilters = useMemo(
    () => filters.filter((filter) => filter.value !== ''),
    [filters]
  );

  return {
    filters,
    activeFilters,
    addFilter,
    removeFilter,
    updateFilter,
    clearFilters,
    filter,
  };
}; 