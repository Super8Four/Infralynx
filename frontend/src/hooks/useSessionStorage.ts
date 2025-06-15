import { useState, useEffect, useCallback } from 'react';

interface UseSessionStorageOptions<T> {
  key: string;
  initialValue: T;
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
}

export const useSessionStorage = <T>({
  key,
  initialValue,
  serializer = JSON.stringify,
  deserializer = JSON.parse,
}: UseSessionStorageOptions<T>) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? deserializer(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.sessionStorage.setItem(key, serializer(valueToStore));
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, serializer, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(deserializer(event.newValue));
        } catch (error) {
          console.error(`Error deserializing sessionStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, deserializer]);

  return {
    value: storedValue,
    setValue,
    removeValue,
  };
}; 