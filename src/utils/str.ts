export const randomKey = (name = '') => {
  return `${name}-${Date.now()}-${Math.random()}`;
};
