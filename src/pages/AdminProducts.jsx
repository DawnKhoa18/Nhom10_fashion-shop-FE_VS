import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteAdminProduct, getAdminProducts } from '../services/adminProductService';

const PAGE_SIZE = 25;

const formatCurrency = (value) => {
  const numberValue = Number(value) || 0;
  return `${new Intl.NumberFormat('vi-VN').format(numberValue)}₫`;
};

const formatDate = (value) => {
  if (!value) return '';
  return new Intl.DateTimeFormat('vi-VN').format(new Date(value));
};

const getProductImageUrl = (imageName) => {
  if (!imageName) return 'http://localhost:8080/Images/Products/no-image.png';
  if (imageName.startsWith('http')) return imageName;
  return `http://localhost:8080/Images/Products/${imageName}`;
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(Math.ceil(products.length / PAGE_SIZE), 1);
  const firstIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedProducts = products.slice(firstIndex, firstIndex + PAGE_SIZE);

  const loadProducts = () => {
    setLoading(true);
    setError('');
    getAdminProducts()
      .then((data) => {
        setProducts(data || []);
        setCurrentPage(1);
        setLoading(false);
      })
      .catch(() => {
        setError('Không tải được danh sách sản phẩm.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.tenSP}"?`);
    if (!confirmed) return;

    try {
      await deleteAdminProduct(product.maSP);
      setMessage('Đã xóa sản phẩm thành công.');
      loadProducts();
    } catch (err) {
      setMessage('');
      setError(err.response?.data?.message || 'Xóa sản phẩm thất bại.');
    }
  };

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-3 text-center">Quản lý sản phẩm</h2>

      <div className="text-start mb-4">
        <Link to="/admin/san-pham/them" className="btn btn-dark btn-view fw-bold">
          <i className="bi bi-plus-lg"></i> Thêm sản phẩm
        </Link>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && message && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle admin-products-table">
              <thead className="table-dark text-center">
                <tr>
                  <th style={{ width: '120px' }}>Hình</th>
                  <th>Tên SP</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Hiển thị</th>
                  <th>Cập nhật</th>
                  <th style={{ width: '140px' }}>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {pagedProducts.map((product) => (
                  <tr key={product.maSP}>
                    <td className="text-center">
                      <img
                        src={getProductImageUrl(product.hinhDaiDien)}
                        className="img-fluid rounded admin-product-img"
                        alt={product.tenSP}
                      />
                    </td>

                    <td>{product.tenSP}</td>
                    <td>{product.danhMuc}</td>
                    <td>{formatCurrency(product.gia)}</td>
                    <td className="text-center fw-bold">{product.tongTon}</td>
                    <td className="text-center">
                      {product.hienThi ? (
                        <span className="badge bg-success">Hiển thị</span>
                      ) : (
                        <span className="badge bg-secondary">Ẩn</span>
                      )}
                    </td>
                    <td>{formatDate(product.ngayTao)}</td>
                    <td className="text-center">
                      <Link to={`/admin/san-pham/sua/${product.maSP}`} className="btn btn-sm btn-warning fw-bold me-1">
                        Sửa
                      </Link>
                      <button type="button" className="btn btn-sm btn-danger fw-bold" onClick={() => handleDelete(product)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      Chưa có sản phẩm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {products.length > 0 && (
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3">
              <div className="text-muted">
                Hiển thị {firstIndex + 1}-{Math.min(firstIndex + PAGE_SIZE, products.length)} / {products.length} sản phẩm
              </div>

              <nav aria-label="Phân trang sản phẩm">
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" type="button" onClick={() => changePage(currentPage - 1)}>
                      Trước
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                      <button className="page-link" type="button" onClick={() => changePage(page)}>
                        {page}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" type="button" onClick={() => changePage(currentPage + 1)}>
                      Sau
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminProducts;
