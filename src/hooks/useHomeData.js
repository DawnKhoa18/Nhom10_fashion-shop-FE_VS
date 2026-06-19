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

        const bootstrap = window.bootstrap;
        let carouselInstance = null;

        const timer = setTimeout(() => {
            if (bootstrap && carouselId) {
                const element = document.querySelector(carouselId);
                if (element) {
                    carouselInstance = new bootstrap.Carousel(element, {
                        interval: 3000,
                        ride: 'carousel',
                        pause: 'hover'
                    });

                    carouselInstance.cycle();
                }
            }
        }, 150);

        return () => {
            isMounted = false;
            clearTimeout(timer); 
            if (carouselInstance) {
                carouselInstance.dispose();
            }
        };
    }, [carouselId]);

    return { ...data, loading };
};