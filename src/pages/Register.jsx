import React, { useState } from "react";
import "./Auth.css";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: ""
    });

    const [errors, setErrors] = useState({}); // ← thêm state errors

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validate = () => {
        const { fullName, email, phone, password } = formData;
        const newErrors = {};

        if (!fullName.trim())
            newErrors.fullName = "Họ tên không được để trống";

        if (!email)
            newErrors.email = "Email không được để trống";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            newErrors.email = "Email không đúng định dạng";

        if (!phone)
            newErrors.phone = "Số điện thoại không được để trống";
        else if (!/^[0-9]{10}$/.test(phone))
            newErrors.phone = "Số điện thoại phải đúng 10 chữ số";

        if (!password)
            newErrors.password = "Mật khẩu không được để trống";
        else if (password.length < 6)
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Gọi validate trước khi gọi API
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        try {
            const response = await register(formData);
            alert(response.data);
            navigate("/login");
        } catch (error) {
            setErrors({ general: error.response?.data || "Đăng ký thất bại" });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <div className="auth-left">
                    <img
                        src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/lmht-t1-lo-loat-anh-dam-chat-tong-tai-truoc-them-cktg-rieng-faker-lai-chiem-spotlight-1.jpg"
                        alt="fashion"
                    />
                </div>

                <div className="auth-right">
                    <h2>Tạo tài khoản</h2>
                    <p>Gia nhập Fashion 4Men ngay hôm nay ✨</p>

                    <form onSubmit={handleSubmit}>

                        {/* ✅ Lỗi từ server */}
                        {errors.general && (
                            <div className="alert-error">{errors.general}</div>
                        )}

                        <input
                            name="fullName"
                            placeholder="Họ và tên"
                            onChange={handleChange}
                        />
                        {errors.fullName && (
                            <span className="error-msg">{errors.fullName}</span>
                        )}

                        <input
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                        />
                        {errors.email && (
                            <span className="error-msg">{errors.email}</span>
                        )}

                        <input
                            name="phone"
                            placeholder="Số điện thoại"
                            onChange={handleChange}
                        />
                        {errors.phone && (
                            <span className="error-msg">{errors.phone}</span>
                        )}

                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            onChange={handleChange}
                        />
                        {errors.password && (
                            <span className="error-msg">{errors.password}</span>
                        )}

                        <button type="submit">Đăng ký</button>

                    </form>

                    <p className="switch-link">
                        Đã có tài khoản?
                        <span onClick={() => navigate("/login")}>
                            {" "}Đăng nhập
                        </span>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default Register;