import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { confirmMomoPayment } from '../services/cartService';
import { useCart } from '../context/CartContext';

const MomoReturnPage = () => {
    const [searchParams] = useSearchParams();
    const orderNumber = searchParams.get('orderId');
    const { resetCartCount } = useCart();
    const [state, setState] = useState({ loading: true, success: false, message: '' });

    const verifyPayment = useCallback(async () => {
        if (!orderNumber) {
            setState({ loading: false, success: false, message: 'Không tìm thấy mã đơn hàng MoMo.' });
            return;
        }

        setState(prev => ({ ...prev, loading: true }));
        try {
            const result = await confirmMomoPayment(orderNumber);
            if (result.success && result.paid) {
                resetCartCount();
                setState({ loading: false, success: true, message: 'Thanh toán MoMo thành công.' });
            } else {
                setState({
                    loading: false,
                    success: false,
                    message: result.message || 'Giao dịch chưa được thanh toán.'
                });
            }
        } catch (error) {
            setState({
                loading: false,
                success: false,
                message: error.response?.data?.message || 'Không kiểm tra được trạng thái giao dịch MoMo.'
            });
        }
    }, [orderNumber, resetCartCount]);

    useEffect(() => {
        verifyPayment();
    }, [verifyPayment]);

    return (
        <div className="container py-5">
            <div className="card border-0 shadow-sm mx-auto text-center" style={{ maxWidth: 600 }}>
                <div className="card-body p-5">
                    {state.loading ? (
                        <>
                            <div className="spinner-border text-danger mb-3" role="status" />
                            <h3 className="fw-bold">Đang xác nhận với MoMo</h3>
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
                            <div className="d-flex justify-content-center gap-2 flex-wrap">
                                <button className="btn btn-danger" type="button" onClick={verifyPayment}>Kiểm tra lại</button>
                                <Link className="btn btn-outline-dark" to="/checkout">Quay lại thanh toán</Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MomoReturnPage;
