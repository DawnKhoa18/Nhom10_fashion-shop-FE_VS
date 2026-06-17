import axios from 'axios';

// CHỈNH SỬA: Thêm chữ 's' vào đường dẫn để khớp với @RequestMapping("/api/carts") bên Java
const API_URL = 'http://localhost:8080/api/carts'; 

export const getCartData = async () => {
    const response = await axios.get(`${API_URL}`);
    return response.data;
};

export const updateCartQty = async (maSP, mau, size, soLuong) => {
    const response = await axios.post(`${API_URL}/update-qty`, { maSP, mau, size, soLuong });
    return response.data;
};

export const removeFromCartApi = async (maSP, mau, size) => {
    const response = await axios.post(`${API_URL}/remove`, { maSP, mau, size });
    return response.data;
};

export const submitOrder = async (orderData) => {
    const response = await axios.post(`http://localhost:8080/api/orders/place`, orderData);
    return response.data;
};

// CHỈ CHỈNH SỬA: Thay đổi tham số truyền vào thành 'item' (Object) để khớp với ProductDetail.jsx
export const addToCartApi = async (item) => {
    const response = await axios.post(`${API_URL}/add`, item);
    return response.data;
};