import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { cancelMyOrder, getMyOrderDetail } from '../services/orderService';
import { getFullImageUrl } from '../services/productService';
import { createProductReview } from '../services/reviewService';

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
  const [reviewItem, setReviewItem] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', content: '' });
  const [reviewing, setReviewing] = useState(false);
  const [reviewMessage, setReviewMessage] = useState({ type: '', text: '' });

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

  const openReview = (item) => {
    setReviewItem(item);
    setReviewForm({ rating: 5, title: '', content: '' });
    setReviewMessage({ type: '', text: '' });
  };

  const closeReview = () => {
    if (reviewing) return;
    setReviewItem(null);
    setReviewMessage({ type: '', text: '' });
  };

  const submitReview = async (event) => {
    event.preventDefault();
    if (!reviewItem) return;

    setReviewing(true);
    setReviewMessage({ type: '', text: '' });
    try {
      const response = await createProductReview({
        orderId: order.id,
        productId: reviewItem.productId,
        ...reviewForm
      });
      setOrder((current) => ({
        ...current,
        items: current.items.map((item) => item.productId === reviewItem.productId
          ? { ...item, canReview: false, reviewed: true }
          : item)
      }));
      setReviewMessage({ type: 'success', text: response.message || 'Gửi đánh giá thành công.' });
      setTimeout(() => setReviewItem(null), 900);
    } catch (err) {
      setReviewMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Không gửi được đánh giá.'
      });
    } finally {
      setReviewing(false);
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
        <Link to="/don-hang-cua-toi" className="btn btn-outline-dark btn-view rounded-3 fw-bold">Quay lại</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm mb-4"><div className="card-body">
        <div><strong>Trạng thái:</strong> <span className={`badge ${order.status === 'Đã hủy' ? 'bg-danger' : order.status === 'Đã xử lý' ? 'bg-success' : 'bg-warning text-dark'}`}>{order.status}</span></div>
        <div className="mt-2"><strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}</div>
      </div></div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light"><tr><th>Sản phẩm</th><th>Phân loại</th><th>Giá</th><th>Số lượng</th><th>Thành tiền</th><th>Đánh giá</th></tr></thead>
          <tbody>
            {order.items?.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    {item.thumbnail && <img src={getFullImageUrl(`/images/Products/${item.thumbnail}`)} alt={item.productName} style={{ width: 70, height: 70, objectFit: 'cover' }} className="rounded" />}
                    <Link to={`/san-pham/${item.productId}`} className="fw-semibold text-dark text-decoration-none">
                      {item.productName}
                    </Link>
                  </div>
                </td>
                <td>{[item.color, item.size].filter(Boolean).join(' / ') || '-'}</td>
                <td>{formatCurrency(item.price)}</td>
                <td>{item.quantity}</td>
                <td className="fw-bold">{formatCurrency(item.subTotal)}</td>
                <td className="text-nowrap">
                  {item.canReview ? (
                    <button className="btn btn-sm btn-dark btn-view rounded-3 fw-bold" onClick={() => openReview(item)}>
                      <i className="bi bi-star me-1" />Đánh giá
                    </button>
                  ) : item.reviewed ? (
                    <span className="badge bg-success"><i className="bi bi-check-circle me-1" />Đã đánh giá</span>
                  ) : (
                    <span className="text-muted small">Chờ giao hàng</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr><td colSpan="5" className="text-end fw-bold">Tổng cộng</td><td className="text-danger fw-bold fs-5">{formatCurrency(order.totalAmount)}</td></tr></tfoot>
        </table>
      </div>

      {order.status === 'Đang xử lý' && (
        <div className="text-end"><button className="btn btn-danger" disabled={cancelling} onClick={handleCancel}>{cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}</button></div>
      )}

      {reviewItem && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.55)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={submitReview}>
                <div className="modal-header">
                  <div>
                    <h5 className="modal-title fw-bold">Đánh giá sản phẩm</h5>
                    <div className="small text-muted mt-1">{reviewItem.productName}</div>
                  </div>
                  <button type="button" className="btn-close" onClick={closeReview} />
                </div>
                <div className="modal-body">
                  {reviewMessage.text && (
                    <div className={`alert alert-${reviewMessage.type}`}>{reviewMessage.text}</div>
                  )}
                  <label className="form-label fw-semibold">Số sao</label>
                  <div className="d-flex gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="btn p-0 border-0"
                        onClick={() => setReviewForm((current) => ({ ...current, rating: star }))}
                        aria-label={`${star} sao`}
                      >
                        <i className={`bi ${star <= reviewForm.rating ? 'bi-star-fill text-warning' : 'bi-star text-secondary'} fs-3`} />
                      </button>
                    ))}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Tiêu đề</label>
                    <input
                      className="form-control"
                      maxLength="150"
                      value={reviewForm.title}
                      onChange={(event) => setReviewForm((current) => ({ ...current, title: event.target.value }))}
                      placeholder="Ví dụ: Sản phẩm rất đẹp"
                    />
                  </div>
                  <div>
                    <label className="form-label fw-semibold">Nội dung đánh giá</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      maxLength="1000"
                      required
                      value={reviewForm.content}
                      onChange={(event) => setReviewForm((current) => ({ ...current, content: event.target.value }))}
                      placeholder="Chia sẻ cảm nhận của bạn..."
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-dark fw-bold" onClick={closeReview}>Đóng</button>
                  <button type="submit" className="btn btn-dark btn-view rounded-3 fw-bold" disabled={reviewing}>
                    {reviewing ? 'Đang gửi...' : 'Gửi đánh giá'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOrderDetail;
