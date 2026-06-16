import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAdminOrder, updateAdminOrderStatus } from '../services/adminOrderService';

const formatCurrency = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value) || 0)}₫`;

const AdminOrderUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('Đang xử lý');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminOrder(id)
      .then((data) => {
        setOrder(data);
        setStatus(data.trangThai || 'Đang xử lý');
        setLoading(false);
      })
      .catch(() => {
        setError('Không tải được thông tin đơn hàng.');
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      await updateAdminOrderStatus(id, status);
      navigate('/admin/don-hang');
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật đơn hàng thất bại.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return <div className="alert alert-danger">{error || 'Không tìm thấy đơn hàng.'}</div>;
  }

  return (
    <div className="p-4">
      <h2>Cập nhật đơn hàng #{order.maDH}</h2>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <hr />

      <h4>Thông tin khách hàng</h4>
      <p><strong>Tên:</strong> {order.tenKhachHang || 'Không có thông tin'}</p>
      <p><strong>SĐT:</strong> {order.sdt || 'Không có thông tin'}</p>
      <p><strong>Địa chỉ:</strong> {order.diaChi || order.diaChiGiaoHang || 'Không có thông tin'}</p>

      <hr />

      <h4>Chi tiết sản phẩm</h4>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {order.chiTietDonHangs?.map((detail) => (
              <tr key={detail.maCTDonHang}>
                <td>{detail.tenSP}</td>
                <td>{formatCurrency(detail.gia)}</td>
                <td>{detail.soLuong}</td>
                <td>{formatCurrency(detail.thanhTien)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr />

      <h4>Cập nhật trạng thái</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Trạng thái đơn hàng</label>
          <select className="form-select" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đã xử lý">Đã xử lý</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success" disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu cập nhật'}
        </button>
        <Link to="/admin/don-hang" className="btn btn-secondary ms-2">Quay lại</Link>
      </form>
    </div>
  );
};

export default AdminOrderUpdate;
