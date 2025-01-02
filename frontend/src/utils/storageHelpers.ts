// Save to localStorage with expiry
export const saveToLocalStorageWithExpiry = (
  key: string,
  value: string,
  ttl: number
): void => {
  const now = new Date();
  const item = {
    value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

// Get from localStorage and check expiry
export const getFromLocalStorageWithExpiry = <T>(key: string): T | null => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value as T;
};

// Remove from localStorage
export const removeFromLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};
