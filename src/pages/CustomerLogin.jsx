import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { loginCustomer  } from "../services/authService";

function CustomerLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = "Email không được để trống";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Email không đúng định dạng";
        }
        if (!password) {
            newErrors.password = "Mật khẩu không được để trống";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return; // Dừng lại, không gọi API
    }
        setErrors({});

        try {
            const response = await loginCustomer({ email, password });
            localStorage.setItem("token", response.data.token);
            navigate("/");
        } catch (error) {
            setErrors({ general: error.response?.data || "Đăng nhập thất bại" });
        }
    };

    <form onSubmit={handleSubmit}>

    {/* Lỗi chung từ server */}
    {errors.general && <div className="alert-error">{errors.general}</div>}

    <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
    />
    {errors.email && <span className="error-msg">{errors.email}</span>} {/* ← thêm */}

    <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
    />
    {errors.password && <span className="error-msg">{errors.password}</span>} {/* ← thêm */}

    <button type="submit">
        Đăng nhập
    </button>

    </form>

    return (
        <div className="auth-container">

            <div className="auth-card">

                <div className="auth-left">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy1dpfvtqjo6V-uMmNXFwgO3t9AOavJzn0X8BNYKZqSXqI5YxsyJSrdi8z&s=10"
                        alt="fashion"
                    />
                </div>

                <div className="auth-right">

                    <h2>Đăng nhập</h2>

                    <p>Chào mừng quay trở lại 👋</p>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button type="submit">
                            Đăng nhập
                        </button>                        

                    </form>

                    <p className="switch-link">
                    Chưa có tài khoản?
                    <span
                        onClick={() => navigate("/register")}
                    >
                        {" "}Đăng ký ngay
                    </span>
                    </p>

                </div>

            </div>

        </div>
    );
    
}

export default CustomerLogin;