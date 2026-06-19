import React, { useCallback, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithGoogle, register } from "../services/authService";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";

function Register() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const saveLoginSession = useCallback((data) => {
        localStorage.removeItem("customerId");
        localStorage.removeItem("employeeId");
        localStorage.setItem(
            data.accountType === "EMPLOYEE" ? "employeeId" : "customerId",
            data.accountType === "EMPLOYEE" ? data.employeeId : data.customerId
        );
        localStorage.setItem("fullName", data.fullName);
        localStorage.setItem("email", data.email);
        localStorage.setItem("role", data.role);
        localStorage.setItem("accountType", data.accountType);
        window.dispatchEvent(new Event("profileUpdated"));
        navigate(data.accountType === "EMPLOYEE" ? "/admin" : "/", { replace: true });
    }, [navigate]);

    const handleGoogleSuccess = useCallback(async (credential) => {
        setSubmitting(true);
        setErrors({});
        setSuccess("");
        try {
            const response = await loginWithGoogle(credential);
            saveLoginSession(response.data);
        } catch (error) {
            setErrors({ general: error.response?.data || "Đăng ký/đăng nhập Google thất bại" });
        } finally {
            setSubmitting(false);
        }
    }, [saveLoginSession]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors((old) => ({ ...old, [e.target.name]: "" }));
        setSuccess("");
    };

    const validate = () => {
        const { fullName, email, phone, password, confirmPassword } = formData;
        const newErrors = {};

        if (!fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
        if (!email.trim()) newErrors.email = "Vui lòng nhập email";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Email không đúng định dạng";
        if (!phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
        else if (!/^[0-9]{10}$/.test(phone)) newErrors.phone = "Số điện thoại phải đúng 10 chữ số";
        if (!password) newErrors.password = "Vui lòng nhập mật khẩu";
        else if (password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";

        if (password !== confirmPassword) newErrors.confirmPassword = "Xác nhận mật khẩu không khớp";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSubmitting(true);
        setErrors({});
        setSuccess("");
        try {
            const { confirmPassword, ...dataToSubmit } = formData;
            await register(dataToSubmit);
            setSuccess("Đăng ký thành công! Đang chuyển sang trang đăng nhập...");
            setTimeout(() => navigate("/login", { replace: true }), 900);
        } catch (error) {
            setErrors({ general: error.response?.data || "Đăng ký thất bại" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center py-5" style={{ minHeight: "calc(100vh - 250px)" }}>
            <div className="card border-0 shadow p-4 rounded-4" style={{ width: "100%", maxWidth: 460 }}>
                <h3 className="text-center fw-bold mb-2" style={{ color: "#f59e0b" }}>Đăng ký</h3>
                <p className="text-center text-muted mb-4">Tạo tài khoản Fashion 4Men của bạn</p>

                {errors.general && <div className="alert alert-danger py-2">{errors.general}</div>}
                {success && <div className="alert alert-success py-2">{success}</div>}

                <GoogleSignInButton
                    text="signup_with"
                    onSuccess={handleGoogleSuccess}
                    onError={(message) => setErrors({ general: message })}
                />

                <div className="d-flex align-items-center gap-2 my-3">
                    <hr className="flex-grow-1" />
                    <span className="text-muted small">hoặc</span>
                    <hr className="flex-grow-1" />
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Họ tên</label>
                        <input
                            name="fullName"
                            className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                            placeholder="Họ và tên"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                        {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                            type="email"
                            name="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            placeholder="Email của bạn"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Số điện thoại</label>
                        <input
                            name="phone"
                            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                            placeholder="Số điện thoại"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                            placeholder="Nhập lại mật khẩu"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>

                    <button type="submit" className="btn btn-dark w-100 fw-bold py-2 btn-view rounded-3" disabled={submitting || !!success}>
                        {submitting ? "Đang đăng ký..." : "ĐĂNG KÝ"}
                    </button>
                </form>

                <p className="text-center mt-3 mb-0">
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-primary fw-semibold text-decoration-none">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;