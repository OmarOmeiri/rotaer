export const formatAcftRegistration = (id: string) => {
  if (/[A-Z]{2}-[A-Z]{3}/i.test(id)) return id.toUpperCase();
  return `${id.slice(0, 2)}-${id.slice(2, 5)}`.toUpperCase();
};
