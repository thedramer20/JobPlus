// src/api/jobs.api.js
import client from './client';

export const jobsAPI = {
  // GET /api/jobs?page=0&size=20&keyword=react&location=remote
  getJobs: (params) => client.get('/jobs', { params }).then(r => r.data),

  // GET /api/jobs/:id
  getJob: (id) => client.get(`/jobs/${id}`).then(r => r.data),

  // POST /api/jobs/:id/apply
  apply: (jobId, data) => client.post(`/jobs/${jobId}/apply`, data).then(r => r.data),

  // POST /api/jobs/:id/save  |  DELETE /api/jobs/:id/save
  toggleSave: (jobId, saved) =>
    saved
      ? client.delete(`/jobs/${jobId}/save`)
      : client.post(`/jobs/${jobId}/save`),

  // GET /api/jobs/recommended — AI-matched jobs for current user
  getRecommended: () => client.get('/jobs/recommended').then(r => r.data),
};