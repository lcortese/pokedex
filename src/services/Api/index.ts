import queryString from 'query-string';
import { ApiError } from './ApiError';

type ClassPayload = {
  protocol?: string,
  hostname: string,
  pathname?: string,
};

type RequestPayload = {
  pathname?: string | number,
  parser?: 'blob' | 'json' | 'text' | 'formData',
  query?: Record<string, unknown>
};

const parseQuery = (query: Record<string, unknown>) => {
  return '?' + queryString.stringify(query);
};

class Api {
  private href: string;
    
  constructor({ protocol = 'https', hostname, pathname }: ClassPayload) {
    this.href = [
      `${protocol}:/`,
      hostname,
      pathname,
    ].filter(Boolean).join('/');
  }
    
  public async get<R>({ pathname, parser = 'json', query }: RequestPayload = {}) {
    const href = [
      this.href,
      pathname,
      query && parseQuery(query),
    ].filter(Boolean).join('/');
    const response = await fetch(href);
            
    if (response.ok) {
      try {
        return response[parser]() as R;
      } catch (e) {
        throw new Error(`Unable to response as ${parser}`);
      }
    }

    const errorData = await response[parser]().catch(() => undefined);
    throw new ApiError(response.status, errorData);
  }
}

export default Api;
