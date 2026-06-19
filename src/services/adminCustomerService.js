import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin/customers';

export const getAdminCustomers = async () => (await axios.get(API_URL)).data;
export const getAdminCustomer = async (id) => (await axios.get(`${API_URL}/${id}`)).data;
export const createAdminCustomer = async (payload) => (await axios.post(API_URL, payload)).data;
export const updateAdminCustomer = async (id, payload) => (await axios.put(`${API_URL}/${id}`, payload)).data;
