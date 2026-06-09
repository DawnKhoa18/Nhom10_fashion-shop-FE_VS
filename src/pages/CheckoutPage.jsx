import React from 'react';
import useCheckout from '../hooks/useCheckout';

const CheckoutPage = () => {
    const {
        cartItems,
        loading,
        formData,
        totalPrice,
        handleInputChange,
        handlePhoneChange,
        handleQtyChange,
        handleQtyDirectChange,
        handleRemoveItem,
        handleSubmit
    } = useCheckout();

    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <div className="row">
                {/* Cột trái: Form thông tin giao hàng */}
                <div className="col-lg-6">
                    <h3 className="mb-3 fw-bold">Thông tin đơn hàng</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="fw-bold mb-1">Họ tên</label>
                            <input
                                type="text"
                                name="tenKH"
                                className="form-control"
                                value={formData.tenKH}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="fw-bold mb-1">Số điện thoại</label>
                            <input
                                type="text"
                                name="phone"
                                className="form-control"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                required
                                placeholder="Nhập số điện thoại 10-11 số"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="fw-bold mb-1">Địa chỉ giao hàng</label>
                            <input
                                type="text"
                                name="diaChi"
                                className="form-control"
                                value={formData.diaChi}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <h3 className="mt-4 mb-3 fw-bold">Phương thức vận chuyển</h3>
                        <div className="border rounded p-3 mb-3" style={{ cursor: 'pointer' }}>
                            <label className="d-flex align-items-center m-0 w-100" style={{ cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="phuongThucVC"
                                    value="FREESHIP"
                                    checked={formData.phuongThucVC === 'FREESHIP'}
                                    onChange={handleInputChange}
                                    className="me-3"
                                />
                                <div>
                                    <strong className="d-block">Freeship đơn hàng</strong>
                                </div>
                            </label>
                        </div>

                        <h3 className="mt-4 mb-3 fw-bold">Hình thức thanh toán</h3>

                        <div className="border rounded p-3 mb-2" style={{ cursor: 'pointer' }}>
                            <label className="d-flex align-items-start m-0 w-100" style={{ cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="hinhThucThanhToan"
                                    value="COD"
                                    checked={formData.hinhThucThanhToan === 'COD'}
                                    onChange={handleInputChange}
                                    className="me-3 mt-1"
                                />
                                <div>
                                    <strong className="d-block">Thanh toán khi giao hàng (COD)</strong>
                                    <span className="small text-muted">Khách hàng được kiểm tra hàng trước khi nhận.</span>
                                </div>
                            </label>
                        </div>

                        <div className="border rounded p-3 mb-2" style={{ cursor: 'pointer' }}>
                            <label className="d-flex align-items-center m-0 w-100" style={{ cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="hinhThucThanhToan"
                                    value="VNPAY"
                                    checked={formData.hinhThucThanhToan === 'VNPAY'}
                                    onChange={handleInputChange}
                                    className="me-3"
                                />
                                <div>
                                    <strong className="d-block">Ví điện tử VNPAY</strong>
                                </div>
                            </label>
                        </div>

                        <div className="border rounded p-3 mb-3" style={{ cursor: 'pointer' }}>
                            <label className="d-flex align-items-center m-0 w-100" style={{ cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="hinhThucThanhToan"
                                    value="MOMO"
                                    checked={formData.hinhThucThanhToan === 'MOMO'}
                                    onChange={handleInputChange}
                                    className="me-3"
                                />
                                <div>
                                    <strong className="d-block">Thanh toán MoMo</strong>
                                </div>
                            </label>
                        </div>

                        <button className="btn btn-dark w-100 mt-3 py-2 fw-bold" type="submit">
                            THANH TOÁN
                        </button>
                    </form>
                </div>

                {/* Cột phải: Danh sách sản phẩm trong giỏ hàng */}
                <div className="col-lg-6 mt-5 mt-lg-0">
                    <h3 className="mb-3 fw-bold">
                        <i className="bi bi-cart3 me-2"></i> Giỏ hàng
                    </h3>

                    {cartItems.length === 0 ? (
                        <h4 className="text-muted mt-4">Giỏ hàng trống</h4>
                    ) : (
                        <>
                            {cartItems.map((item, index) => {
                                // Tính toán giá an toàn
                                const gia = Number(item.donGia) || 0;
                                const soLuong = Number(item.soLuong) || 0;
                                const thanhTien = Number(item.thanhTien) || (gia * soLuong);

                                return (
                                    <div key={`${item.maSP}-${item.mauSac}-${item.size}-${index}`} className="d-flex mb-3 border-bottom pb-3 align-items-start">
                                        <img
                                            src={item.hinhAnh ? item.hinhAnh : "/Images/Products/no-image.png"}
                                            style={{ width: '120px', height: '120px', objectFit: 'cover', cursor: 'pointer' }}
                                            className="rounded me-3"
                                            alt={item.tenSP}
                                        />

                                        <div className="flex-grow-1 d-flex flex-column justify-content-between" style={{ minWidth: 0 }}>
                                            <div>
                                                <p className="m-0 fw-bold fs-5 text-truncate" style={{ maxWidth: '100%', cursor: 'pointer' }} title={item.tenSP}>
                                                    {item.tenSP}
                                                </p>
                                                <small className="text-muted d-block mt-1">
                                                    Màu: {item.mauSac} | Size: {item.size}
                                                </small>
                                            </div>

                                            <div className="d-flex align-items-center mt-2">
                                                <button type="button" className="btn btn-outline-dark btn-sm px-2 py-0" onClick={() => handleQtyChange(item.maSP, item.mauSac, item.size, -1)}>-</button>
                                                <input
                                                    type="text"
                                                    className="form-control text-center mx-2 p-0"
                                                    style={{ width: '50px', height: '28px' }}
                                                    value={item.soLuong}
                                                    onChange={(e) => handleQtyDirectChange(item.maSP, item.mauSac, item.size, e.target.value)}
                                                />
                                                <button type="button" className="btn btn-outline-dark btn-sm px-2 py-0" onClick={() => handleQtyChange(item.maSP, item.mauSac, item.size, 1)}>+</button>
                                            </div>

                                            <div className="mt-2 d-flex justify-content-between align-items-center">
                                                <span className="fw-bold fs-5 text-danger">
                                                    {new Intl.NumberFormat('vi-VN').format(thanhTien)}₫
                                                </span>
                                                <button type="button" className="btn btn-outline-danger btn-sm rounded-2 px-2 py-1" onClick={() => handleRemoveItem(item.maSP, item.mauSac, item.size)}>
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <h2 className="text-end mt-4 fw-bold fs-3">
                                Tổng cộng:{' '}
                                <span className="text-danger">
                                    {new Intl.NumberFormat('vi-VN').format(totalPrice)}₫
                                </span>
                            </h2>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;