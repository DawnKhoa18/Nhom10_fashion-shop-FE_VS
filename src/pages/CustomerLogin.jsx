import React, { useCallback, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginCustomer, loginWithGoogle } from '../services/authService';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const saveLoginSession = useCallback((data) => {
    localStorage.removeItem('customerId');
    localStorage.removeItem('employeeId');
    localStorage.setItem(
      data.accountType === 'EMPLOYEE' ? 'employeeId' : 'customerId',
      data.accountType === 'EMPLOYEE' ? data.employeeId : data.customerId
    );
    localStorage.setItem('fullName', data.fullName);
    localStorage.setItem('email', data.email);
    localStorage.setItem('role', data.role);
    localStorage.setItem('accountType', data.accountType);
    window.dispatchEvent(new Event('profileUpdated'));

    const targetPath = data.accountType === 'EMPLOYEE'
      ? '/admin'
      : (location.state?.returnTo || '/');
    setSuccess(data.accountType === 'EMPLOYEE'
      ? 'Đăng nhập thành công! Đang chuyển đến trang quản trị...'
      : 'Đăng nhập thành công! Đang chuyển về trang chủ...');

    setTimeout(() => navigate(targetPath, { replace: true }), 700);
  }, [location.state?.returnTo, navigate]);

  const handleGoogleSuccess = useCallback(async (credential) => {
    setSubmitting(true);
    setErrors({});
    setSuccess('');
    try {
      const response = await loginWithGoogle(credential);
      saveLoginSession(response.data);
    } catch (error) {
      setErrors({ general: error.response?.data || 'Đăng nhập Google thất bại' });
    } finally {
      setSubmitting(false);
    }
  }, [saveLoginSession]);

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
    setSuccess('');
    try {
      const response = await loginCustomer({ email: email.trim(), password });
      saveLoginSession(response.data);
    } catch (error) {
      setErrors({ general: error.response?.data || 'Đăng nhập thất bại' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-5" style={{ minHeight: 'calc(100vh - 250px)' }}>
      <div className="card border-0 shadow p-4 rounded-4" style={{ width: '100%', maxWidth: 420 }}>
        <h3 className="text-center fw-bold mb-2" style={{ color: '#f59e0b' }}>Đăng nhập</h3>

        {location.state?.message && <div className="alert alert-warning py-2">{location.state.message}</div>}
        {errors.general && <div className="alert alert-danger py-2">{errors.general}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((old) => ({ ...old, email: '' }));
              }}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Mật khẩu</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((old) => ({ ...old, password: '' }));
                }}
              />
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={() => setShowPassword((value) => !value)}
                aria-label="Hiện hoặc ẩn mật khẩu"
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
          </div>

          <button type="submit" className="btn btn-dark w-100 fw-bold py-2 btn-view rounded-3" disabled={submitting || !!success}>
            {submitting ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        <div className="d-flex align-items-center gap-2 my-3">
          <hr className="flex-grow-1" />
          <span className="text-muted small">hoặc</span>
          <hr className="flex-grow-1" />
        </div>

        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onError={(message) => setErrors({ general: message })}
        />

        <div className="text-center mt-3">
          <Link to="/quen-mat-khau" className="text-decoration-none">Quên mật khẩu?</Link>
        </div>

        <p className="text-center mt-3 mb-0">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-primary fw-semibold text-decoration-none">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerLogin;
