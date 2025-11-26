const API_BASE_URL = import.meta.env.VITE_API_URL;

const successInterceptors: Function[] = [];
const errorInterceptors: Function[] = [];

function addSuccessInterceptor(interceptor: Function) {
  successInterceptors.push(interceptor);
}
function addErrorInterceptor(interceptor: Function) {
  errorInterceptors.push(interceptor);
}

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      ...options.headers
    }
  }

  try {
    const response = await fetch(url, config);

    const data = await response.json();
    data.status ??= response.status;
    if (!response.ok) {
      throw data || `API error: ${response.status}`;
    }

    successInterceptors.forEach(interc => interc(data));
    return data;
  } catch (err) {
    if (err.status == 401)
      localStorage.removeItem('token');
    console.error(`API request failed: ${url}`, err);

    errorInterceptors.forEach(interc => interc(err));
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

  addSuccessInterceptor,
  addErrorInterceptor,
  request
};
