const useGlobal =
  typeof window === 'object'
    ? window
    : typeof global === 'object'
    ? global
    : {};

if (typeof (useGlobal as any).Intl === 'undefined') {
  (useGlobal as any).Intl = {};
}

export default (useGlobal as any).Intl;
