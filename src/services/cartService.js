import axios from 'axios';

const API_CART_URL = 'http://localhost:8080/api/carts';
const API_CART_ITEM_URL = 'http://localhost:8080/api/cart-items';
const API_ORDER_URL = 'http://localhost:8080/api/orders';

const getCustomerId = () => {
    const customerId = localStorage.getItem("customerId");

    if (!customerId) {
        throw new Error("Đăng nhập để sử dụng giỏ hàng");
    }

    return customerId;
};

// Lấy cartId theo customerId
export const getCartIdByCustomer = async () => {
    const customerId = getCustomerId();

    const response = await axios.get(`${API_CART_URL}/customer/${customerId}`);

    if (!response.data || !response.data.id) {
        throw new Error("Không tìm thấy giỏ hàng của khách hàng");
    }

    return response.data.id;
};

// Lấy danh sách sản phẩm trong giỏ hàng
export const getCartData = async () => {
    const cartId = await getCartIdByCustomer();
    const response = await axios.get(`${API_CART_ITEM_URL}/cart/${cartId}`);
    return response.data;
};

// Thêm sản phẩm vào giỏ hàng
export const addToCartApi = async (item) => {
    const cartId = await getCartIdByCustomer();

    const data = {
        ...item,
        cartId: cartId
    };

    const response = await axios.post(`${API_CART_URL}/add`, data);
    return response.data;
};

// Cập nhật số lượng sản phẩm
export const updateCartQty = async (id, quantity) => {
    const response = await axios.post(`${API_CART_URL}/update-qty`, {
        id,
        soLuong: quantity
    });

    return response.data;
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCartApi = async (id) => {
    const response = await axios.post(`${API_CART_URL}/remove`, {
        id
    });

    return response.data;
};

// Đặt hàng COD
export const submitOrder = async (orderData) => {
    const response = await axios.post(`${API_ORDER_URL}/place`, orderData);

    return response.data;
};

export const confirmMomoPayment = async (orderNumber) => {
    const response = await axios.get(`${API_ORDER_URL}/momo/confirm/${encodeURIComponent(orderNumber)}`);
    return response.data;
};

export const confirmVnpayPayment = async (params) => {
    const response = await axios.get(`${API_ORDER_URL}/vnpay/return`, { params });
    return response.data;
};
