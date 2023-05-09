/**
 * Returns localStorage if code is running in browser
 * @param key
 * @param defaultValue
 * @returns
 */
export function getLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item;
  }
  return null;
}

/**
 * Sets localStorage if code is running in browser
 * @param key
 * @param value
 */
export function setLocalStorage(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

/**
 * Removes localStorage item if code is running in browser
 * @param key
 */
export function removeLocalStorage(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}
