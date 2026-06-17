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

        try {

            const response = await register(formData);

            alert(response.data);
            navigate("/login");

        } catch (error) {

            alert("Đăng ký thất bại");
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

                        <input
                            name="fullName"
                            placeholder="Họ và tên"
                            onChange={handleChange}
                        />

                        <input
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                        />

                        <input
                            name="phone"
                            placeholder="Số điện thoại"
                            onChange={handleChange}
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            onChange={handleChange}
                        />

                        <button type="submit">
                            Đăng ký
                        </button>

                    </form>

                    <p className="switch-link">
                    Đã có tài khoản?
                    <span
                        onClick={() =>
                            navigate("/login/customer")
                        }
                    >
                        {" "}Đăng nhập
                    </span>
                    </p>

                </div>

            </div>

        </div>
    );
    <p className="switch-link">
    Đã có tài khoản?
    <span onClick={() => navigate("/login/customer")}>
        Đăng nhập
    </span>
    </p>
}

export default Register;