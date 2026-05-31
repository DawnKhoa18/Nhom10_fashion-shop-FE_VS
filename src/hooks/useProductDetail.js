import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getProductDetail, getSizesByColor } from '../services/productService';

const useProductDetail = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    // Trạng thái tương tác của người dùng
    const [currentIndex, setCurrentIndex] = useState(0);
    const [qty, setQty] = useState(1);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [dynamicSizes, setDynamicSizes] = useState([]);
    const [activeTab, setActiveTab] = useState("desc");

    const trackRef = useRef(null);
    const [offset, setOffset] = useState(0);

    // CHỈ THÊM: Ref và Effect để tự động cuộn thanh ngang ảnh nhỏ theo ảnh lớn đang hiển thị
    const thumbScrollRef = useRef(null);

    useEffect(() => {
        if (thumbScrollRef.current) {
            const activeThumb = thumbScrollRef.current.querySelector('.img-thumb.active');
            if (activeThumb) {
                activeThumb.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [currentIndex]);

    useEffect(() => {
        setLoading(true);
        getProductDetail(id)
            .then(res => {
                setData(res);
                setSelectedColor(res.listMauSac?.[0] || "");
                setSelectedSize(res.listSizeTheoMau?.[0] || "");
                setDynamicSizes(res.listSizeTheoMau || []);
                setCurrentIndex(0);
                setQty(1);
                setOffset(0); 
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
                setLoading(false);
            });
    }, [id]); 

    // 3. CHỈNH SỬA: Thay thế đổi từ data.coSize sang data.isCoSize cho đúng key JSON từ Spring Boot
    const handleColorClick = (color) => {
        setSelectedColor(color);
        if (data?.isCoSize && data?.product?.id) {
            getSizesByColor(data.product.id, color)
                .then(sizes => {
                    setDynamicSizes(sizes);
                    setSelectedSize(sizes.length > 0 ? sizes[0] : "");
                })
                .catch(err => console.error("Lỗi khi lấy kích thước theo màu:", err));
        }
    };

    const handleQtyChange = (value) => {
        const val = parseInt(value.replace(/\D/g, ""));
        setQty(isNaN(val) || val < 1 ? 1 : val);
    };

    const decreaseQty = () => setQty(prev => (prev > 1 ? prev - 1 : 1));
    const increaseQty = () => setQty(prev => prev + 1);

    // 5. CHỈ CHỈNH SỬA: Đổi từ data.images thành data.productImages cho khớp với DTO Java
    const allImages = data && data.product 
        ? [data.product.hinhAnh, ...(data.productImages ? data.productImages.map(img => img.imageName) : [])].filter(Boolean)
        : [];

    const prevImage = () => {
        if (allImages.length === 0) return;
        setCurrentIndex((currentIndex - 1 + allImages.length) % allImages.length);
    };

    const nextImage = () => {
        if (allImages.length === 0) return;
        setCurrentIndex((currentIndex + 1) % allImages.length);
    };

    const slideRelated = (direction) => {
        if (!trackRef.current || !data?.listSPTuongTu) return;
        const totalItems = data.listSPTuongTu.length;
        const visible = window.innerWidth < 576 ? 1 : window.innerWidth < 768 ? 2 : window.innerWidth < 992 ? 3 : window.innerWidth < 1200 ? 4 : 5;
        const maxOffset = Math.max(totalItems - visible, 0);
        
        let newOffset = offset + direction;
        if (newOffset < 0) newOffset = 0;
        if (newOffset > maxOffset) newOffset = maxOffset;
        setOffset(newOffset);
    };

    return {
        id, 
        loading,
        data,
        currentIndex,
        setCurrentIndex,
        qty,
        selectedColor,
        selectedSize,
        setSelectedSize,
        dynamicSizes,
        activeTab,
        setActiveTab,
        trackRef,
        offset,
        allImages,
        handleColorClick,
        handleQtyChange,
        decreaseQty,
        increaseQty,
        prevImage,
        nextImage,
        slideRelated,
        thumbScrollRef // CHỈ THÊM: Trả ref ra ngoài giao diện sử dụng
    };
};

export default useProductDetail;