import React from 'react';
import { useParams } from 'react-router-dom'; // <--- Thêm để lấy slug từ URL
import useProductList from '../hooks/useProductList';
import ProductCard from '../components/product/ProductCard';

const ProductList = ({ defaultSlug }) => {
  // Lấy slug từ URL (ví dụ: /danh-muc/ao-thun)
  const { slug } = useParams(); 
  
  // Ưu tiên dùng slug từ URL, nếu không có thì dùng defaultSlug
  const activeSlug = slug || defaultSlug;

  // Bóc tách toàn bộ "đồ chơi" từ Custom Hook ra dựa trên activeSlug
  const {
    products,
    banner,
    currentSort,
    hienXemThem,
    API_BASE_URL,
    handleSortChange,
    handleLoadMore
  } = useProductList(activeSlug);

  return (
    <div className="container my-5">
      {/* 1. Hiển thị Banner động */}
      {banner && (
        <div className="mb-4">
          <img 
            src={`${API_BASE_URL}${banner}`} 
            className="w-100 rounded-5" 
            style={{ objectFit: 'cover' }} 
            alt="Banner danh mục" 
          />
        </div>
      )}

      {/* 2. Thanh Bộ Lọc Sắp Xếp */}
      <div className="d-flex justify-content-end mb-3">
        <div className="d-flex align-items-center me-3">
          <label htmlFor="sortOption" className="fw-bold">Bộ lọc:</label>
        </div>

        <select 
          id="sortOption" 
          className="form-select form-select-sm w-auto border-2 border-dark rounded-3"
          value={currentSort}
          onChange={handleSortChange}
        >
          <option value="default" disabled>Sắp xếp theo</option>
          <option value="price_asc">Giá: Tăng dần</option>
          <option value="price_desc">Giá: Giảm dần</option>
          <option value="name_asc">Tên: A - Z</option>
          <option value="name_desc">Tên: Z - A</option>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="best_selling">Bán chạy nhất</option>
        </select>
      </div>

      {/* 3. Danh sách sản phẩm qua vòng lặp map */}
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-4">
        {products.map((sp) => (
          <ProductCard key={sp.id} product={sp} />
        ))}
      </div>

      {/* 4. Khối xử lý Nút Bấm XEM THÊM */}
      {hienXemThem && (
        <div className="text-center mt-4">
          <button 
            className="btn btn-load-more fw-bold px-4 rounded-3"
            onClick={handleLoadMore}
          >
            XEM THÊM <i className="bi bi-chevron-double-right ms-1"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;