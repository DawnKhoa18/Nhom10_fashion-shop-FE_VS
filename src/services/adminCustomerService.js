import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin/customers';

export const getAdminCustomers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getAdminCustomer = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createAdminCustomer = async (payload) => {
  const response = await axios.post(API_URL, payload);
  return response.data;
};

export const updateAdminCustomer = async (id, payload) => {
  const response = await axios.put(`${API_URL}/${id}`, payload);
  return response.data;
};
