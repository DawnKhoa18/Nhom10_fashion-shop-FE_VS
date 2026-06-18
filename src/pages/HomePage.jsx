import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { useHomeData } from '../hooks/useHomeData';
// Import hàm xử lý link ảnh từ service
import { getFullImageUrl } from '../services/productService';

const HomePage = () => {
    // Truyền ID của carousel vào hook để nó tự động xử lý chuyển động
    const { hangMoi, hangBanChay, danhSachAo, danhSachQuan, danhSachPhuKien } = useHomeData('#bannerCarousel');
    const listGoiY = [];

    // Component phụ render tiêu đề
    const SectionTitle = ({ title }) => (
        <div className="d-flex align-items-center justify-content-center my-4">
            <div className="line-gradient"></div>
            <h1 className="mx-3 title-black text-uppercase">{title}</h1>
            <div className="line-gradient" style={{ transform: 'rotate(180deg)' }}></div>
        </div>
    );

    return (
        <div className="homepage-container">
            {/* 1. BANNER CHUYỂN ĐỘNG */}
            <div id="bannerCarousel" className="carousel slide rounded-5 overflow-hidden shadow-sm" data-bs-ride="true" data-bs-interval="3000">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="0" className="active"></button>
                    <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="1"></button>
                    <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="2"></button>
                    <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="3"></button>
                    <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="4"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src={getFullImageUrl('/images/Banners/hang-moi-banner.jpg')} className="d-block w-100" alt="Banner 1" />
                    </div>
                    <div className="carousel-item">
                        <img src={getFullImageUrl('/images/Banners/banner1.jpg')} className="d-block w-100" alt="Banner 2" />
                    </div>
                    <div className="carousel-item">
                        <img src={getFullImageUrl('/images/Banners/banner2.jpg')} className="d-block w-100" alt="Banner 3" />
                    </div>
                    <div className="carousel-item">
                        <img src={getFullImageUrl('/images/Banners/banner4.jpg')} className="d-block w-100" alt="Banner 4" />
                    </div>
                    <div className="carousel-item">
                        <img src={getFullImageUrl('/images/Banners/banner3.jpg')} className="d-block w-100" alt="Banner 5" />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev"><span className="carousel-control-prev-icon"></span></button>
                <button className="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next"><span className="carousel-control-next-icon"></span></button>
            </div>

            {/* 2. HÀNG MỚI */}
            <SectionTitle title="HÀNG MỚI" />
            <div className="my-4">
                <img src={getFullImageUrl('/images/Banners/hang-moi-banner-trang-chu.jpg')} className="w-100 rounded-5 shadow-sm" alt="Banner Hàng Mới" />
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
                {hangMoi.map(sp => <ProductCard key={sp.id} product={sp} />)}
            </div>
            <div className="text-center mt-4 mb-5">
                <Link to="/danh-muc/hang-moi" className="btn btn-all fw-bold px-4 py-2 rounded-3">
                    XEM TẤT CẢ <i className="bi bi-chevron-double-right"></i>
                </Link>
            </div>

            {/* 3. HÀNG BÁN CHẠY */}
            <SectionTitle title="HÀNG BÁN CHẠY" />
            <div className="my-4">
                <img src={getFullImageUrl('/images/Banners/hang-ban-chay-banner-trang-chu.jpg')} className="w-100 rounded-5 shadow-sm" alt="Banner Bán Chạy" />
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
                {hangBanChay.map(sp => <ProductCard key={sp.id} product={sp} />)}
            </div>
            <div className="text-center mt-4 mb-5">
                <Link to="/danh-muc/hang-ban-chay" className="btn btn-all fw-bold px-4 py-2 rounded-3">
                    XEM TẤT CẢ <i className="bi bi-chevron-double-right"></i>
                </Link>
            </div>

            {/* 4. DÀNH CHO BẠN */}
            {listGoiY.length > 0 && (
                <>
                    <SectionTitle title="DÀNH CHO BẠN" />
                    <div className="my-4">
                        <img src={getFullImageUrl('/images/Banners/goi-y-banner-trang-chu.jpg')} className="w-100 rounded-5 shadow-sm" alt="Banner Gợi Ý" />
                    </div>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
                        {listGoiY.map(sp => <ProductCard key={sp.id} product={sp} />)}
                    </div>
                </>
            )}

            {/* 5. ÁO NAM */}
            <SectionTitle title="ÁO NAM" />
            <div className="my-4">
                <img src={getFullImageUrl('/images/Banners/ao-banner.jpg')} className="w-100 rounded-5 shadow-sm" alt="Banner Áo" />
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
                {danhSachAo.map(sp => <ProductCard key={sp.id} product={sp} />)}
            </div>
            <div className="text-center mt-4 mb-5">
                <Link to="/danh-muc/ao" className="btn btn-all fw-bold px-4 py-2 rounded-3">XEM TẤT CẢ <i className="bi bi-chevron-double-right"></i></Link>
            </div>

            {/* 6. QUẦN NAM */}
            <SectionTitle title="QUẦN NAM" />
            <div className="my-4">
                <img src={getFullImageUrl('/images/Banners/quan-banner.jpg')} className="w-100 rounded-5 shadow-sm" alt="Banner Quần" />
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
                {danhSachQuan.map(sp => <ProductCard key={sp.id} product={sp} />)}
            </div>
            <div className="text-center mt-4 mb-5">
                <Link to="/danh-muc/quan" className="btn btn-all fw-bold px-4 py-2 rounded-3">XEM TẤT CẢ <i className="bi bi-chevron-double-right"></i></Link>
            </div>

            {/* 7. PHỤ KIỆN */}
            <SectionTitle title="PHỤ KIỆN" />
            <div className="my-4">
                <img src={getFullImageUrl('/images/Banners/phu-kien-banner.jpg')} className="w-100 rounded-5 shadow-sm" alt="Banner Phụ Kiện" />
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
                {danhSachPhuKien.map(sp => <ProductCard key={sp.id} product={sp} />)}
            </div>
            <div className="text-center mt-4 mb-5">
                <Link to="/danh-muc/phu-kien" className="btn btn-all fw-bold px-4 py-2 rounded-3">XEM TẤT CẢ <i className="bi bi-chevron-double-right"></i></Link>
            </div>
        </div>
    );
};

export default HomePage;