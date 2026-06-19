import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createAdminCustomer, getAdminCustomer, updateAdminCustomer } from '../services/adminCustomerService';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  gender: 'Khác',
  address: '',
  hobby: '',
  status: '1'
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
      .then((customer) => {
        setFormData({
          fullName: customer.hoTenKH || '',
          email: customer.email || '',
          phone: customer.sdt || '',
          password: '',
          gender: customer.gioiTinh || 'Khác',
          address: customer.diaChi || '',
          hobby: customer.soThich || '',
          status: String(customer.trangThai ?? 1)
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Không tải được thông tin khách hàng.');
        setLoading(false);
      });
  }, [id, isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (event) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 11);
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const buildPayload = () => ({
    ...formData,
    status: Number(formData.status)
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!isEdit && formData.password.trim().length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    try {
      setSaving(true);
      if (isEdit) {
        await updateAdminCustomer(id, buildPayload());
      } else {
        await createAdminCustomer(buildPayload());
      }
      navigate('/admin/khach-hang');
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu tài khoản khách hàng thất bại.');
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

  return (
    <div className="container my-5">
      <div className="card shadow rounded-4 p-4 admin-product-form-card">
        <h3 className="card-title mb-4 text-center fw-bold">
          {isEdit ? 'Sửa tài khoản khách hàng' : 'Thêm tài khoản khách hàng'}
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="fw-bold">Họ tên</label>
              <input name="fullName" className="form-control" value={formData.fullName} onChange={handleChange} required />
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold">Email</label>
              <input name="email" className="form-control" type="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold">Số điện thoại</label>
              <input name="phone" className="form-control" value={formData.phone} onChange={handlePhoneChange} required />
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold">Mật khẩu</label>
              <input
                name="password"
                className="form-control"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEdit}
                placeholder={isEdit ? 'Để trống nếu không đổi mật khẩu' : ''}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold">Giới tính</label>
              <select name="gender" className="form-select" value={formData.gender} onChange={handleChange} required>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold">Trạng thái</label>
              <select name="status" className="form-select" value={formData.status} onChange={handleChange} required>
                <option value="1">Hoạt động</option>
                <option value="0">Tạm khóa</option>
              </select>
            </div>

            <div className="col-12 mb-3">
              <label className="fw-bold">Địa chỉ</label>
              <input name="address" className="form-control" value={formData.address} onChange={handleChange} />
            </div>

            <div className="col-12 mb-3">
              <label className="fw-bold">Sở thích</label>
              <textarea name="hobby" className="form-control" rows="3" value={formData.hobby} onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className={`btn ${isEdit ? 'btn-primary' : 'btn-success'} px-5 fw-bold`} disabled={saving}>
              {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật tài khoản' : 'Lưu tài khoản'}
            </button>
            <Link to="/admin/khach-hang" className="btn btn-secondary px-4 fw-bold ms-2">
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCustomerForm;
