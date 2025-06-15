import { useState, useCallback, useMemo } from 'react';

interface UseSearchOptions {
  initialQuery?: string;
  searchFields?: string[];
  debounceMs?: number;
}

export const useSearch = ({
  initialQuery = '',
  searchFields = [],
  debounceMs = 300,
}: UseSearchOptions = {}) => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);
      const timeoutId = setTimeout(() => {
        setDebouncedQuery(searchQuery);
      }, debounceMs);

      return () => clearTimeout(timeoutId);
    },
    [debounceMs]
  );

  const search = useCallback(
    <T extends Record<string, any>>(items: T[]): T[] => {
      if (!debouncedQuery || searchFields.length === 0) {
        return items;
      }

      const searchTerms = debouncedQuery.toLowerCase().split(' ');

      return items.filter((item) =>
        searchTerms.every((term) =>
          searchFields.some((field) => {
            const value = String(item[field]).toLowerCase();
            return value.includes(term);
          })
        )
      );
    },
    [debouncedQuery, searchFields]
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  const isSearching = useMemo(
    () => debouncedQuery.length > 0,
    [debouncedQuery]
  );

  return {
    query,
    debouncedQuery,
    handleSearch,
    search,
    clearSearch,
    isSearching,
  };
}; 