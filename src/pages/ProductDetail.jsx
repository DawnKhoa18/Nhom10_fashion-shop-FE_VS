import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProductDetail from '../hooks/useProductDetail';
import ProductCard from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import { getProductReviews } from '../services/reviewService';

const ProductDetail = () => {
    const navigate = useNavigate();
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
        thumbScrollRef
    } = useProductDetail();

    const { addToCart } = useCart();
    const [showToast, setShowToast] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    useEffect(() => {
        const productId = data?.product?.id;
        if (!productId) return;

        setReviewsLoading(true);
        getProductReviews(productId)
            .then((result) => setReviews(result || []))
            .catch(() => setReviews([]))
            .finally(() => setReviewsLoading(false));
    }, [data?.product?.id]);

    if (loading) return <div className="container my-5 text-center"><h3>Đang tải dữ liệu...</h3></div>;
    if (!data || !data.product) return <div className="container my-5 text-center"><h3>Không tìm thấy sản phẩm!</h3></div>;

    const { product, isCoSize, listMauSac, listSPTuongTu } = data;
    const averageRating = reviews.length
        ? reviews.reduce((total, review) => total + Number(review.rating || 0), 0) / reviews.length
        : 0;

    const handleAddCartClick = async (shouldRedirect = false) => {
        const itemToCart = {
            maSP: product.id,
            tenSp: product.tenSp,
            giaBan: product.giaBan,
            mau: selectedColor,
            size: isCoSize ? selectedSize : "FreeSize",
            soLuong: qty,
            anh: allImages[0]
        };

        const success = await addToCart(itemToCart);

        if (success) {
            if (shouldRedirect) {
                navigate('/checkout');
            } else {
                setShowToast(true);
            }
        }
    };

    return (
        <div className="container my-5 position-relative">
            {showToast && (
                <div
                    className="d-flex align-items-center text-white px-3 py-2 rounded-3 shadow"
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        backgroundColor: '#198754',
                        zIndex: 9999,
                        transition: 'all 0.5s ease',
                        animation: 'fadeIn 0.3s ease'
                    }}
                >
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <span>Sản phẩm đã được thêm vào giỏ hàng!</span>
                    <button
                        type="button"
                        className="btn-close btn-close-white ms-3"
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => setShowToast(false)}
                    ></button>
                </div>
            )}

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card shadow-sm p-3 rounded-4">
                        <div className="position-relative">
                            <button className="image-nav-btn image-nav-left" onClick={prevImage}>
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <img src={`http://localhost:8080/Images/Products/${allImages[currentIndex]}`} className="img-fluid w-100 rounded-4" alt="Main" style={{ transition: 'opacity 0.2s' }} />
                            <button className="image-nav-btn image-nav-right" onClick={nextImage}>
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>

                        <div
                            ref={thumbScrollRef}
                            className="thumb-scroll mt-3"
                            style={{ overflowX: 'auto', display: 'flex', gap: '0.5rem', scrollBehavior: 'smooth' }}
                        >
                            {allImages.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={`http://localhost:8080/Images/Products/${img}`}
                                    className={`img-thumbnail rounded-3 img-thumb ${idx === currentIndex ? 'active' : ''}`}
                                    style={{ width: '95px', height: '95px', cursor: 'pointer', objectFit: 'cover', flexShrink: 0 }}
                                    onClick={() => setCurrentIndex(idx)}
                                    alt="Thumbnail"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card shadow-sm p-4 rounded-4">
                        <h2 className="fw-bold">{product.tenSp}</h2>
                        <p className="fw-bold fs-2" style={{ color: 'red' }}>{product.giaBan?.toLocaleString('vi-VN')}₫</p>
                        <ul className="list-unstyled mb-3" style={{ lineHeight: '1.9' }}>
                            <li><strong>Loại:</strong> {product.category?.name || "Đang cập nhật"}</li>
                            <li><strong>Chất liệu:</strong> {product.material}</li>
                            <li><strong>Form:</strong> {product.form}</li>
                        </ul>

                        <h6 className="fw-bold">Màu sắc: <span id="selectedColor">{selectedColor}</span></h6>
                        <div className="d-flex gap-2 mb-3 flex-wrap">
                            {listMauSac?.map((mau, i) => (
                                <span key={i} className={`px-3 py-1 border rounded color-item ${mau === selectedColor ? 'active' : ''}`}
                                    style={{ cursor: 'pointer' }} onClick={() => handleColorClick(mau)}>{mau}</span>
                            ))}
                        </div>

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

                        <div className="d-flex align-items-center mb-4">
                            <button className="btn btn-outline-dark" onClick={decreaseQty}>-</button>
                            <input value={qty} className="form-control text-center mx-2" style={{ width: '70px' }}
                                onChange={(e) => handleQtyChange(e.target.value)} />
                            <button className="btn btn-outline-dark" onClick={increaseQty}>+</button>
                        </div>

                        <div className="d-flex gap-3 flex-wrap justify-content-center">
                            <button onClick={() => handleAddCartClick(false)} className="btn btn-outline-dark btn-addcart px-4 py-2 fw-bold rounded-3">THÊM GIỎ HÀNG</button>
                            <button onClick={() => handleAddCartClick(true)} className="btn btn-outline-dark px-4 py-2 fw-bold rounded-3">MUA NGAY</button>
                        </div>
                    </div>
                </div>
            </div>

            <ul className="nav nav-tabs rounded-top mt-5 flex-nowrap" role="tablist" style={{ overflow: 'visible' }}>
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

            <div className="tab-content p-4 border border-top-0 rounded-bottom shadow-sm" style={{ overflowY: 'visible', overflowX: 'visible', height: 'auto', maxHeight: 'none' }}>
                {activeTab === "desc" && <div dangerouslySetInnerHTML={{ __html: product.description }} style={{ lineHeight: '1.6' }} />}
                {activeTab === "ship" && <img src={`http://localhost:8080/Images/ChinhSach_GiaoHang_DoiHang/chinh-sach-giao-hang.jpg`} className="img-fluid rounded w-100" alt="Shipping" style={{ display: 'block', height: 'auto' }} />}
                {activeTab === "return" && <img src={`http://localhost:8080/Images/ChinhSach_GiaoHang_DoiHang/chinh-sach-doi-hang.jpg`} className="img-fluid rounded w-100" alt="Return" style={{ display: 'block', height: 'auto' }} />}
            </div>

            <section className="card border-0 shadow-sm rounded-4 p-4 mt-5">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div>
                        <h3 className="fw-bold mb-1">Đánh giá sản phẩm</h3>
                        <p className="text-muted mb-0">Đánh giá từ khách hàng đã mua và nhận sản phẩm.</p>
                    </div>
                    {reviews.length > 0 && (
                        <div className="text-end">
                            <div className="fs-3 fw-bold">{averageRating.toFixed(1)}/5</div>
                            <div className="text-warning">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <i key={star} className={`bi ${star <= Math.round(averageRating) ? 'bi-star-fill' : 'bi-star'}`} />
                                ))}
                                <span className="text-muted small ms-2">({reviews.length} đánh giá)</span>
                            </div>
                        </div>
                    )}
                </div>

                {reviewsLoading ? (
                    <div className="text-center py-4"><div className="spinner-border spinner-border-sm" /></div>
                ) : reviews.length === 0 ? (
                    <div className="text-center text-muted border rounded-3 py-4">
                        Sản phẩm chưa có đánh giá. Khách đã nhận hàng có thể đánh giá trong mục Đơn hàng của tôi.
                    </div>
                ) : (
                    <div className="d-grid gap-3">
                        {reviews.map((review) => (
                            <article key={review.id} className="border rounded-3 p-3">
                                <div className="d-flex justify-content-between gap-3">
                                    <div>
                                        <div className="fw-bold">{review.customerName || 'Khách hàng'}</div>
                                        <div className="text-warning my-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <i key={star} className={`bi ${star <= review.rating ? 'bi-star-fill' : 'bi-star'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <small className="text-muted">
                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : ''}
                                    </small>
                                </div>
                                {review.title && <div className="fw-semibold mt-2">{review.title}</div>}
                                <p className="mb-0 mt-1">{review.content}</p>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <div className="d-flex align-items-center justify-content-center my-4 new-title">
                <div className="line-gradient"></div>
                <h1 className="mx-3 fw-bold title-black">SẢN PHẨM LIÊN QUAN</h1>
                <div className="line-gradient"></div>
            </div>

            <div className="position-relative my-4" style={{ overflow: 'hidden' }}>
                <button className="image-nav-btn image-nav-left" onClick={() => slideRelated(-1)}><i className="bi bi-chevron-left"></i></button>
                <div id="relatedWrapper" className="related-wrapper" style={{ width: '100%', overflow: 'hidden' }}>
                    <div id="relatedTrack" ref={trackRef} className="related-track d-flex gap-3" style={{ transform: `translateX(-${offset * (trackRef.current?.children[0]?.offsetWidth + 16 || 216)}px)`, transition: 'transform 0.3s ease' }}>
                        {listSPTuongTu?.map((sp) => (
                            <div key={sp.id} className="related-item" style={{ minWidth: 'calc((100% - 64px) / 5)', maxWidth: 'calc((100% - 64px) / 5)', flex: '0 0 auto' }}>
                                <ProductCard product={sp} />
                            </div>
                        ))}
                    </div>
                </div>
                <button className="image-nav-btn image-nav-right" onClick={() => slideRelated(1)}><i className="bi bi-chevron-right"></i></button>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ProductDetail;
