import { useState, useCallback } from 'react';

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: string;
  direction: SortDirection;
}

interface UseSortingOptions {
  initialSortKey?: string;
  initialSortDirection?: SortDirection;
}

export const useSorting = ({
  initialSortKey = '',
  initialSortDirection = 'asc',
}: UseSortingOptions = {}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: initialSortKey,
    direction: initialSortDirection,
  });

  const sort = useCallback(
    <T extends Record<string, any>>(items: T[]): T[] => {
      if (!sortConfig.key) {
        return items;
      }

      return [...items].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === bValue) {
          return 0;
        }

        const comparison = aValue > bValue ? 1 : -1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    },
    [sortConfig]
  );

  const requestSort = useCallback((key: string) => {
    setSortConfig((currentSort) => {
      if (currentSort.key === key) {
        return {
          key,
          direction:
            currentSort.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return {
        key,
        direction: 'asc',
      };
    });
  }, []);

  const clearSort = useCallback(() => {
    setSortConfig({
      key: '',
      direction: 'asc',
    });
  }, []);

  return {
    sortConfig,
    sort,
    requestSort,
    clearSort,
  };
}; 