import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createAdminCustomer, getAdminCustomer, updateAdminCustomer } from '../services/adminCustomerService';

const initialForm = {
  fullName: '', email: '', phone: '', password: '',
  gender: 'Khác', address: '', hobby: '', status: '1'
};

const AdminCustomerForm = ({ mode }) => {
  const isEdit = mode === 'edit';
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    getAdminCustomer(id)
      .then((customer) => setFormData({
        fullName: customer.hoTenKH || '',
        email: customer.email || '',
        phone: customer.sdt || '',
        password: '',
        gender: customer.gioiTinh || 'Khác',
        address: customer.diaChi || '',
        hobby: customer.soThich || '',
        status: String(customer.trangThai ?? 1)
      }))
      .catch(() => setError('Không tải được thông tin khách hàng.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...formData, status: Number(formData.status) };
      if (isEdit) await updateAdminCustomer(id, payload);
      else await createAdminCustomer(payload);
      navigate('/admin/khach-hang');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Lưu tài khoản khách hàng thất bại.');
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-dark" /></div>;

  return (
    <div className="container my-5">
      <div className="card shadow rounded-4 p-4 admin-product-form-card">
        <h3 className="text-center fw-bold mb-4">{isEdit ? 'Sửa tài khoản khách hàng' : 'Thêm tài khoản khách hàng'}</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            {[
              ['fullName', 'Họ tên', 'text'], ['email', 'Email', 'email'],
              ['phone', 'Số điện thoại', 'tel'], ['password', 'Mật khẩu', 'password']
            ].map(([name, label, type]) => (
              <div className="col-md-6 mb-3" key={name}>
                <label className="fw-bold mb-1">{label}</label>
                <input
                  name={name}
                  type={type}
                  className="form-control"
                  value={formData[name]}
                  required={name !== 'password' || !isEdit}
                  placeholder={name === 'password' && isEdit ? 'Để trống nếu không đổi mật khẩu' : ''}
                  onChange={(event) => setFormData((current) => ({
                    ...current,
                    [name]: name === 'phone' ? event.target.value.replace(/\D/g, '').slice(0, 11) : event.target.value
                  }))}
                />
              </div>
            ))}
            <div className="col-md-6 mb-3">
              <label className="fw-bold mb-1">Giới tính</label>
              <select className="form-select" value={formData.gender} onChange={(event) => setFormData((current) => ({ ...current, gender: event.target.value }))}>
                <option>Nam</option><option>Nữ</option><option>Khác</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="fw-bold mb-1">Trạng thái</label>
              <select className="form-select" value={formData.status} onChange={(event) => setFormData((current) => ({ ...current, status: event.target.value }))}>
                <option value="1">Hoạt động</option><option value="0">Tạm khóa</option>
              </select>
            </div>
            <div className="col-12 mb-3">
              <label className="fw-bold mb-1">Địa chỉ</label>
              <input className="form-control" value={formData.address} onChange={(event) => setFormData((current) => ({ ...current, address: event.target.value }))} />
            </div>
            <div className="col-12 mb-3">
              <label className="fw-bold mb-1">Sở thích</label>
              <textarea className="form-control" rows="3" value={formData.hobby} onChange={(event) => setFormData((current) => ({ ...current, hobby: event.target.value }))} />
            </div>
          </div>
          <div className="text-center">
            <button className="btn btn-dark btn-view px-5 fw-bold" disabled={saving}>{saving ? 'Đang lưu...' : isEdit ? 'Cập nhật tài khoản' : 'Lưu tài khoản'}</button>
            <Link to="/admin/khach-hang" className="btn btn-secondary px-4 fw-bold ms-2">Hủy</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCustomerForm;
