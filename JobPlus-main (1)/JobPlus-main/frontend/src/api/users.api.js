// src/api/users.api.js
import client from './client';

export const usersAPI = {
  getProfile: (username) => client.get(`/users/${username}`).then(r => r.data),
  updateProfile: (data)  => client.put('/users/me', data).then(r => r.data),
  uploadAvatar: (file) => {
    const form = new FormData();
    form.append('file', file);
    return client.post('/users/me/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data);
  },
};