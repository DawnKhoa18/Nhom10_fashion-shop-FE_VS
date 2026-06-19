import React from 'react';
import { useParams } from 'react-router-dom';
import useProductList from '../hooks/useProductList';
import ProductCard from '../components/product/ProductCard';

const ProductList = ({ defaultSlug }) => {

  const { slug } = useParams();

  const activeSlug = slug || defaultSlug;

  const {
    products,
    pageTitle,
    keyword,
    banner,
    currentSort,
    hienXemThem,
    API_BASE_URL,
    handleSortChange,
    handleLoadMore
  } = useProductList(activeSlug);

  return (
    <div className="container my-5">
      {}
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

      {}
      <div className="d-flex flex-column align-items-center mb-4">
        {}
        <div className="d-flex align-items-center justify-content-center w-100">
          <div className="line-gradient"></div>
          <h3 className="mx-3 fw-bold text-uppercase mb-0 text-nowrap">{pageTitle}</h3>
          <div className="line-gradient" style={{ transform: 'rotate(180deg)' }}></div>
        </div>

        {}
        {keyword && (
          <p className="text-muted mt-2 mb-0">
            Từ khóa: <span className="fw-semibold">"{keyword}"</span>
          </p>
        )}
      </div>

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

      {}
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-4">
        {products.map((sp) => (
          <ProductCard key={sp.id} product={sp} />
        ))}
      </div>

      {}
      {products.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-search fs-1 text-muted"></i>
          <h5 className="mt-3">Không tìm thấy sản phẩm phù hợp</h5>
          <p className="text-muted">Bạn thử nhập từ khóa khác hoặc xem tất cả sản phẩm nhé.</p>
        </div>
      )}

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
