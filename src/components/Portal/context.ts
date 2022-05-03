let portalId = 0;

export const getPortalId = () => {
  return `portal-${portalId++}`;
};
