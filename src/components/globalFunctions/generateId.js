export const generateId = (length) =>
  btoa(Math.random()).substring(0, length ? length : 22);
