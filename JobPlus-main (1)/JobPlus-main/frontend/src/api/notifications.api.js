// src/api/notifications.api.js
import client from './client';

export const notificationsAPI = {
  getAll:   ()   => client.get('/notifications').then(r => r.data),
  markRead: (id) => client.put(`/notifications/${id}/read`).then(r => r.data),
  markAllRead: () => client.put('/notifications/read-all').then(r => r.data),
};