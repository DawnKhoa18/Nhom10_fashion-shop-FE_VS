import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cancelMyOrder, getMyOrders } from '../services/orderService';

const formatCurrency = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value) || 0)}₫`;
const formatDate = (value) => value ? new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
}).format(new Date(value)) : '';

const StatusBadge = ({ status }) => {
  if (status === 'Đã hủy') return <span className="badge bg-danger">{status}</span>;
  if (status === 'Đã xử lý') return <span className="badge bg-success">{status}</span>;
  return <span className="badge bg-warning text-dark">{status}</span>;
};

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('customerId')) {
      navigate('/login/customer', { replace: true });
      return;
    }

    getMyOrders()
      .then((data) => setOrders(data || []))
      .catch(() => setError('Không tải được danh sách đơn hàng.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleCancel = async (order) => {
    if (!window.confirm(`Bạn có chắc muốn hủy đơn ${order.orderNumber}?`)) return;

    setCancellingId(order.id);
    setError('');
    try {
      await cancelMyOrder(order.id);
      setOrders((current) => current.map((item) =>
        item.id === order.id ? { ...item, status: 'Đã hủy' } : item
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Hủy đơn hàng thất bại.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border" /></div>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Đơn hàng của tôi</h2>
        <Link to="/" className="btn btn-outline-dark">Tiếp tục mua sắm</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {orders.length === 0 ? (
        <div className="text-center border rounded-4 py-5">
          <i className="bi bi-box-seam fs-1 text-muted" />
          <p className="text-muted mt-3">Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-dark">
              <tr><th>Mã đơn</th><th>Ngày đặt</th><th>Địa chỉ</th><th>Tổng tiền</th><th>Trạng thái</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="fw-bold">{order.orderNumber}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.shippingAddress}</td>
                  <td className="text-danger fw-bold">{formatCurrency(order.totalAmount)}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td className="text-nowrap">
                    <Link to={`/don-hang-cua-toi/${order.id}`} className="btn btn-sm btn-outline-dark me-2">Chi tiết</Link>
                    {order.status === 'Đang xử lý' && (
                      <button className="btn btn-sm btn-outline-danger" disabled={cancellingId === order.id} onClick={() => handleCancel(order)}>
                        {cancellingId === order.id ? 'Đang hủy...' : 'Hủy đơn'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
