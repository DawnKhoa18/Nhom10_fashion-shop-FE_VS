import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/authService";
import "./AdminLogin.css";

function AdminLogin() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

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
            return;
        }
        setErrors({});
        setLoading(true);

        try {
            const response = await loginAdmin({ email, password });
            navigate("/admin");
        } catch (error) {
            setErrors({ general: error.response?.data || "Đăng nhập thất bại" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">

                <h1>Fashion 4Men Admin</h1>
                <p>Đăng nhập hệ thống quản trị</p>

                <form onSubmit={handleSubmit}>

                    {errors.general && (
                        <div className="alert-error">{errors.general}</div>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                        <span className="error-msg">{errors.email}</span>
                    )}

                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && (
                        <span className="error-msg">{errors.password}</span>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Đang xử lý..." : "Đăng nhập"}
                    </button>

                </form>

            </div>
        </div>
    );
}

export default AdminLogin;