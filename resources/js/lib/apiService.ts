
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()!.split(';').shift() || null;
  }
  return null;
}

async function ensureCSRF() {
  await fetch('/sanctum/csrf-cookie');
}

async function getCSRFToken(): Promise<string> {
  const token = getCookie('XSRF-TOKEN');
  return decodeURIComponent(token ?? '');
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: unknown
): Promise<T> {
  // Always ensure CSRF before any state-changing requests
  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    await ensureCSRF();
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const csrfToken = await getCSRFToken();
  if (csrfToken) {
    headers['X-XSRF-TOKEN'] = csrfToken;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

const apiService = {
  get: <T>(url: string) => request<T>('GET', url),
  post: <T>(url: string, data: unknown) => request<T>('POST', url, data),
  put: <T>(url: string, data: unknown) => request<T>('PUT', url, data),
  delete: <T>(url: string) => request<T>('DELETE', url),
};

export default apiService;
