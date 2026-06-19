import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { addToCartApi } from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    const getCurrentCartId = async () => {
        const customerId = localStorage.getItem("customerId");

        if (!customerId) {
            return null;
        }

        const response = await axios.get(
            `http://localhost:8080/api/carts/customer/${customerId}`
        );

        return response.data.id;
    };

    const refreshCartCount = async () => {
        try {
            const cartId = await getCurrentCartId();

            if (!cartId) {
                setCartCount(0);
                return;
            }

            const response = await axios.get(
                `http://localhost:8080/api/carts/count/${cartId}`
            );

            setCartCount(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy số lượng giỏ hàng:", error);
            setCartCount(0);
        }
    };

    const resetCartCount = () => {
        setCartCount(0);
    };

    useEffect(() => {
        const syncCartCount = () => {
            refreshCartCount();
        };

        syncCartCount();
        window.addEventListener("profileUpdated", syncCartCount);
        window.addEventListener("storage", syncCartCount);

        return () => {
            window.removeEventListener("profileUpdated", syncCartCount);
            window.removeEventListener("storage", syncCartCount);
        };
    }, []);

    const addToCart = async (itemToCart) => {
        try {
            await addToCartApi(itemToCart);
            await refreshCartCount();
            return true;
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            return false;
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartCount,
                addToCart,
                refreshCartCount,
                resetCartCount
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
