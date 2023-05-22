export const extractId = (url: string) => 
  parseInt(url.split('/').filter(Boolean).pop());