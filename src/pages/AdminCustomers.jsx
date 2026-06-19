import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminCustomers } from '../services/adminCustomerService';

const PAGE_SIZE = 25;

const formatDateTime = (value) => {
  if (!value) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
};

const StatusBadge = ({ status }) => (
  Number(status) === 1
    ? <span className="badge bg-success">Hoạt động</span>
    : <span className="badge bg-secondary">Tạm khóa</span>
);

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getAdminCustomers()
      .then((data) => {
        setCustomers(data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Không tải được danh sách khách hàng.');
        setLoading(false);
      });
  }, []);

  const filteredCustomers = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    if (!text) return customers;
    return customers.filter((customer) => (
      customer.hoTenKH?.toLowerCase().includes(text)
      || customer.email?.toLowerCase().includes(text)
      || customer.sdt?.includes(text)
    ));
  }, [customers, keyword]);

  const totalPages = Math.max(Math.ceil(filteredCustomers.length / PAGE_SIZE), 1);
  const firstIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedCustomers = filteredCustomers.slice(firstIndex, firstIndex + PAGE_SIZE);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (event) => {
    setKeyword(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-3 text-center">Quản lý khách hàng</h2>

      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <Link to="/admin/khach-hang/them" className="btn btn-dark btn-view fw-bold">
          <i className="bi bi-person-plus-fill"></i> Thêm khách hàng
        </Link>

        <div className="admin-search-box">
          <i className="bi bi-search"></i>
          <input
            type="search"
            className="form-control"
            placeholder="Tìm tên, email, số điện thoại..."
            value={keyword}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      )}

      {!loading && error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle admin-customers-table">
              <thead className="table-dark text-center">
                <tr>
                  <th style={{ width: '80px' }}>Mã KH</th>
                  <th>Khách hàng</th>
                  <th>Liên hệ</th>
                  <th>Giới tính</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th style={{ width: '120px' }}>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {pagedCustomers.map((customer) => (
                  <tr key={customer.maKH}>
                    <td className="text-center fw-bold">{customer.maKH}</td>
                    <td>
                      <div className="fw-bold">{customer.hoTenKH}</div>
                      <small className="text-muted">{customer.diaChi || 'Chưa cập nhật địa chỉ'}</small>
                    </td>
                    <td>
                      <div>{customer.email}</div>
                      <small className="text-muted">{customer.sdt}</small>
                    </td>
                    <td className="text-center">{customer.gioiTinh || 'Khác'}</td>
                    <td className="text-center"><StatusBadge status={customer.trangThai} /></td>
                    <td>{formatDateTime(customer.ngayTao)}</td>
                    <td className="text-center">
                      <Link to={`/admin/khach-hang/sua/${customer.maKH}`} className="btn btn-sm btn-warning fw-bold">
                        Sửa
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      Không có khách hàng phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length > 0 && (
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3">
              <div className="text-muted">
                Hiển thị {firstIndex + 1}-{Math.min(firstIndex + PAGE_SIZE, filteredCustomers.length)} / {filteredCustomers.length} khách hàng
              </div>

              <nav aria-label="Phân trang khách hàng">
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

export default AdminCustomers;
