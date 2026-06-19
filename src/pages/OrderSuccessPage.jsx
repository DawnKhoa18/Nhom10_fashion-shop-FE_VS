import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderNumber = location.state?.orderNumber;
    const emailSent = location.state?.emailSent;

    return (
        <div className="container my-5 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="card border-0 shadow-lg p-5 text-center rounded-4" style={{ maxWidth: '560px', background: '#ffffff' }}>
                <div className="mb-4 d-inline-block position-relative">
                    <div
                        className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto"
                        style={{ width: '100px', height: '100px', animation: 'pulse 2s infinite' }}
                    >
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3.5rem' }}></i>
                    </div>
                </div>

                <h2 className="text-success fw-bold mb-3" style={{ letterSpacing: '0.5px' }}>
                    ĐẶT HÀNG THÀNH CÔNG!
                </h2>

                <p className="fs-5 text-dark mb-2 fw-medium">
                    Cảm ơn bạn đã mua sắm tại Fashion 4Men.
                </p>

                {orderNumber && (
                    <div className="alert alert-success border-0 mb-3" role="alert">
                        Mã đơn hàng của bạn: <strong>{orderNumber}</strong>
                    </div>
                )}

                {emailSent === true && (
                    <div className="alert alert-info border-0 mb-3" role="alert">
                        <i className="bi bi-envelope-check me-2"></i>
                        Email xác nhận đơn hàng đã được gửi về tài khoản Gmail đã đăng ký.
                    </div>
                )}

                {emailSent === false && (
                    <div className="alert alert-warning border-0 mb-3" role="alert">
                        <i className="bi bi-envelope-exclamation me-2"></i>
                        Đơn hàng đã tạo thành công, nhưng email xác nhận chưa gửi được. Shop vẫn sẽ xử lý đơn của bạn.
                    </div>
                )}

                <p className="text-muted mb-4 px-3" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                    Yêu cầu đặt hàng của bạn đã được ghi nhận và đang trong quá trình xử lý.
                    Hệ thống sẽ sớm liên hệ để xác nhận đơn hàng.
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="btn btn-dark w-100 py-2 fw-bold rounded-3 shadow-sm text-uppercase btn-view"
                    style={{ letterSpacing: '1px', fontSize: '15px' }}
                >
                    <i className="bi bi-house-door me-2"></i> Về trang chủ
                </button>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.4); }
                    70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(40, 167, 69, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
                }
            `}</style>
        </div>
    );
};

export default OrderSuccessPage;
