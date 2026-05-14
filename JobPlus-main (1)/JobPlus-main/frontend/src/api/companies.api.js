// src/api/companies.api.js
import client from './client';

export const companiesAPI = {
  getAll:  (params) => client.get('/companies', { params }).then(r => r.data),
  getOne:  (id)     => client.get(`/companies/${id}`).then(r => r.data),
  follow:  (id)     => client.post(`/companies/${id}/follow`).then(r => r.data),
  unfollow:(id)     => client.delete(`/companies/${id}/follow`).then(r => r.data),
  getJobs: (id)     => client.get(`/companies/${id}/jobs`).then(r => r.data),
  getReviews: (id)  => client.get(`/companies/${id}/reviews`).then(r => r.data),
};