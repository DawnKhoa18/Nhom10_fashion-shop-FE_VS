import { useState, useEffect } from 'react';
import { getHomeProducts } from '../services/productService';

export const useHomeData = (carouselId) => {
    const [data, setData] = useState({
        hangMoi: [],
        hangBanChay: [],
        danhSachAo: [],
        danhSachQuan: [],
        danhSachPhuKien: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        // 1. Logic lấy dữ liệu
        const loadData = async () => {
            setLoading(true);
            try {
                const result = await getHomeProducts();
                if (isMounted) setData(result);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadData();

        // 2. Logic khởi tạo Carousel
        const bootstrap = window.bootstrap;
        let carouselInstance = null;

        // Dùng setTimeout để đảm bảo DOM đã hoàn toàn ổn định
        const timer = setTimeout(() => {
            if (bootstrap && carouselId) {
                const element = document.querySelector(carouselId);
                if (element) {
                    // Khởi tạo instance
                    carouselInstance = new bootstrap.Carousel(element, {
                        interval: 3000,
                        ride: 'carousel',
                        pause: 'hover' // Dừng lại khi di chuột vào (tốt cho UX)
                    });

                    // CỰC KỲ QUAN TRỌNG: Lệnh này ép carousel chạy ngay lập tức
                    carouselInstance.cycle();
                }
            }
        }, 150); // Delay nhẹ 150ms

        return () => {
            isMounted = false;
            clearTimeout(timer); // Xóa timer nếu user thoát trang nhanh
            if (carouselInstance) {
                carouselInstance.dispose();
            }
        };
    }, [carouselId]);

    return { ...data, loading };
};