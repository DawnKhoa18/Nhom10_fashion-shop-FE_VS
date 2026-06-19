import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { confirmVnpayPayment } from '../services/cartService';
import { useCart } from '../context/CartContext';

const VnpayReturnPage = () => {
    const [searchParams] = useSearchParams();
    const { resetCartCount } = useCart();
    const verified = useRef(false);
    const [state, setState] = useState({ loading: true, success: false, message: '' });
    const orderNumber = searchParams.get('vnp_TxnRef');

    useEffect(() => {
        if (verified.current) return;
        verified.current = true;

        const verify = async () => {
            try {
                const params = Object.fromEntries(searchParams.entries());
                const result = await confirmVnpayPayment(params);
                if (result.success && result.paid) {
                    resetCartCount();
                    setState({ loading: false, success: true, message: result.message });
                } else {
                    setState({ loading: false, success: false, message: result.message || 'Thanh toán chưa thành công.' });
                }
            } catch (error) {
                setState({
                    loading: false,
                    success: false,
                    message: error.response?.data?.message || 'Không xác nhận được giao dịch VNPay.'
                });
            }
        };

        verify();
    }, [searchParams, resetCartCount]);

    return (
        <div className="container py-5">
            <div className="card border-0 shadow-sm mx-auto text-center" style={{ maxWidth: 600 }}>
                <div className="card-body p-5">
                    {state.loading ? (
                        <>
                            <div className="spinner-border text-primary mb-3" role="status" />
                            <h3 className="fw-bold">Đang xác nhận với VNPay</h3>
                            <p className="text-muted mb-0">Vui lòng không đóng trang này.</p>
                        </>
                    ) : state.success ? (
                        <>
                            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: 64 }} />
                            <h3 className="fw-bold mt-3">Thanh toán thành công</h3>
                            <p className="text-muted">Mã đơn hàng: <strong>{orderNumber}</strong></p>
                            <Link className="btn btn-dark" to="/don-hang-cua-toi">Xem đơn hàng</Link>
                        </>
                    ) : (
                        <>
                            <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: 64 }} />
                            <h3 className="fw-bold mt-3">Thanh toán chưa thành công</h3>
                            <p className="text-muted">{state.message}</p>
                            <Link className="btn btn-outline-dark" to="/checkout">Quay lại thanh toán</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VnpayReturnPage;
