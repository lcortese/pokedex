type Type = 'bad-request' | 'not-found' | 'forbidden' | 'unauthorized' | 'unknown';

export class ApiError extends Error {
  public type: Type;

  private data?: unknown;

  constructor(code?: number, data?: unknown) {
    let type: Type = 'unknown';

    if (code === 400) {
      type = 'bad-request';
    } else if (code === 401) {
      type = 'unauthorized';
    } else if (code === 403) {
      type = 'forbidden';
    } else if (code === 404) {
      type = 'not-found';
    }

    const newData = Object(data);
    super(newData?.message ? newData?.message : type);

    this.type = type;
    this.data = data;
  }

  public getData<T>() {
    return this.data as Partial<T> | undefined;
  }
}