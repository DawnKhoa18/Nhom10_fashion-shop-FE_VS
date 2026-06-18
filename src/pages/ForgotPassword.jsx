import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/authService';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateForm = (event) => {
    setForm((old) => ({ ...old, [event.target.name]: event.target.value }));
    setError('');
    setMessage('');
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();
    if (!form.email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const response = await forgotPassword(form.email.trim());
      setMessage(response.data);
      setStep(2);
    } catch (err) {
      setError(err.response?.data || 'Không gửi được OTP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (!form.otp.trim()) {
      setError('Vui lòng nhập mã OTP');
      return;
    }
    if (form.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Xác nhận mật khẩu không khớp');
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const response = await resetPassword({
        email: form.email.trim(),
        otp: form.otp.trim(),
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });
      alert(response.data);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Đổi mật khẩu thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-5" style={{ minHeight: 'calc(100vh - 250px)' }}>
      <div className="card border-0 shadow p-4 rounded-4" style={{ width: '100%', maxWidth: 460 }}>
        <h3 className="text-center fw-bold mb-2" style={{ color: '#f59e0b' }}>Quên mật khẩu</h3>
        <p className="text-center text-muted mb-4">
          Nhập email tài khoản khách hàng để nhận mã OTP đặt lại mật khẩu.
        </p>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {message && <div className="alert alert-success py-2">{message}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email của bạn"
                value={form.email}
                onChange={updateForm}
              />
            </div>
            <button type="submit" className="btn btn-dark w-100 fw-bold py-2" disabled={submitting}>
              {submitting ? 'Đang gửi...' : 'Gửi mã OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input type="email" className="form-control" value={form.email} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Mã OTP</label>
              <input
                name="otp"
                className="form-control"
                placeholder="Nhập mã 6 số"
                value={form.otp}
                onChange={updateForm}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Mật khẩu mới</label>
              <input
                type="password"
                name="newPassword"
                className="form-control"
                placeholder="Mật khẩu mới"
                value={form.newPassword}
                onChange={updateForm}
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Xác nhận mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Nhập lại mật khẩu mới"
                value={form.confirmPassword}
                onChange={updateForm}
              />
            </div>
            <button type="submit" className="btn btn-dark w-100 fw-bold py-2" disabled={submitting}>
              {submitting ? 'Đang đổi...' : 'Đổi mật khẩu'}
            </button>
            <button
              type="button"
              className="btn btn-link w-100 mt-2"
              onClick={() => setStep(1)}
            >
              Gửi lại OTP
            </button>
          </form>
        )}

        <div className="text-center mt-3">
          <Link to="/login" className="text-decoration-none">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
