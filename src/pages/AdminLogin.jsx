import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/authService";
import "./AdminLogin.css";

function AdminLogin() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await loginAdmin({
                email,
                password
            });

            alert(response.data);

            navigate("/admin");

        } catch (error) {

            alert("Đăng nhập thất bại");
        }
    };

    return (
        <div className="admin-login-container">

            <div className="admin-login-card">

                <h1>Fashion 4Men Admin</h1>

                <p>Đăng nhập hệ thống quản trị</p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)}
                    />

                    <button type="submit">
                        Đăng nhập
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AdminLogin;