import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartData, updateCartQty, removeFromCartApi, submitOrder } from '../services/cartService';

const useCheckout = () => {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        tenKH: '',
        phone: '',
        diaChi: '',
        phuongThucVC: 'FREESHIP',
        hinhThucThanhToan: 'COD'
    });

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        setLoading(true);

        getCartData()
            .then(res => {
                setCartItems(res || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi khi tải giỏ hàng:", err);
                setLoading(false);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');

        if (value.length <= 11) {
            setFormData(prev => ({
                ...prev,
                phone: value
            }));

            setErrors(prev => ({
                ...prev,
                phone: ''
            }));
        }
    };

    const handleQtyChange = (maSP, mau, size, change) => {
        const item = cartItems.find(
            x => x.maSP === maSP && x.mauSac === mau && x.size === size
        );

        if (!item) return;

        let newQty = Number(item.soLuong) + change;
        if (newQty < 1) newQty = 1;

        updateCartQty(item.id, newQty)
            .then(() => {
                setCartItems(prev =>
                    prev.map(x =>
                        x.id === item.id
                            ? {
                                ...x,
                                soLuong: newQty,
                                thanhTien: Number(x.donGia) * newQty
                            }
                            : x
                    )
                );
            })
            .catch(err => console.error("Lỗi cập nhật số lượng:", err));
    };

    const handleQtyDirectChange = (maSP, mau, size, value) => {
        const item = cartItems.find(
            x => x.maSP === maSP && x.mauSac === mau && x.size === size
        );

        if (!item) return;

        let val = parseInt(value.replace(/\D/g, ""));
        if (isNaN(val) || val < 1) val = 1;

        updateCartQty(item.id, val)
            .then(() => {
                setCartItems(prev =>
                    prev.map(x =>
                        x.id === item.id
                            ? {
                                ...x,
                                soLuong: val,
                                thanhTien: Number(x.donGia) * val
                            }
                            : x
                    )
                );
            })
            .catch(err => console.error("Lỗi cập nhật trực tiếp số lượng:", err));
    };

    const handleRemoveItem = (maSP, mau, size) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) return;

        const item = cartItems.find(
            x => x.maSP === maSP && x.mauSac === mau && x.size === size
        );

        if (!item) return;

        removeFromCartApi(item.id)
            .then(() => {
                setCartItems(prev => prev.filter(x => x.id !== item.id));
            })
            .catch(err => console.error("Lỗi khi xóa sản phẩm:", err));
    };

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + (Number(item.thanhTien) || (Number(item.donGia) * Number(item.soLuong))),
        0
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        const tenKH = formData.tenKH.trim();
        const phone = formData.phone.trim();
        const diaChi = formData.diaChi.trim();

        const phoneRegex = /^(0[0-9]{9,10})$/;

        const newErrors = {};

        if (cartItems.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }

        if (!tenKH) {
            newErrors.tenKH = "Vui lòng nhập họ tên";
        } else if (tenKH.length < 2) {
            newErrors.tenKH = "Họ tên phải có ít nhất 2 ký tự";
        }

        if (!phone) {
            newErrors.phone = "Vui lòng nhập số điện thoại";
        } else if (!phoneRegex.test(phone)) {
            newErrors.phone = "Số điện thoại phải bắt đầu bằng 0 và có 10-11 số";
        }

        if (!diaChi) {
            newErrors.diaChi = "Vui lòng nhập địa chỉ giao hàng";
        } else if (diaChi.length < 10) {
            newErrors.diaChi = "Địa chỉ giao hàng phải có ít nhất 10 ký tự";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        const orderData = {
            ...formData,
            tenKH,
            phone,
            diaChi,
            tongTien: totalPrice,
            items: cartItems
        };

        submitOrder(orderData)
            .then(res => {
                if (res.success) {
                    navigate('/checkout/success');
                } else {
                    alert(res.message || "Đặt hàng thất bại!");
                }
            })
            .catch(err => {
                console.error("Lỗi khi gửi đơn hàng:", err);
                alert("Đã xảy ra lỗi trong quá trình xử lý đặt hàng.");
            });
    };

    return {
        cartItems,
        loading,
        formData,
        errors,
        totalPrice,
        handleInputChange,
        handlePhoneChange,
        handleQtyChange,
        handleQtyDirectChange,
        handleRemoveItem,
        handleSubmit
    };
};

export default useCheckout;