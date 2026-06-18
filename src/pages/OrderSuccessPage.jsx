import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div className="container my-5 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="card border-0 shadow-lg p-5 text-center rounded-4" style={{ maxWidth: '550px', background: '#ffffff' }}>
                
                {/* Khu vực Icon Động/Sinh Động */}
                <div className="mb-4 d-inline-block position-relative">
                    <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto" 
                         style={{ width: '100px', height: '100px', animation: 'pulse 2s infinite' }}>
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3.5rem' }}></i>
                    </div>
                </div>

                {/* Tiêu đề & Nội dung thông báo */}
                <h2 className="text-success fw-bold mb-3" style={{ letterSpacing: '0.5px' }}>
                    ĐẶT HÀNG THÀNH CÔNG!
                </h2>
                
                <p className="fs-5 text-dark mb-2 fw-medium">
                    Cảm ơn bạn đã mua sắm tại WebShop.
                </p>
                
                <p className="text-muted mb-4 px-3" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                    Yêu cầu đặt hàng của bạn đã được ghi nhận thành công và đang trong quá trình xử lý. Hệ thống sẽ sớm liên hệ để xác nhận đơn hàng với bạn.
                </p>

                {/* Nút hành động quay lại trang chủ */}
                <button 
                    onClick={() => navigate('/')} 
                    className="btn btn-dark w-100 py-2.5 fw-bold rounded-3 shadow-sm text-uppercase"
                    style={{ 
                        letterSpacing: '1px', 
                        transition: 'all 0.3s ease',
                        fontSize: '15px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#212529';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#1a1d20';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <i className="bi bi-house-door me-2"></i> Về trang chủ
                </button>
            </div>

            {/* Đoạn CSS Animation nhỏ giúp icon nhấp nháy sinh động */}
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