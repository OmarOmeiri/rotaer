import { useCallback } from 'react';
import { LocalStorageKeys, LocalStorageTypes } from '../config/localStorage';

export const useLocalStorage = () => {
  const getLocalStorage = useCallback(<T extends LocalStorageKeys>(
    key: T,
  ): LocalStorageTypes<T> | null => {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key) as null | Stringified<LocalStorageTypes<T>>;
      if (!item) return null;
      return JSON.parse(item);
    }
    return null;
  }, []);

  const setLocalStorage = useCallback(<T extends LocalStorageKeys>(key: T, value: LocalStorageTypes<T>): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, []);

  const removeLocalStorage = useCallback((key: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }, []);

  return {
    getLocalStorage,
    setLocalStorage,
    removeLocalStorage,
  };
};
