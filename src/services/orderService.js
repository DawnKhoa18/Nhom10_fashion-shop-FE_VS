import axios from 'axios';

const API_URL = 'http://localhost:8080/api/orders/customer';

const getCustomerId = () => {
  const customerId = localStorage.getItem('customerId');
  if (!customerId) throw new Error('Vui lòng đăng nhập');
  return customerId;
};

export const getMyOrders = async () => {
  const response = await axios.get(`${API_URL}/${getCustomerId()}`);
  return response.data;
};

export const getMyOrderDetail = async (orderId) => {
  const response = await axios.get(`${API_URL}/${getCustomerId()}/${orderId}`);
  return response.data;
};

export const cancelMyOrder = async (orderId) => {
  const response = await axios.put(`${API_URL}/${getCustomerId()}/${orderId}/cancel`);
  return response.data;
};
