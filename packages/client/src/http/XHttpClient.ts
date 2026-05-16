/**
 * Custom HTTP Client for XAOCS.
 * Wraps fetch with default options for cookies and JSON.
 */
export class XHttpClient {
  constructor(private baseUrl: string = '') {}

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    
    const response = await fetch(url, {
      ...options,
      credentials: options.credentials ?? 'include', // Enable cookies by default
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || response.statusText);
    }

    if (response.status === 204) return {} as T;
    
    return response.json() as Promise<T>;
  }

  get<T>(path: string, options?: RequestInit) {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, body?: unknown, options?: RequestInit) {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(path: string, body?: unknown, options?: RequestInit) {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T>(path: string, options?: RequestInit) {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export const xhttp = new XHttpClient();

