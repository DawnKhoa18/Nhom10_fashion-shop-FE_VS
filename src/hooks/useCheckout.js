import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartData, updateCartQty, removeFromCartApi, submitOrder } from '../services/cartService';
import { useCart } from '../context/CartContext';

const useCheckout = () => {
    const navigate = useNavigate();
    const { resetCartCount, refreshCartCount } = useCart();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [itemPendingRemoval, setItemPendingRemoval] = useState(null);
    const [removing, setRemoving] = useState(false);

    const [formData, setFormData] = useState({
        tenKH: '',
        phone: '',
        diaChi: '',
        phuongThucVC: 'FREESHIP',
        hinhThucThanhToan: 'COD'
    });

    const validateField = (name, rawValue) => {
        const value = rawValue.trim();

        if (name === 'tenKH') {
            if (!value) return "Vui lòng nhập họ tên";
            if (value.length < 2) return "Họ tên phải có ít nhất 2 ký tự";
            if (!/^[\p{L}]+(?:[\s'.-][\p{L}]+)*$/u.test(value)) {
                return "Họ tên chỉ được chứa chữ cái";
            }
        }

        if (name === 'phone') {
            if (!value) return "Vui lòng nhập số điện thoại";
            if (!/^0[0-9]{9,10}$/.test(value)) {
                return "Số điện thoại phải bắt đầu bằng 0 và có 10-11 số";
            }
        }

        if (name === 'diaChi') {
            if (!value) return "Vui lòng nhập địa chỉ giao hàng";
            if (value.length < 10 || !/[\p{L}]/u.test(value)) {
                return "Địa chỉ phải có chữ và ít nhất 10 ký tự";
            }
        }

        return '';
    };

    useEffect(() => {
        if (!localStorage.getItem('customerId')) {
            navigate('/login', {
                replace: true,
                state: {
                    message: 'Vui lòng đăng nhập hoặc đăng ký để xem giỏ hàng và thanh toán.',
                    returnTo: '/gio-hang'
                }
            });
            return;
        }
        loadCart();
    }, [navigate]);

    const loadCart = () => {
        setLoading(true);

        getCartData()
            .then(res => {
                console.log("Dữ liệu giỏ hàng lấy được:", res);
                setCartItems(res || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi khi tải giỏ hàng:", err);
                setCartItems([]);
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
            [name]: prev[name] ? validateField(name, value) : ''
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
                phone: prev.phone ? validateField('phone', value) : ''
            }));
        }
    };

    const findCartItem = (maSP, mau, size) => {
        return cartItems.find(
            x => x.maSP === maSP && x.mauSac === mau && x.size === size
        );
    };

    const handleQtyChange = (maSP, mau, size, change) => {
        const item = findCartItem(maSP, mau, size);
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
                refreshCartCount();
            })
            .catch(err => console.error("Lỗi cập nhật số lượng:", err));
    };

    const handleQtyDirectChange = (maSP, mau, size, value) => {
        const item = findCartItem(maSP, mau, size);
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
                refreshCartCount();
            })
            .catch(err => console.error("Lỗi cập nhật trực tiếp số lượng:", err));
    };

    const handleRemoveItem = (maSP, mau, size) => {
        const item = findCartItem(maSP, mau, size);
        if (!item) return;

        setItemPendingRemoval(item);
    };

    const cancelRemoveItem = () => {
        if (!removing) setItemPendingRemoval(null);
    };

    const confirmRemoveItem = async () => {
        if (!itemPendingRemoval || removing) return;

        setRemoving(true);
        try {
            await removeFromCartApi(itemPendingRemoval.id);
            setCartItems(prev => prev.filter(x => x.id !== itemPendingRemoval.id));
            setItemPendingRemoval(null);
            await refreshCartCount();
        } catch (err) {
            console.error("Lỗi khi xóa sản phẩm:", err);
        } finally {
            setRemoving(false);
        }
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

        const newErrors = {
            tenKH: validateField('tenKH', tenKH),
            phone: validateField('phone', phone),
            diaChi: validateField('diaChi', diaChi)
        };

        if (cartItems.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }

        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        const orderData = {
            ...formData,
            customerId: localStorage.getItem("customerId"),
            tenKH,
            phone,
            diaChi,
            tongTien: totalPrice,
            items: cartItems
        };

        submitOrder(orderData)
            .then(res => {
                if (res.success) {
                    if (res.paymentMethod === 'MOMO' && res.payUrl) {
                        window.location.assign(res.payUrl);
                        return;
                    }
                    if (res.paymentMethod === 'VNPAY' && res.payUrl) {
                        window.location.assign(res.payUrl);
                        return;
                    }
                    resetCartCount();
                    navigate('/checkout/success', {
                        replace: true,
                        state: { orderNumber: res.orderNumber, emailSent: res.emailSent }
                    });
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
        itemPendingRemoval,
        removing,
        cancelRemoveItem,
        confirmRemoveItem,
        handleSubmit
    };
};

export default useCheckout;
