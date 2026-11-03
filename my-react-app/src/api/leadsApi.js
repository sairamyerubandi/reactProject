// In development Vite forwards /api to the backend (see the proxy in vite.config.js)
const BASE_URL = '/api/leads'

const SERVER_DOWN_MESSAGE = 'Could not reach the server. Please check that the backend is running.'

// Send a request and return the parsed JSON. Failed requests throw an Error that has
// the server's message, plus `details` (field name -> message) for validation errors.
async function request(path, { method = 'GET', body } = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error(SERVER_DOWN_MESSAGE)
  }

  // A DELETE returns no content, and a proxy error may not be JSON, so an empty result is fine here
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(data?.error || SERVER_DOWN_MESSAGE)
    error.details = data?.details
    throw error
  }
  return data
}

export const leadsApi = {
  getAll: (params) => request(`?${new URLSearchParams(params)}`),
  getStats: () => request('/stats'),
  getById: (id) => request(`/${id}`),
  create: (lead) => request('', { method: 'POST', body: lead }),
  update: (id, changes) => request(`/${id}`, { method: 'PATCH', body: changes }),
  remove: (id) => request(`/${id}`, { method: 'DELETE' }),
  addNote: (id, body) => request(`/${id}/notes`, { method: 'POST', body: { body } }),
}
