export const isEmpty = (value: unknown): boolean => {
  if (value == null) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return true;
  if (typeof value === 'number' && (value === 0 || isNaN(value))) return true;
  if (typeof value === 'boolean' && value === false) return true;
  return false;
}
