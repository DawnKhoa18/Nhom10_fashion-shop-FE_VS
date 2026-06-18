import axios from 'axios';

const API_URL = 'http://localhost:8080/api/customers';
const customerId = () => {
  const id = localStorage.getItem('customerId');
  if (!id) throw new Error('Vui lòng đăng nhập');
  return id;
};

export const getCustomerProfile = async () => (await axios.get(`${API_URL}/${customerId()}/profile`)).data;
export const updateCustomerProfile = async (data) => (await axios.put(`${API_URL}/${customerId()}/profile`, data)).data;
export const changeCustomerPassword = async (data) => (await axios.put(`${API_URL}/${customerId()}/password`, data)).data;
