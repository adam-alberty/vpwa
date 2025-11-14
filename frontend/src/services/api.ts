const API_BASE_URL = import.meta.env.VITE_API_URL;

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  try {
    const response = await fetch(url, {
      headers: { ...defaultHeaders, ...(options.headers || {}) },
      ...options,
    });

    const data = await response.json();
    data.status ??= response.status;
    if (!response.ok) {
      throw data || `API error: ${response.status}`;
    }
    return data;
  } catch (err) {
    console.error(`API request failed: ${url}`, err);
    throw err;
  }
}

export default {
  get: (endpoint: string, options?: RequestInit) =>
    request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, data, options?: RequestInit) =>
    request(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint: string, data, options?: RequestInit) =>
    request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint: string, options?: RequestInit) =>
    request(endpoint, { ...options, method: 'DELETE' }),

  request
};
