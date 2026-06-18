import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const loginCustomer = (data) => {
    return axios.post(`${API_URL}/login`, data);
};

export const loginAdmin = (data) => {
    return axios.post(`${API_URL}/admin/login`, data);
};

export const register = (data) => {
    return axios.post(`${API_URL}/register`, data);
};

export const loginWithGoogle = (credential) => {
    return axios.post(`${API_URL}/google`, { credential });
};

export const forgotPassword = (email) => {
    return axios.post(`${API_URL}/forgot-password`, { email });
};

export const resetPassword = (data) => {
    return axios.post(`${API_URL}/reset-password`, data);
};
