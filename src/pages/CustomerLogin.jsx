import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginCustomer } from '../services/authService';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Email không đúng định dạng';
    if (!password) nextErrors.password = 'Vui lòng nhập mật khẩu';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      const response = await loginCustomer({ email: email.trim(), password });
      localStorage.removeItem('customerId');
      localStorage.removeItem('employeeId');
      localStorage.setItem(response.data.accountType === 'EMPLOYEE' ? 'employeeId' : 'customerId',
        response.data.accountType === 'EMPLOYEE' ? response.data.employeeId : response.data.customerId);
      localStorage.setItem('fullName', response.data.fullName);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('accountType', response.data.accountType);
      window.dispatchEvent(new Event('profileUpdated'));
      navigate(response.data.accountType === 'EMPLOYEE' ? '/admin' : '/');
    } catch (error) {
      setErrors({ general: error.response?.data || 'Đăng nhập thất bại' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-5" style={{ minHeight: 'calc(100vh - 250px)' }}>
      <div className="card border-0 shadow p-4 rounded-4" style={{ width: '100%', maxWidth: 420 }}>
        <h3 className="text-center fw-bold mb-2" style={{ color: '#f59e0b' }}>Đăng Nhập</h3>
        <p className="text-center text-muted mb-4">Dành cho khách hàng và nhân viên</p>
        {errors.general && <div className="alert alert-danger py-2">{errors.general}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="Email của bạn" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((old) => ({ ...old, email: '' })); }} />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Mật khẩu</label>
            <div className="input-group">
              <input type={showPassword ? 'text' : 'password'} className={`form-control ${errors.password ? 'is-invalid' : ''}`} placeholder="Mật khẩu" value={password} onChange={(e) => { setPassword(e.target.value); setErrors((old) => ({ ...old, password: '' })); }} />
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword((value) => !value)} aria-label="Hiện hoặc ẩn mật khẩu">
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
          </div>
          <button type="submit" className="btn btn-dark w-100 fw-bold py-2" disabled={submitting}>{submitting ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}</button>
        </form>
        <p className="text-center mt-3 mb-0">Chưa có tài khoản? <Link to="/register" className="text-primary fw-semibold text-decoration-none">Đăng ký ngay</Link></p>
      </div>
    </div>
  );
};

export default CustomerLogin;
