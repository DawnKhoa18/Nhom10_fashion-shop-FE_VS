import axios from 'axios';

const API_URL = 'http://localhost:8080/api/reviews';

export const getProductReviews = async (productId) => {
  const response = await axios.get(`${API_URL}/product/${productId}`);
  return response.data;
};

export const createProductReview = async ({ orderId, productId, rating, title, content }) => {
  const customerId = localStorage.getItem('customerId');
  if (!customerId) throw new Error('Vui lòng đăng nhập');

  const response = await axios.post(API_URL, {
    customerId: Number(customerId),
    orderId: Number(orderId),
    productId: Number(productId),
    rating: Number(rating),
    title,
    content
  });
  return response.data;
};
