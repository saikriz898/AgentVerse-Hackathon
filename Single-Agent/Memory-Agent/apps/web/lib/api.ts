const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export function normalizeArray<T = any>(input: any): T[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (Array.isArray(input.data)) return input.data;
  if (Array.isArray(input.items)) return input.items;
  if (Array.isArray(input.results)) return input.results;
  if (Array.isArray(input.records)) return input.records;
  if (Array.isArray(input.payload)) return input.payload;
  if (Array.isArray(input.result)) return input.result;
  if (input.data && Array.isArray(input.data.data)) return input.data.data;
  if (input.data && Array.isArray(input.data.result)) return input.data.result;
  return [];
}

export async function fetchApi(endpoint: string, options: RequestInit = {}, retries = 1): Promise<any> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const workspaceId = typeof window !== 'undefined' ? localStorage.getItem('workspaceId') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (workspaceId) headers['x-workspace-id'] = workspaceId;

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      if (res.status === 401 && typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      const errorData = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(errorData.error || 'Network error');
    }

    return await res.json();
  } catch (err: any) {
    if (retries > 0 && (err.name === 'TypeError' || err.message?.includes('fetch'))) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return fetchApi(endpoint, options, retries - 1);
    }
    throw err;
  }
}
