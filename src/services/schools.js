import api from './api.js';

// GET /schools - list with filters/pagination -> { success, message, data: School[], meta }
export function listSchools(params = {}) {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  );
  return api.get('/schools', { params: cleaned });
}

// GET /schools/:slug -> { success, message, data: School }
export function getSchoolBySlug(slug) {
  return api.get(`/schools/${slug}`);
}

// GET /schools/compare?ids=1,2,3 -> { success, message, data: School[] }
export function compareSchools(ids) {
  return api.get('/schools/compare', { params: { ids: ids.join(',') } });
}

// POST /schools
export function createSchool(payload) {
  return api.post('/schools', payload);
}

// PUT /schools/:id
export function updateSchool(id, payload) {
  return api.put(`/schools/${id}`, payload);
}

// DELETE /schools/:id
export function deleteSchool(id) {
  return api.delete(`/schools/${id}`);
}
