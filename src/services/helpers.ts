export const extractId = (url: string) =>
  Number(url.split('/').filter(Boolean).pop() || '');
