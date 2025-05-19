import { env } from '../env';

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = `${env.VITE_GRAPH_SERVER_URL}${path}`;

  const mergedOptions: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.headers ?? {}),
    },
  };

  return fetch(url, mergedOptions);
}
