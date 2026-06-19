import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { createChatSocket } from '../../services/chatSocket';

const getAdminNavClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [chatUnread, setChatUnread] = useState(0);

  useEffect(() => {
    const calculateUnread = (conversations) => {
      const readMap = JSON.parse(localStorage.getItem('adminChatLastRead') || '{}');
      const total = (conversations || []).reduce((sum, conversation) => (
        sum + (conversation.messages || []).filter(
          (message) => message.senderRole === 'CUSTOMER'
            && Number(message.id) > Number(readMap[conversation.customerId] || 0)
        ).length
      ), 0);
      setChatUnread(total);
    };

    let latestConversations = [];
    const socket = createChatSocket({
      role: 'ADMIN',
      userId: localStorage.getItem('employeeId') || 'admin',
      name: localStorage.getItem('fullName') || 'Nhân viên',
      onEvent: (event) => {
        if (event.type === 'SNAPSHOT') {
          latestConversations = event.conversations || [];
          calculateUnread(latestConversations);
        }
      }
    });
    const refreshUnread = () => calculateUnread(latestConversations);
    window.addEventListener('chatReadUpdated', refreshUnread);
    return () => {
      socket.close();
      window.removeEventListener('chatReadUpdated', refreshUnread);
    };
  }, []);

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

          <li className="nav-item">
            <NavLink className={getAdminNavClass} to="/admin/khach-hang">
              <i className="bi bi-people-fill"></i>
              <span>Khách Hàng</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className={getAdminNavClass} to="/admin/tro-chuyen">
              <span className="admin-chat-nav-icon">
                <i className="bi bi-chat-dots-fill"></i>
                {chatUnread > 0 && <b>{chatUnread > 99 ? '99+' : chatUnread}</b>}
              </span>
              <span>Trò Chuyện</span>
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
