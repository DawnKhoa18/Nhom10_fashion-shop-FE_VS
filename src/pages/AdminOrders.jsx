import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminOrders } from '../services/adminOrderService';

const PAGE_SIZE = 25;

const formatCurrency = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value) || 0)}₫`;

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

const StatusBadge = ({ status }) => {
  if (status === 'Đã xử lý') {
    return <span className="badge bg-success">Đã xử lý</span>;
  }

  if (status === 'Đã hủy') {
    return <span className="badge bg-danger">Đã hủy</span>;
  }

  return <span className="badge bg-warning text-dark">Đang xử lý</span>;
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(Math.ceil(orders.length / PAGE_SIZE), 1);
  const firstIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedOrders = orders.slice(firstIndex, firstIndex + PAGE_SIZE);

  useEffect(() => {
    getAdminOrders()
      .then((data) => {
        setOrders(data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Không tải được danh sách đơn hàng.');
        setLoading(false);
      });
  }, []);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-4">
      <h2 className="mb-3">Quản lý đơn hàng</h2>

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
            <table className="table table-bordered table-striped align-middle admin-orders-table">
              <thead className="table-dark">
                <tr>
                  <th>Mã ĐH</th>
                  <th>Khách hàng</th>
                  <th>Ngày tạo</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {pagedOrders.map((order) => (
                  <tr key={order.maDH}>
                    <td>{order.soDon}</td>
                    <td>{order.tenKhachHang || 'Không có khách'}</td>
                    <td>{formatDateTime(order.ngayTao)}</td>
                    <td>{formatCurrency(order.tongTien)}</td>
                    <td><StatusBadge status={order.trangThai} /></td>
                    <td>
                      {order.trangThai !== 'Đã hủy' ? (
                        <Link to={`/admin/don-hang/cap-nhat/${order.maDH}`} className="btn btn-sm btn-primary">
                          Cập nhật
                        </Link>
                      ) : (
                        <span className="text-muted fst-italic">Không thể cập nhật</span>
                      )}
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">Không có đơn hàng nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {orders.length > 0 && (
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3">
              <div className="text-muted">
                Hiển thị {firstIndex + 1}-{Math.min(firstIndex + PAGE_SIZE, orders.length)} / {orders.length} đơn hàng
              </div>

              <nav aria-label="Phân trang đơn hàng">
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" type="button" onClick={() => changePage(currentPage - 1)}>Trước</button>
                  </li>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                      <button className="page-link" type="button" onClick={() => changePage(page)}>{page}</button>
                    </li>
                  ))}

                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" type="button" onClick={() => changePage(currentPage + 1)}>Sau</button>
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

export default AdminOrders;
