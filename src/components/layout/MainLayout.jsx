import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useCart } from '../../context/CartContext';
import CustomerChatWidget from '../chat/CustomerChatWidget';

const MainLayout = ({ children, session, menuData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { categories, parentCats, loading } = useCategories();
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const { cartCount } = useCart();

  const [fullName, setFullName] = useState(localStorage.getItem("fullName"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [accountType, setAccountType] = useState(localStorage.getItem("accountType"));
  const [searchKeyword, setSearchKeyword] = useState("");
  const imageSearchInputRef = useRef(null);
  const isEmployee = accountType === "EMPLOYEE";

  useEffect(() => {
    const updateProfileName = () => {
      setFullName(localStorage.getItem("fullName"));
      setRole(localStorage.getItem("role"));
      setAccountType(localStorage.getItem("accountType"));
    };
    window.addEventListener('profileUpdated', updateProfileName);
    return () => window.removeEventListener('profileUpdated', updateProfileName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customerId");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("accountType");
    window.location.href = "/login";
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const keyword = searchKeyword.trim();
    if (!keyword) return;
    navigate(`/tim-kiem?keyword=${encodeURIComponent(keyword)}`);
  };

  const handleImageSearch = (event) => {
    const imageFile = event.target.files?.[0];
    if (!imageFile) return;
    event.target.value = '';

    if (location.pathname === '/tim-kiem-hinh-anh') {
      window.dispatchEvent(new CustomEvent('imageSearchRequested', {
        detail: { imageFile }
      }));
      return;
    }

    navigate('/tim-kiem-hinh-anh', {
      state: { imageFile, requestId: Date.now() }
    });
  };

  return (
    <div className="main-layout">
      <div className="sticky-top" style={{ zIndex: 1050 }}>
        <header className="bg-black py-2">
          <div className="container d-flex align-items-center justify-content-between">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="d-flex align-items-center mx-2">
              <img src="/images/logoShopQuanAo.jpg" alt="logo" style={{ height: '60px', cursor: 'pointer' }} />
            </Link>

            <form className="header-search d-none d-lg-flex flex-grow-1 mx-4" style={{ maxWidth: '600px' }} onSubmit={handleSearchSubmit}>
              <div className="input-group position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Bạn đang tìm gì..."
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}

                  style={{ paddingRight: '88px' }}
                />

                {}
                {searchKeyword && (
                  <button
                    type="button"
                    className="btn position-absolute border-0"
                    style={{
                      zIndex: 10,
                      top: 0,
                      right: '45px',
                      height: '100%',
                      background: 'transparent',
                      color: '#6c757d',
                      padding: '0 10px'
                    }}
                    onClick={() => setSearchKeyword("")}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}

                <button
                  type="button"
                  className="header-image-search-btn"
                  onClick={() => imageSearchInputRef.current?.click()}
                  title="Tìm kiếm bằng hình ảnh"
                  aria-label="Tìm kiếm bằng hình ảnh"
                >
                  <i className="bi bi-camera-fill" />
                </button>
                <input
                  ref={imageSearchInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                  onChange={handleImageSearch}
                />

                <button className="btn btn-outline-light" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>

            <div className="d-flex align-items-center text-white">
              <Link to="/cua-hang" className="text-white mx-2 mx-lg-3 text-center text-decoration-none link-light hover-scale hover-lift">
                <i className="bi bi-shop fs-4"></i>
                <div className="d-none d-lg-block">Cửa hàng</div>
              </Link>

              {fullName ? (
                <div className="text-white mx-2 mx-lg-3 text-center">
                  <Link to={isEmployee ? "/admin" : "/tai-khoan"} className="text-white text-decoration-none d-block">
                    <i className="bi bi-person-circle fs-4"></i>
                    <div className="d-none d-lg-block" style={{ fontSize: '14px' }}>
                      {fullName}
                    </div>
                  </Link>
                  <small style={{ color: "#ffc107", fontSize: "12px" }}>
                    {isEmployee ? "Admin" : role}
                  </small>
                  <div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="btn btn-sm btn-outline-light mt-1"
                      style={{ fontSize: "11px", padding: "2px 6px" }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="text-white mx-2 mx-lg-3 text-center text-decoration-none link-light hover-scale hover-lift">
                  <i className="bi bi-person fs-4"></i>
                  <div className="d-none d-lg-block">Đăng nhập</div>
                </Link>
              )}

              <Link to="/gio-hang" className="text-white mx-3 text-center text-decoration-none link-light hover-scale hover-lift">
                <div className="position-relative d-inline-block">
                  <i className="bi bi-cart3 fs-4"></i>
                  <span className="badge rounded-pill bg-danger cart-badge-custom badge-bounce">
                    {cartCount}
                  </span>
                </div>
                <div className="d-none d-lg-block">Giỏ hàng</div>
              </Link>
            </div>
          </div>
        </header>

        <nav className="navbar navbar-expand-lg bg-white shadow-sm py-0">
          <div className="container">
            <button className="navbar-toggler" type="button" onClick={() => setIsNavOpen(!isNavOpen)}>
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="mainNavbar">
              <ul className="navbar-nav mx-auto text-uppercase fw-bold" style={{ gap: '1.8rem' }}>
                <li className="nav-item">
                  <Link className="nav-link text-danger py-3" to="/hang-moi">
                    HÀNG MỚI<span className="badge bg-danger ms-1" style={{ fontSize: '10px' }}>NEW</span>
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <Link className="nav-link text-dark py-3" to="/tat-ca">
                    SẢN PHẨM <i className="bi bi-caret-down-fill ms-1"></i>
                  </Link>
                  <ul className="dropdown-menu border-0 shadow-lg">
                    <li><Link className="dropdown-item py-3" to="/tat-ca">TẤT CẢ SẢN PHẨM</Link></li>
                    <li>
                      <Link className="dropdown-item py-3" to="/hang-ban-chay">
                        <i className="bi bi-fire text-danger me-2"></i>HÀNG BÁN CHẠY
                      </Link>
                    </li>

                    {!loading && parentCats.map((dm) => {
                      const children = categories.filter(c => c.parentId === dm.id);

                      if (children.length > 0) {
                        return (
                          <li className="dropdown-submenu" key={dm.id}>
                            <Link className="dropdown-item d-flex justify-content-between align-items-center py-3" to={`/danh-muc/${dm.slug}`}>
                              {dm.name}
                              <i className="bi bi-chevron-right small"></i>
                            </Link>
                            <ul className="dropdown-menu border-0 shadow-lg">
                              {children.map(child => (
                                <li key={child.id}>
                                  <Link className="dropdown-item py-3" to={`/danh-muc/${child.slug}`}>
                                    {child.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        );
                      }

                      return (
                        <li key={dm.id}>
                          <Link className="dropdown-item py-3" to={`/danh-muc/${dm.slug}`}>{dm.name}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <Link className="nav-link text-dark py-3" to={`/danh-muc/${categories.find(c => c.parentId === null && c.name.toLowerCase().includes("áo"))?.slug || ''}`}>
                    ÁO NAM <i className="bi bi-caret-down-fill ms-1"></i>
                  </Link>
                  <ul className="dropdown-menu border-0 shadow-lg">
                    {!loading && categories
                      .filter(c => categories.find(p => p.id === c.parentId)?.name.toLowerCase().includes("áo"))
                      .map(sub => (
                        <li key={sub.id}>
                          <Link className="dropdown-item py-3" to={`/danh-muc/${sub.slug}`}>{sub.name}</Link>
                        </li>
                      ))
                    }
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <Link className="nav-link text-dark py-3" to={`/danh-muc/${categories.find(c => c.parentId === null && c.name.toLowerCase().includes("quần"))?.slug || ''}`}>
                    QUẦN NAM <i className="bi bi-caret-down-fill ms-1"></i>
                  </Link>
                  <ul className="dropdown-menu border-0 shadow-lg">
                    {!loading && categories
                      .filter(c => categories.find(p => p.id === c.parentId)?.name.toLowerCase().includes("quần"))
                      .map(sub => (
                        <li key={sub.id}>
                          <Link className="dropdown-item py-3" to={`/danh-muc/${sub.slug}`}>{sub.name}</Link>
                        </li>
                      ))
                    }
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <Link className="nav-link text-dark py-3" to={`/danh-muc/${categories.find(c => c.parentId === null && c.name.toLowerCase().includes("phụ kiện"))?.slug || ''}`}>
                    PHỤ KIỆN <i className="bi bi-caret-down-fill ms-1"></i>
                  </Link>
                  <ul className="dropdown-menu border-0 shadow-lg">
                    {!loading && categories
                      .filter(c => categories.find(p => p.id === c.parentId)?.name.toLowerCase().includes("phụ kiện"))
                      .map(sub => (
                        <li key={sub.id}>
                          <Link className="dropdown-item py-3" to={`/danh-muc/${sub.slug}`}>{sub.name}</Link>
                        </li>
                      ))
                    }
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <main className="container mt-4 min-vh-100">
        {children}
      </main>

      <footer className="mt-5 bg-black text-white pt-5 pb-4">
        <div className="container">
          <div className="row gy-4 text-start">
            <div className="col-md-3">
              <h5 className="fw-bold mb-3 hover-scale hover-lift d-inline-block">GIỚI THIỆU</h5>
              <div className="mb-2">
                <Link to="/" onClick={() => window.scrollTo(0, 0)} >
                  <img
                    src="/images/logoShopQuanAo.jpg"
                    alt="Logo Shop"
                    style={{ height: '50px', cursor: 'pointer' }}
                  />
                </Link>
              </div>
              <p className="mb-1 hover-scale hover-lift d-block small">Shop Phân Phối Thời Trang Nam Chuẩn Hàng Hiệu</p>
              <p className="mb-1 hover-scale hover-lift d-block small"><i className="bi bi-phone-vibrate me-2"></i>0908 998 999</p>
              <p className="mb-1 hover-scale hover-lift d-block small"><i className="bi bi-envelope-at me-2"></i>fashion4men.com</p>
              <p className="mb-3 hover-scale hover-lift d-block small"><i className="bi bi-clock me-2"></i>08:00 - 22:00</p>
              <div className="d-flex gap-3 mb-3">
                <a href="#" className="social-icon facebook fs-5"><i className="bi bi-facebook"></i></a>
                <a href="#" className="social-icon instagram fs-5"><i className="bi bi-instagram"></i></a>
                <a href="#" className="social-icon tiktok fs-5"><i className="bi bi-tiktok"></i></a>
                <a href="#" className="social-icon youtube fs-5"><i className="bi bi-youtube"></i></a>
              </div>
            </div>

            <div className="col-md-3">
              <h5 className="fw-bold mb-3 hover-scale hover-lift d-inline-block">CHÍNH SÁCH</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" className="text-white text-decoration-none d-block small hover-scale">
                    Hướng dẫn đặt hàng
                  </a>
                </li>
                <li className="mb-2">
                  <div
                    className="text-white d-flex align-items-center hover-scale"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setIsPolicyOpen(!isPolicyOpen)}
                  >
                    <span className='small'>Chính sách</span>
                    <i className={`bi bi-chevron-down ms-2 small transition-all ${isPolicyOpen ? 'rotate-180' : ''}`}></i>
                  </div>

                  {isPolicyOpen && (
                    <ul className="list-unstyled mt-2 fade-in">
                      <li className="mb-1 d-flex align-items-center">
                        <i className="bi bi-dot fs-4"></i>
                        <a href="#" className="text-white text-decoration-none small hover-scale">Ưu đãi sinh nhật</a>
                      </li>
                      <li className="mb-1 d-flex align-items-center">
                        <i className="bi bi-dot fs-4"></i>
                        <a href="#" className="text-white text-decoration-none small hover-scale">Khách hàng thân thiết</a>
                      </li>
                      <li className="mb-1 d-flex align-items-center">
                        <i className="bi bi-dot fs-4"></i>
                        <a href="#" className="text-white text-decoration-none small hover-scale">Chính sách giao hàng</a>
                      </li>
                      <li className="mb-1 d-flex align-items-center">
                        <i className="bi bi-dot fs-4"></i>
                        <a href="#" className="text-white text-decoration-none small hover-scale">Chính sách bảo mật</a>
                      </li>
                      <li className="mb-1 d-flex align-items-center">
                        <i className="bi bi-dot fs-4"></i>
                        <a href="#" className="text-white text-decoration-none small hover-scale">Đổi trả & Bảo hành</a>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>

            <div className="col-md-3">
              <h5 className="fw-bold mb-3 hover-scale hover-lift d-inline-block">ĐỊA CHỈ SHOP</h5>
              <p className="fw-bold mb-1 hover-scale"><i className="bi bi-geo-alt me-2"></i>TP. HỒ CHÍ MINH</p>
              <p className="hover-scale small">140 Lê Trọng Tấn, Phường Tây Thạnh, TP.HCM</p>
            </div>

            <div className="col-md-3">
              <h5 className="fw-bold mb-3 hover-scale hover-lift d-inline-block">THANH TOÁN</h5>
              <ul className="list-unstyled mt-2">
                <li className="mb-3 d-flex align-items-center hover-scale">
                  <i className="bi bi-cash-coin me-3 fs-5"></i>
                  <span className='small'>Thanh toán khi nhận hàng (COD)</span>
                </li>
                <li className="mb-3 d-flex align-items-center hover-scale">
                  <i className="bi bi-credit-card-2-front me-3 fs-5"></i>
                  <span className='small'>Chuyển khoản ngân hàng</span>
                </li>
                <li className="d-flex align-items-center hover-scale">
                  <i className="bi bi-bank me-3 fs-5"></i>
                  <span className='small'>ATM / Internet Banking</span>
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-secondary mt-4" />

          <div className="row">
            <div className="col-12 text-center">
              <p className="mb-0 small text-secondary hover-scale d-inline-block">
                © 2026 Fashion 4Men. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
      <CustomerChatWidget />
    </div>
  );
};

export default MainLayout;
