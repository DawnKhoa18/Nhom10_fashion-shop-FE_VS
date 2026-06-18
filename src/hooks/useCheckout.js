import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartData, updateCartQty, removeFromCartApi, submitOrder } from '../services/cartService';

const useCheckout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form trạng thái người dùng nhập
    const [formData, setFormData] = useState({
        tenKH: '',
        phone: '',
        diaChi: '',
        phuongThucVC: 'FREESHIP',
        hinhThucThanhToan: 'COD'
    });

    // Lấy dữ liệu giỏ hàng ban đầu khi vào trang
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

    // Thay đổi input text/radio
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Kiểm tra xử lý số điện thoại chỉ nhận số
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 11) {
            setFormData(prev => ({ ...prev, phone: value }));
        }
    };

    // Thay đổi số lượng (nút cộng / trừ)
    const handleQtyChange = (maSP, mau, size, change) => {
        const item = cartItems.find(x => x.maSP === maSP && x.mauSac === mau && x.size === size);
        if (!item) return;

        let newQty = item.soLuong + change;
        if (newQty < 1) newQty = 1;

        updateCartQty(maSP, mau, size, newQty)
            .then(res => {
                if (res.success) {
                    setCartItems(prev => prev.map(x => 
                        (x.maSP === maSP && x.mauSac === mau && x.size === size) 
                        ? { ...x, soLuong: newQty, thanhTien: res.thanhTien } 
                        : x
                    ));
                }
            })
            .catch(err => console.error("Lỗi cập nhật số lượng:", err));
    };

    // Thay đổi số lượng trực tiếp qua ô input nhập số
    const handleQtyDirectChange = (maSP, mau, size, value) => {
        let val = parseInt(value.replace(/\D/g, ""));
        if (isNaN(val) || val < 1) val = 1;

        updateCartQty(maSP, mau, size, val)
            .then(res => {
                if (res.success) {
                    setCartItems(prev => prev.map(x => 
                        (x.maSP === maSP && x.mauSac === mau && x.size === size) 
                        ? { ...x, soLuong: val, thanhTien: res.thanhTien } 
                        : x
                    ));
                }
            })
            .catch(err => console.error("Lỗi cập nhật trực tiếp số lượng:", err));
    };

    // Xóa sản phẩm khỏi giỏ hàng
    const handleRemoveItem = (maSP, mau, size) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) return;

        removeFromCartApi(maSP, mau, size)
            .then(res => {
                if (res.success) {
                    setCartItems(prev => prev.filter(x => !(x.maSP === maSP && x.mauSac === mau && x.size === size)));
                }
            })
            .catch(err => console.error("Lỗi khi xóa sản phẩm:", err));
    };

    // Tính tổng tiền giỏ hàng
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.thanhTien || (item.donGia * item.soLuong)), 0);

    // Xử lý gửi đơn hàng (Submit Form)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }

        const orderData = {
            ...formData,
            tongTien: totalPrice,
            items: cartItems
        };

        submitOrder(orderData)
            .then(res => {
                if (res.success) {
                    // Chuyển hướng sang trang hoàn tất đơn hàng
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