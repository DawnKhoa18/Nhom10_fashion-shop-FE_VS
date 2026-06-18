import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { cancelMyOrder, getMyOrderDetail } from '../services/orderService';
import { getFullImageUrl } from '../services/productService';

const formatCurrency = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value) || 0)}₫`;
const formatDate = (value) => value ? new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
}).format(new Date(value)) : '';

const CustomerOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('customerId')) {
      navigate('/login/customer', { replace: true });
      return;
    }

    getMyOrderDetail(id)
      .then(setOrder)
      .catch(() => setError('Không tìm thấy đơn hàng.'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleCancel = async () => {
    if (!window.confirm(`Bạn có chắc muốn hủy đơn ${order.orderNumber}?`)) return;
    setCancelling(true);
    try {
      await cancelMyOrder(order.id);
      setOrder((current) => ({ ...current, status: 'Đã hủy' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Hủy đơn hàng thất bại.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border" /></div>;
  if (!order) return <div className="container my-5 alert alert-danger">{error}</div>;

  return (
    <div className="container my-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Chi tiết đơn {order.orderNumber}</h2>
          <span className="text-muted">Ngày đặt: {formatDate(order.createdAt)}</span>
        </div>
        <Link to="/don-hang-cua-toi" className="btn btn-outline-dark">Quay lại</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm mb-4"><div className="card-body">
        <div><strong>Trạng thái:</strong> <span className={`badge ${order.status === 'Đã hủy' ? 'bg-danger' : order.status === 'Đã xử lý' ? 'bg-success' : 'bg-warning text-dark'}`}>{order.status}</span></div>
        <div className="mt-2"><strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}</div>
      </div></div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light"><tr><th>Sản phẩm</th><th>Phân loại</th><th>Giá</th><th>Số lượng</th><th>Thành tiền</th></tr></thead>
          <tbody>
            {order.items?.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    {item.thumbnail && <img src={getFullImageUrl(`/images/Products/${item.thumbnail}`)} alt={item.productName} style={{ width: 70, height: 70, objectFit: 'cover' }} className="rounded" />}
                    <span className="fw-semibold">{item.productName}</span>
                  </div>
                </td>
                <td>{[item.color, item.size].filter(Boolean).join(' / ') || '-'}</td>
                <td>{formatCurrency(item.price)}</td>
                <td>{item.quantity}</td>
                <td className="fw-bold">{formatCurrency(item.subTotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr><td colSpan="4" className="text-end fw-bold">Tổng cộng</td><td className="text-danger fw-bold fs-5">{formatCurrency(order.totalAmount)}</td></tr></tfoot>
        </table>
      </div>

      {order.status === 'Đang xử lý' && (
        <div className="text-end"><button className="btn btn-danger" disabled={cancelling} onClick={handleCancel}>{cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}</button></div>
      )}
    </div>
  );
};

export default CustomerOrderDetail;
