import React, { useEffect } from 'react';

const STORE_ADDRESS = '140 Lê Trọng Tấn, quận Tân Phú, Thành phố Hồ Chí Minh';
const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(STORE_ADDRESS)}&output=embed`;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(STORE_ADDRESS)}`;

const StorePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="store-page">
      <section className="store-hero">
        <div>
          <span className="store-eyebrow">FASHION 4MEN</span>
          <h1>Ghé thăm cửa hàng của chúng tôi</h1>
          <p>
            Trải nghiệm trực tiếp các mẫu thời trang nam, được tư vấn lựa chọn
            kích thước và phong cách phù hợp.
          </p>
          <a href={DIRECTIONS_URL} target="_blank" rel="noreferrer" className="btn store-direction-btn">
            <i className="bi bi-sign-turn-right-fill me-2" />
            Chỉ đường đến cửa hàng
          </a>
        </div>
        <div className="store-hero-icon">
          <i className="bi bi-shop-window" />
        </div>
      </section>

      <section className="store-content">
        <div className="store-info-card">
          <div className="store-section-heading">
            <span>THÔNG TIN CỬA HÀNG</span>
            <h2>Fashion 4Men</h2>
          </div>

          <div className="store-info-item">
            <span className="store-info-icon"><i className="bi bi-geo-alt-fill" /></span>
            <div>
              <strong>Địa chỉ</strong>
              <p>{STORE_ADDRESS}</p>
            </div>
          </div>

          <div className="store-info-item">
            <span className="store-info-icon"><i className="bi bi-clock-fill" /></span>
            <div>
              <strong>Giờ mở cửa</strong>
              <p>08:00 – 22:00, tất cả các ngày trong tuần</p>
            </div>
          </div>

          <div className="store-info-item">
            <span className="store-info-icon"><i className="bi bi-telephone-fill" /></span>
            <div>
              <strong>Hotline</strong>
              <p><a href="tel:0908998999">0908 998 999</a></p>
            </div>
          </div>

          <div className="store-info-item">
            <span className="store-info-icon"><i className="bi bi-bag-check-fill" /></span>
            <div>
              <strong>Dịch vụ tại cửa hàng</strong>
              <p>Tư vấn sản phẩm, thử đồ, đổi trả và nhận đơn đặt trực tuyến.</p>
            </div>
          </div>
        </div>

        <div className="store-map-card">
          <div className="store-map-heading">
            <div>
              <span>VỊ TRÍ TRÊN BẢN ĐỒ</span>
              <h2>Đường đến Fashion 4Men</h2>
            </div>
            <a href={DIRECTIONS_URL} target="_blank" rel="noreferrer">
              Mở Google Maps <i className="bi bi-box-arrow-up-right ms-1" />
            </a>
          </div>
          <iframe
            title="Bản đồ cửa hàng Fashion 4Men"
            src={MAP_EMBED_URL}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
    </div>
  );
};

export default StorePage;
