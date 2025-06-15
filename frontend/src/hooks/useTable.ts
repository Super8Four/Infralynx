import { useMemo } from 'react';
import { usePagination } from './usePagination';
import { useSorting } from './useSorting';
import { useFiltering } from './useFiltering';
import { useSearch } from './useSearch';

interface UseTableOptions<T> {
  data: T[];
  initialPage?: number;
  initialPageSize?: number;
  searchFields?: string[];
  initialSortKey?: string;
  initialSortDirection?: 'asc' | 'desc';
  initialFilters?: Array<{
    key: string;
    value: string;
    operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
  }>;
}

export const useTable = <T extends Record<string, any>>({
  data,
  initialPage = 1,
  initialPageSize = 10,
  searchFields = [],
  initialSortKey = '',
  initialSortDirection = 'asc',
  initialFilters = [],
}: UseTableOptions<T>) => {
  const {
    currentPage,
    pageSize,
    totalPages,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
  } = usePagination({
    initialPage,
    initialPageSize,
    totalItems: data.length,
  });

  const { sortConfig, sort, requestSort } = useSorting({
    initialSortKey,
    initialSortDirection,
  });

  const {
    filters,
    activeFilters,
    addFilter,
    removeFilter,
    updateFilter,
    clearFilters,
    filter,
  } = useFiltering({
    initialFilters,
  });

  const {
    query,
    debouncedQuery,
    handleSearch,
    search,
    clearSearch,
    isSearching,
  } = useSearch({
    searchFields,
  });

  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (isSearching) {
      result = search(result);
    }

    // Apply filters
    if (activeFilters.length > 0) {
      result = filter(result);
    }

    // Apply sorting
    if (sortConfig.key) {
      result = sort(result);
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    result = result.slice(startIndex, endIndex);

    return result;
  }, [
    data,
    isSearching,
    search,
    activeFilters,
    filter,
    sortConfig.key,
    sort,
    currentPage,
    pageSize,
  ]);

  return {
    // Data
    data: processedData,
    totalItems: data.length,

    // Pagination
    currentPage,
    pageSize,
    totalPages,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,

    // Sorting
    sortConfig,
    requestSort,

    // Filtering
    filters,
    activeFilters,
    addFilter,
    removeFilter,
    updateFilter,
    clearFilters,

    // Search
    query,
    debouncedQuery,
    handleSearch,
    clearSearch,
    isSearching,
  };
}; 