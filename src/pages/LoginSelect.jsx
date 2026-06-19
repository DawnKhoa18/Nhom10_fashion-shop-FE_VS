import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSelect.css";

function LoginSelect() {

    const navigate = useNavigate();

    return (
        <div className="login-select-container">

            <div className="login-select-card">

                <h1>Fashion 4Men</h1>

                <p>Chào mừng đến với cửa hàng thời trang</p>

                <div className="account-section">

                    <h3>Khách hàng</h3>

                    <button
                        className="customer-login"
                        onClick={() =>
                            navigate("/login/customer")
                        }
                    >
                        Đăng nhập
                    </button>

                    <button
                        className="customer-register"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Đăng ký
                    </button>

                </div>

                <div className="divider"></div>

                <div className="account-section">

                    <h3>Admin / Nhân viên</h3>

                    <button
                        className="admin-login"
                        onClick={() =>
                            navigate("/login/admin")
                        }
                    >
                        Đăng nhập
                    </button>

                </div>

            </div>

        </div>
    );
}

export default LoginSelect;