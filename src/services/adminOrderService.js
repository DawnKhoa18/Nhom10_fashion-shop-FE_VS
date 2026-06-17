import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin/orders';

export const getAdminOrders = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getAdminOrder = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateAdminOrderStatus = async (id, trangThai) => {
  const response = await axios.put(`${API_URL}/${id}/status`, { trangThai });
  return response.data;
};
