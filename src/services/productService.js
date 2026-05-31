import axios from 'axios';

const BASE_URL = 'http://localhost:8080'; 
const API_BASE_URL = `${BASE_URL}/api/SanPham`;

export const getFullImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const getHomeProducts = async () => {
    try {
        // Tạo một mảng các endpoints cần gọi
        const endpoints = [
            'GetHangMoi', 
            'GetHangBanChay', 
            'GetDanhSachAo', 
            'GetDanhSachQuan', 
            'GetDanhSachPhuKien'
        ];

        // Map mảng endpoints thành mảng các lời gọi axios
        const requests = endpoints.map(endpoint => axios.get(`${API_BASE_URL}/${endpoint}`));

        const responses = await Promise.all(requests);

        // Trả về object theo đúng tên ông cần ở HomePage
        return {
            hangMoi: responses[0].data,
            hangBanChay: responses[1].data,
            danhSachAo: responses[2].data,
            danhSachQuan: responses[3].data,
            danhSachPhuKien: responses[4].data
        };
    } catch (error) {
        console.error("Lỗi service gọi API sản phẩm:", error);
        throw error;
    }
};

// ================= CHỈ THÊM 2 HÀM DƯỚI ĐÂY ĐỂ PHỤC VỤ TRANG CHI TIẾT SẢN PHẨM =================

// 1. CHỈNH SỬA: Đổi từ nhận slug sang nhận productId kiểu số và gọi trực tiếp URL detail/{id}
export const getProductDetail = async (productId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/detail/${productId}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy chi tiết sản phẩm theo ID ${productId}:`, error);
        throw error;
    }
};

// 2. Hàm lấy size theo màu khi click đổi màu (GIỮ NGUYÊN NHẬN ID ĐỂ GỌI API THEO ĐÚNG BACKEND)
export const getSizesByColor = async (productId, color) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${productId}/sizes`, {
            params: { color }
        });
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy danh sách size cho màu ${color} của SP ${productId}:`, error);
        throw error;
    }
};