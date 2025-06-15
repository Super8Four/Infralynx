import { useState, useEffect, useCallback } from 'react';

interface CookieOptions {
  expires?: Date | number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

interface UseCookieOptions<T> {
  key: string;
  initialValue: T;
  options?: CookieOptions;
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
}

export const useCookie = <T>({
  key,
  initialValue,
  options = {},
  serializer = JSON.stringify,
  deserializer = JSON.parse,
}: UseCookieOptions<T>) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const cookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${key}=`));

      if (cookie) {
        const value = cookie.split('=')[1];
        return deserializer(decodeURIComponent(value));
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading cookie "${key}":`, error);
      return initialValue;
    }
  });

  const setCookie = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        const serializedValue = serializer(valueToStore);
        const encodedValue = encodeURIComponent(serializedValue);

        let cookieString = `${key}=${encodedValue}`;

        if (options.expires) {
          const expires =
            options.expires instanceof Date
              ? options.expires
              : new Date(Date.now() + options.expires * 1000);
          cookieString += `; expires=${expires.toUTCString()}`;
        }

        if (options.path) {
          cookieString += `; path=${options.path}`;
        }

        if (options.domain) {
          cookieString += `; domain=${options.domain}`;
        }

        if (options.secure) {
          cookieString += '; secure';
        }

        if (options.sameSite) {
          cookieString += `; samesite=${options.sameSite}`;
        }

        document.cookie = cookieString;
      } catch (error) {
        console.error(`Error setting cookie "${key}":`, error);
      }
    },
    [key, options, serializer, storedValue]
  );

  const removeCookie = useCallback(() => {
    try {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${
        options.path ? `; path=${options.path}` : ''
      }${options.domain ? `; domain=${options.domain}` : ''}`;
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing cookie "${key}":`, error);
    }
  }, [key, options, initialValue]);

  useEffect(() => {
    const handleCookieChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.key === key) {
        try {
          const value = customEvent.detail.value;
          setStoredValue(deserializer(value));
        } catch (error) {
          console.error(`Error deserializing cookie "${key}":`, error);
        }
      }
    };

    window.addEventListener('cookieChange', handleCookieChange);
    return () => window.removeEventListener('cookieChange', handleCookieChange);
  }, [key, deserializer]);

  return {
    value: storedValue,
    setValue: setCookie,
    removeValue: removeCookie,
  };
}; 