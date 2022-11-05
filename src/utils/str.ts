export const randomKey = (name = '') => {
  return `${name}${name ? '-' : ''}${Date.now()}-${Math.round(
    Math.random() * 1000
  )}`;
};

export const uniqueKey = (name = '') => {
  return `${name}${name ? '-' : ''}${Date.now()}-${Math.round(
    Math.random() * 1000
  )}`;
};
