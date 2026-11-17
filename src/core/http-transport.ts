import { queryStringify } from '../utils/query-string';
import { createHttpError, NetworkError, TimeoutError } from './http-errors';

const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

type Method = (typeof METHODS)[keyof typeof METHODS];

const DEFAULT_TIMEOUT = 5000;

interface RequestOptions {
  data?: Record<string, unknown> | FormData;
  headers?: Record<string, string>;
  timeout?: number;
}

type HTTPMethod = <Response = unknown>(url: string, options?: RequestOptions) => Promise<Response>;

function parseResponse(xhr: XMLHttpRequest): unknown {
  const contentType = xhr.getResponseHeader('Content-Type') ?? '';

  if (!contentType.includes('application/json')) {
    return xhr.responseText;
  }

  try {
    return JSON.parse(xhr.responseText);
  } catch {
    return xhr.responseText;
  }
}

function getErrorReason(response: unknown, statusText: string): string {
  const hasReason = typeof response === 'object' && response !== null && 'reason' in response;

  if (hasReason && typeof response.reason === 'string') {
    return response.reason;
  }

  return statusText;
}

function buildUrl(url: string, method: Method, data: RequestOptions['data']): string {
  const shouldAddQuery = method === METHODS.GET && data !== undefined && !(data instanceof FormData);

  return shouldAddQuery ? `${url}${queryStringify(data)}` : url;
}

export class HTTPTransport {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  get: HTTPMethod = (url, options = {}) => this.request(url, METHODS.GET, options);

  post: HTTPMethod = (url, options = {}) => this.request(url, METHODS.POST, options);

  put: HTTPMethod = (url, options = {}) => this.request(url, METHODS.PUT, options);

  delete: HTTPMethod = (url, options = {}) => this.request(url, METHODS.DELETE, options);

  private request<Response>(url: string, method: Method, options: RequestOptions): Promise<Response> {
    const { data, headers = {}, timeout = DEFAULT_TIMEOUT } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open(method, `${this.baseUrl}${buildUrl(url, method, data)}`);
      xhr.withCredentials = true;
      xhr.timeout = timeout;

      Object.entries(headers).forEach(([name, value]) => {
        xhr.setRequestHeader(name, value);
      });

      xhr.onload = () => {
        const response = parseResponse(xhr);
        const isSuccess = xhr.status >= 200 && xhr.status < 300;

        if (isSuccess) {
          resolve(response as Response);
          return;
        }

        reject(createHttpError(xhr.status, getErrorReason(response, xhr.statusText)));
      };

      xhr.onerror = () => reject(new NetworkError());
      xhr.ontimeout = () => reject(new TimeoutError(timeout));

      if (method === METHODS.GET || data === undefined) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      }
    });
  }
}
