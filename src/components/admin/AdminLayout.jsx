import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const getAdminNavClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('employeeId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('accountType');
    navigate('/login', { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="text-center mb-4 admin-logo">
          <img src="/images/logoShopQuanAo.jpg" className="img-fluid" width="150" alt="Logo Shop Quan Ao" />
        </div>

        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <i className="bi bi-house-door-fill"></i>
              <span>Trang Chủ Web</span>
            </Link>
          </li>

          <li className="nav-item">
            <NavLink className={getAdminNavClass} to="/admin" end>
              <i className="bi bi-grid-fill"></i>
              <span>Trang Chủ Admin</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className={getAdminNavClass} to="/admin/san-pham">
              <i className="bi bi-bag-fill"></i>
              <span>Sản Phẩm</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className={getAdminNavClass} to="/admin/khach-hang">
              <i className="bi bi-people-fill"></i>
              <span>Khách Hàng</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className={getAdminNavClass} to="/admin/don-hang">
              <i className="bi bi-box-seam"></i>
              <span>Đơn Hàng</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className={getAdminNavClass} to="/admin/thong-ke">
              <i className="bi bi-bar-chart-line-fill"></i>
              <span>Thống Kê</span>
            </NavLink>
          </li>
        </ul>

        <div className="mt-auto pt-4">
          <button type="button" className="nav-link border-0 bg-transparent w-100 text-start" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            <span>Đăng Xuất</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
