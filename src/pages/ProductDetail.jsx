import React from 'react';
import useProductDetail from '../hooks/useProductDetail'; // Import Hook vừa tạo

// CHỈ CHỈNH SỬA: Import ProductCard với đường dẫn chính xác tuyệt đối
import ProductCard from '../components/product/ProductCard'; 

const ProductDetail = () => {
    // Gọi Custom Hook để lấy toàn bộ logic và dữ liệu (Đã bóc tách thêm thumbScrollRef)
    const {
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
        thumbScrollRef // <-- Nhận ref từ Hook xử lý cuộn ngang ở đây
    } = useProductDetail();

    if (loading) return <div className="container my-5 text-center"><h3>Đang tải dữ liệu...</h3></div>;
    if (!data || !data.product) return <div className="container my-5 text-center"><h3>Không tìm thấy sản phẩm!</h3></div>;

    // CHỈ CHỈNH SỬA: Đổi tên thuộc tính bóc tách từ coSize sang isCoSize để khớp với JSON từ Backend
    const { product, isCoSize, listMauSac, listSPTuongTu } = data;

    return (
        <div className="container my-5">
            <div className="row g-4">
                {/* Khối Trái: Ảnh Sản Phẩm */}
                <div className="col-lg-6">
                    <div className="card shadow-sm p-3 rounded-4">
                        <div className="position-relative">
                            <button className="image-nav-btn image-nav-left" onClick={prevImage}>
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            {/* CHỈNH SỬA: Nối chuỗi gọi ảnh Main trực tiếp từ API port 8080 */}
                            <img src={`http://localhost:8080/images/Products/${allImages[currentIndex]}`} className="img-fluid w-100 rounded-4" alt="Main" style={{ transition: 'opacity 0.2s' }} />
                            <button className="image-nav-btn image-nav-right" onClick={nextImage}>
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                        
                        {/* CHỈ CHỈNH SỬA: Thêm thuộc tính ref={thumbScrollRef} và style cuộn mượt mượt mà */}
                        <div 
                            ref={thumbScrollRef} 
                            className="thumb-scroll mt-3" 
                            style={{ overflowX: 'auto', display: 'flex', gap: '0.5rem', scrollBehavior: 'smooth' }}
                        >
                            {allImages.map((img, idx) => (
                                <img 
                                    key={idx} 
                                    src={`http://localhost:8080/images/Products/${img}`} 
                                    className={`img-thumbnail rounded-3 img-thumb ${idx === currentIndex ? 'active' : ''}`} 
                                    style={{ width: '95px', height: '95px', cursor: 'pointer', objectFit: 'cover', flexShrink: 0 }} 
                                    onClick={() => setCurrentIndex(idx)} 
                                    alt="Thumbnail" 
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Khối Phải: Thông tin sản phẩm */}
                <div className="col-lg-6">
                    <div className="card shadow-sm p-4 rounded-4">
                        <h2 className="fw-bold">{product.tenSp}</h2>
                        <p className="fw-bold fs-2" style={{ color: 'red' }}>{product.giaBan?.toLocaleString('vi-VN')}₫</p>
                        <ul className="list-unstyled mb-3" style={{ lineHeight: '1.9' }}>
                            {/* CHỈ CHỈNH SỬA: Lấy trực tiếp trường name của đối tượng đối tác category liên kết từ Backend */}
                            <li><strong>Loại:</strong> {product.category?.name || "Đang cập nhật"}</li>
                            {/* CHỈ CHỈNH SỬA: Map sang đúng thuộc tính .material trong Product.java */}
                            <li><strong>Chất liệu:</strong> {product.material}</li>
                            {/* CHỈ CHỈNH SỬA: Map sang đúng thuộc tính .form trong Product.java */}
                            <li><strong>Form:</strong> {product.form}</li>
                        </ul>

                        <h6 className="fw-bold">Màu sắc: <span id="selectedColor">{selectedColor}</span></h6>
                        <div className="d-flex gap-2 mb-3 flex-wrap">
                            {listMauSac?.map((mau, i) => (
                                <span key={i} className={`px-3 py-1 border rounded color-item ${mau === selectedColor ? 'active' : ''}`} 
                                      style={{ cursor: 'pointer' }} onClick={() => handleColorClick(mau)}>{mau}</span>
                            ))}
                        </div>

                        {/* CHỈ CHỈNH SỬA: Thay đổi điều kiện render từ coSize sang isCoSize */}
                        {isCoSize && (
                            <>
                                <h6 className="fw-bold">Kích thước: <span id="selectedSize">{selectedSize}</span></h6>
                                <div className="d-flex gap-2 mb-3 flex-wrap">
                                    {dynamicSizes.map((size, i) => (
                                        <span key={i} className={`px-3 py-1 border rounded size-item ${size === selectedSize ? 'active' : ''}`} 
                                              style={{ cursor: 'pointer' }} onClick={() => setSelectedSize(size)}>{size}</span>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Tăng giảm số lượng */}
                        <div className="d-flex align-items-center mb-4">
                            <button className="btn btn-outline-dark" onClick={decreaseQty}>-</button>
                            <input value={qty} className="form-control text-center mx-2" style={{ width: '70px' }} 
                                   onChange={(e) => handleQtyChange(e.target.value)} />
                            <button className="btn btn-outline-dark" onClick={increaseQty}>+</button>
                        </div>

                        <div className="d-flex gap-3 flex-wrap justify-content-center">
                            <button className="btn btn-outline-dark btn-addcart px-4 py-2 fw-bold rounded-3">THÊM GIỎ HÀNG</button>
                            <button className="btn btn-outline-dark px-4 py-2 fw-bold rounded-3">MUA NGAY</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Khối Điều Khoản & Mô tả */}
            <ul className="nav nav-tabs rounded-top mt-5" role="tablist">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab("desc")}>MÔ TẢ CHI TIẾT</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'ship' ? 'active' : ''}`} onClick={() => setActiveTab("ship")}>CHÍNH SÁCH GIAO HÀNG</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'return' ? 'active' : ''}`} onClick={() => setActiveTab("return")}>CHÍNH SÁCH ĐỔI HÀNG</button>
                </li>
            </ul>
            <div className="tab-content p-4 border border-top-0 rounded-bottom shadow-sm">
                {/* CHỈNH SỬA: Map sang đúng thuộc tính .description trong Product.java */}
                {activeTab === "desc" && <div dangerouslySetInnerHTML={{ __html: product.description }} style={{ lineHeight: '1.8' }} />}
                {/* CHỈNH SỬA: Nối chuỗi gọi ảnh Chính sách từ API port 8080 */}
                {activeTab === "ship" && <img src={`http://localhost:8080/images/ChinhSach_GiaoHang_DoiHang/chinh-sach-giao-hang.jpg`} className="img-fluid rounded" alt="Shipping" />}
                {/* CHỈNH SỬA: Nối chuỗi gọi ảnh Đổi hàng từ API port 8080 */}
                {activeTab === "return" && <img src={`http://localhost:8080/images/ChinhSach_GiaoHang_DoiHang/chinh-sach-doi-hang.jpg`} className="img-fluid rounded" alt="Return" />}
            </div>

            {/* Sản phẩm liên quan */}
            <div className="d-flex align-items-center justify-content-center my-4 new-title">
                <div className="line-gradient"></div>
                <h1 className="mx-3 fw-bold title-black">SẢN PHẨM LIÊN QUAN</h1>
                <div className="line-gradient"></div>
            </div>

            <div className="position-relative my-4" style={{ overflow: 'hidden' }}>
                <button className="related-btn left btn" onClick={() => slideRelated(-1)}><i className="bi bi-chevron-left"></i></button>
                <div className="related-wrapper" style={{ width: '100%' }}>
                    <div ref={trackRef} className="related-track d-flex gap-3" style={{ transform: `translateX(-${offset * 220}px)`, transition: 'transform 0.3s ease' }}>
                        {listSPTuongTu?.map((sp) => (
                            /* CHỈ CHỈNH SỬA DUY NHẤT Ở ĐÂY: Thay thế khối HTML card cũ bằng component ProductCard tái sử dụng */
                            <div key={sp.id} className="related-item" style={{ minWidth: '200px', flex: '0 0 auto' }}>
                                <ProductCard product={sp} />
                            </div>
                        ))}
                    </div>
                </div>
                <button className="related-btn right btn" onClick={() => slideRelated(1)}><i className="bi bi-chevron-right"></i></button>
            </div>
        </div>
    );
};

export default ProductDetail;