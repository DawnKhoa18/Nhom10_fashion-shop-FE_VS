// src/services/categoryService.js
const API_BASE_URL = "http://localhost:8080/api/categories";

export const getAllCategories = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error("Không thể lấy dữ liệu từ server");
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi API Category:", error);
        return []; // Trả về mảng rỗng để giao diện không bị crash
    }
};