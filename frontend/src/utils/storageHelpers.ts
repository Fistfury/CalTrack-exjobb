export const saveToLocalStorage = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const removeFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
export const saveToLocalStorageWithExpiry = (
  key: string,
  value: unknown,
  ttl: number
) => {
  const now = Date.now();
  const item = {
    value,
    expiry: now + ttl, // TTL in milliseconds
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getFromLocalStorageWithExpiry = <T>(key: string): T | null => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  if (Date.now() > item.expiry) {
    removeFromLocalStorage(key);
    return null;
  }

  return item.value;
};
