import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { changeCustomerPassword, getCustomerProfile, updateCustomerProfile } from '../services/customerService';

const AccountPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({ fullName: '', email: '', phone: '', gender: 'Khác', address: '', hobby: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!localStorage.getItem('customerId')) {
      navigate('/login/customer', { replace: true });
      return;
    }
    getCustomerProfile().then((data) => setProfile({ ...data, address: data.address || '', hobby: data.hobby || '' }))
      .catch(() => setMessage({ type: 'danger', text: 'Không tải được thông tin tài khoản.' }))
      .finally(() => setLoading(false));
  }, [navigate]);

  const saveProfile = async (event) => {
    event.preventDefault(); setSaving(true); setMessage({ type: '', text: '' });
    try {
      const response = await updateCustomerProfile(profile);
      setProfile({ ...response.profile, address: response.profile.address || '', hobby: response.profile.hobby || '' });
      localStorage.setItem('fullName', response.profile.fullName);
      window.dispatchEvent(new Event('profileUpdated'));
      setMessage({ type: 'success', text: response.message });
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || 'Cập nhật thất bại.' });
    } finally { setSaving(false); }
  };

  const changePassword = async (event) => {
    event.preventDefault(); setSaving(true); setMessage({ type: '', text: '' });
    try {
      const response = await changeCustomerPassword(passwords);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: response.message });
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || 'Đổi mật khẩu thất bại.' });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border" /></div>;

  return (
    <div className="container my-5">
      <div className="row g-4">
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm p-3">
            <div className="text-center border-bottom pb-3 mb-3"><i className="bi bi-person-circle display-4" /><div className="fw-bold mt-2">{profile.fullName}</div><small className="text-muted">{profile.email}</small></div>
            <button className={`btn text-start mb-2 ${tab === 'profile' ? 'btn-dark' : 'btn-light'}`} onClick={() => { setTab('profile'); setMessage({ type: '', text: '' }); }}><i className="bi bi-person me-2" />Thông tin cá nhân</button>
            <Link to="/don-hang-cua-toi" className="btn btn-light text-start mb-2"><i className="bi bi-box-seam me-2" />Đơn hàng của tôi</Link>
            <button className={`btn text-start ${tab === 'password' ? 'btn-dark' : 'btn-light'}`} onClick={() => { setTab('password'); setMessage({ type: '', text: '' }); }}><i className="bi bi-key me-2" />Đổi mật khẩu</button>
          </div>
        </div>

        <div className="col-lg-9">
          <div className="card border-0 shadow-sm p-4">
            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
            {tab === 'profile' ? (
              <form onSubmit={saveProfile}>
                <h3 className="fw-bold mb-4">Thông tin cá nhân</h3>
                <div className="row g-3">
                  <div className="col-md-6"><label className="form-label fw-semibold">Họ và tên</label><input className="form-control" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} required /></div>
                  <div className="col-md-6"><label className="form-label fw-semibold">Email</label><input className="form-control bg-light" value={profile.email} disabled /></div>
                  <div className="col-md-6"><label className="form-label fw-semibold">Số điện thoại</label><input className="form-control" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value.replace(/\D/g, '').slice(0, 11) })} required /></div>
                  <div className="col-md-6"><label className="form-label fw-semibold">Giới tính</label><select className="form-select" value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })}><option>Nam</option><option>Nữ</option><option>Khác</option></select></div>
                  <div className="col-12"><label className="form-label fw-semibold">Địa chỉ</label><input className="form-control" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} /></div>
                  <div className="col-12"><label className="form-label fw-semibold">Sở thích</label><textarea className="form-control" rows="3" value={profile.hobby} onChange={(e) => setProfile({ ...profile, hobby: e.target.value })} /></div>
                </div>
                <button className="btn btn-dark mt-4 px-4" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
              </form>
            ) : (
              <form onSubmit={changePassword} style={{ maxWidth: 550 }}>
                <h3 className="fw-bold mb-4">Đổi mật khẩu</h3>
                <div className="mb-3"><label className="form-label fw-semibold">Mật khẩu hiện tại</label><input type="password" className="form-control" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required /></div>
                <div className="mb-3"><label className="form-label fw-semibold">Mật khẩu mới</label><input type="password" className="form-control" minLength="6" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required /></div>
                <div className="mb-3"><label className="form-label fw-semibold">Xác nhận mật khẩu mới</label><input type="password" className="form-control" minLength="6" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required /></div>
                <button className="btn btn-dark px-4" disabled={saving}>{saving ? 'Đang xử lý...' : 'Đổi mật khẩu'}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
