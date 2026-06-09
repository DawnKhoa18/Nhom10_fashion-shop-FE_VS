import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Đã thêm axios
import { addToCartApi } from '../services/cartService'; // Đã xóa getCartData không dùng

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    const refreshCartCount = async () => {
        try {
            // Gọi trực tiếp API đếm từ Backend
            const response = await axios.get("http://localhost:8080/api/carts/count/1");
            setCartCount(response.data); // Backend trả về số nguyên trực tiếp
        } catch (error) {
            console.error("Lỗi khi lấy số lượng giỏ hàng:", error);
            setCartCount(0); // Nếu lỗi thì đặt về 0
        }
    };

    // Tự động chạy lấy số lượng khi load trang lần đầu
    useEffect(() => {
        refreshCartCount();
    }, []);

    const addToCart = async (itemToCart) => {
        try {
            await addToCartApi(itemToCart); // Truyền nguyên object lên API
            await refreshCartCount(); // Cập nhật lại số lượng hiển thị trên Header ngay lập tức
            return true;
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            return false;
        }
    };

    return (
        <CartContext.Provider value={{ cartCount, addToCart, refreshCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);