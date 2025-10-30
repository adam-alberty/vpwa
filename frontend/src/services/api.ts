const API_BASE_URL = import.meta.env.VITE_API_URL;

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')},`,
  };

  try {
    const response = await fetch(url, {
      headers: { ...defaultHeaders, ...(options.headers || {}) },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return response.json();
  } catch (err) {
    console.error(`API request failed: ${url}`, err);
    throw err;
  }
}

export const api = {
  get: (endpoint: string, options?: RequestInit) =>
    request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, data: any, options?: RequestInit) =>
    request(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint: string, data: any, options?: RequestInit) =>
    request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint: string, options?: RequestInit) =>
    request(endpoint, { ...options, method: 'DELETE' }),
};
