import axios from 'axios';

// CHỈNH SỬA: Thêm chữ 's' vào đường dẫn để khớp với @RequestMapping("/api/carts") bên Java
const API_URL = 'http://localhost:8080/api/carts'; 

export const getCartData = async () => {
    const response = await axios.get("http://localhost:8080/api/cart-items/cart/1");
    return response.data;
};

export const updateCartQty = async (id, quantity) => {
    const response = await axios.post(`${API_URL}/update-qty`, {
        id,
        quantity
    });
    return response.data;
};

export const removeFromCartApi = async (id) => {
    const response = await axios.post(`${API_URL}/remove`, {
        id
    });
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