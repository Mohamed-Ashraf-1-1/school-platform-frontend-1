import api from './api.js';

/**
 * All three reference resources (governorates, partners, specializations) share
 * the exact same REST shape on the backend, so we build one factory instead of
 * duplicating the same 5 functions three times.
 */
export function buildReferenceService(resource) {
  return {
    list: (params = {}) => {
      const cleaned = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      );
      return api.get(`/${resource}`, { params: cleaned });
    },
    getById: (id) => api.get(`/${resource}/${id}`),
    create: (payload) => api.post(`/${resource}`, payload),
    update: (id, payload) => api.put(`/${resource}/${id}`, payload),
    remove: (id) => api.delete(`/${resource}/${id}`),
  };
}
