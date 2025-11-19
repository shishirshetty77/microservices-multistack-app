import axios from 'axios';

const api = axios.create({
  baseURL: window.location.origin,
  timeout: 10000,
});

// Service Health Checks
export const checkServiceHealth = async (service, healthPath) => {
  try {
    const response = await axios.get(healthPath, { timeout: 3000 });
    return { service, status: 'healthy', data: response.data };
  } catch (error) {
    return { service, status: 'unhealthy', error: error.message };
  }
};

export const checkAllServices = async () => {
  const services = [
    { name: 'User Service', healthPath: '/health/user' },
    { name: 'Product Service', healthPath: '/health/product' },
    { name: 'Order Service', healthPath: '/health/order' },
    { name: 'Notification Service', healthPath: '/health/notification' },
    { name: 'Analytics Service', healthPath: '/health/analytics' },
  ];

  const results = await Promise.all(
    services.map(s => checkServiceHealth(s.name, s.healthPath))
  );

  return results;
};

// User Service APIs
export const getUsers = () => api.get('/api/users');
export const getUser = (id) => api.get(`/api/users/${id}`);
export const createUser = (data) => api.post('/api/users', data);
export const updateUser = (id, data) => api.put(`/api/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/api/users/${id}`);

// Product Service APIs
export const getProducts = () => api.get('/api/products');
export const getProduct = (id) => api.get(`/api/products/${id}`);
export const createProduct = (data) => api.post('/api/products', data);
export const updateProduct = (id, data) => api.put(`/api/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);

// Order Service APIs
export const getOrders = () => api.get('/api/orders');
export const getOrder = (id) => api.get(`/api/orders/${id}`);
export const createOrder = (data) => api.post('/api/orders', data);
export const deleteOrder = (id) => api.delete(`/api/orders/${id}`);

// Notification Service APIs
export const getNotifications = () => api.get('/api/notifications');
export const getNotification = (id) => api.get(`/api/notifications/${id}`);
export const createNotification = (data) => api.post('/api/notifications/send', data);
export const deleteNotification = (id) => api.delete(`/api/notifications/${id}`);

// Analytics Service APIs
export const getAnalytics = () => api.get('/api/analytics/summary');

export default api;
