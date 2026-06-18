import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Định nghĩa URL Backend để lấy ảnh
  const API_BASE_URL = "http://localhost:8080";

  return (
    <div className="col">
      <div className="card shadow-sm border-0 product-card h-100">
        <Link to={`/san-pham/${product.id}`} className="text-decoration-none text-dark">
          <div className="ratio ratio-1x1 product-image-wrapper">
            {/* Ảnh chính (ThuTuHinh = 1) */}
            <img 
              src={`${API_BASE_URL}/Images/Products/${product.hinhAnh}`} 
              className="img-main" 
              alt={product.tenSp} 
            />
            
            {/* ẢNH HOVER: Chỉnh từ product.hinhAnh thành product.hoverImage */}
            <img 
              src={`${API_BASE_URL}/Images/Products/${product.hoverImage || product.hinhAnh}`} 
              className="img-hover" 
              alt={`${product.tenSp} hover`} 
            />
          </div>
        </Link>

        <div className="card-body text-start d-flex flex-column">
          {/* CHỈNH SỬA: Đổi từ product.tenSp sang product.id */}
          <Link to={`/san-pham/${product.id}`} className="text-dark text-decoration-none">
            <h6 className="product-name">{product.tenSp}</h6>
          </Link>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <p className="fw-bold m-0" style={{ color: 'red', fontSize: '15px', cursor: 'pointer' }}>
              {new Intl.NumberFormat('vi-VN').format(product.giaBan)}₫
            </p>
            {/* CHỈNH SỬA: Đổi từ product.tenSp sang product.id */}
            <Link to={`/san-pham/${product.id}`} className="text-dark">
              <i className="bi bi-cart-plus fs-5 cart-icon"></i>
            </Link>
          </div>

          {/* CHỈNH SỬA: Đổi từ product.tenSp sang product.id */}
          <Link 
            to={`/san-pham/${product.id}`} 
            className="btn btn-outline-dark btn-sm fw-bold mt-auto btn-view rounded-3"
          >
            XEM CHI TIẾT
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;