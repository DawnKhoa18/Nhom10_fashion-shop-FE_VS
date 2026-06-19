import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/admin/AdminLayout';
import HomePage from './pages/HomePage';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrders from './pages/MyOrders';
import CustomerOrderDetail from './pages/CustomerOrderDetail';
import AccountPage from './pages/AccountPage';
import AdminHome from './pages/AdminHome';
import AdminProducts from './pages/AdminProducts';
import AdminProductForm from './pages/AdminProductForm';
import AdminCustomers from './pages/AdminCustomers';
import AdminCustomerForm from './pages/AdminCustomerForm';
import AdminOrders from './pages/AdminOrders';
import AdminOrderUpdate from './pages/AdminOrderUpdate';
import AdminStatistics from './pages/AdminStatistics';
import AdminChat from './pages/AdminChat';
import './App.css';
import './Admin.css';
import CustomerLogin from "./pages/CustomerLogin";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import MomoReturnPage from "./pages/MomoReturnPage";
import VnpayReturnPage from "./pages/VnpayReturnPage";
import StorePage from "./pages/StorePage";
import ImageSearchPage from "./pages/ImageSearchPage";

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const routes = (
    <Routes>
      <Route path="/login" element={<CustomerLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/quen-mat-khau" element={<ForgotPassword />} />
      <Route path="/login/customer" element={<CustomerLogin />} />
      <Route path="/login/admin" element={<CustomerLogin />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/cua-hang" element={<StorePage />} />
      <Route path="/tat-ca" element={<ProductList defaultSlug="tat-ca" />} />
      <Route path="/hang-moi" element={<ProductList defaultSlug="hang-moi" />} />
      <Route path="/hang-ban-chay" element={<ProductList defaultSlug="hang-ban-chay" />} />
      <Route path="/tim-kiem" element={<ProductList defaultSlug="tat-ca" />} />
      <Route path="/tim-kiem-hinh-anh" element={<ImageSearchPage />} />
      <Route path="/danh-muc/:slug" element={<ProductList />} />
      <Route path="/san-pham/:id" element={<ProductDetail />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout/success" element={<OrderSuccessPage />} />
      <Route path="/checkout/momo-return" element={<MomoReturnPage />} />
      <Route path="/checkout/vnpay-return" element={<VnpayReturnPage />} />
      <Route path="/don-hang-cua-toi" element={<MyOrders />} />
      <Route path="/don-hang-cua-toi/:id" element={<CustomerOrderDetail />} />
      <Route path="/tai-khoan" element={<AccountPage />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/admin/san-pham" element={<AdminProducts />} />
      <Route path="/admin/san-pham/them" element={<AdminProductForm mode="create" />} />
      <Route path="/admin/san-pham/sua/:id" element={<AdminProductForm mode="edit" />} />
      <Route path="/admin/khach-hang" element={<AdminCustomers />} />
      <Route path="/admin/khach-hang/them" element={<AdminCustomerForm mode="create" />} />
      <Route path="/admin/khach-hang/sua/:id" element={<AdminCustomerForm mode="edit" />} />
      <Route path="/admin/don-hang" element={<AdminOrders />} />
      <Route path="/admin/don-hang/cap-nhat/:id" element={<AdminOrderUpdate />} />
      <Route path="/admin/thong-ke" element={<AdminStatistics />} />
      <Route path="/admin/tro-chuyen" element={<AdminChat />} />
      <Route path="/gio-hang" element={<CheckoutPage />} />
    </Routes>
  );

  if (isAdminRoute) {
    return <AdminLayout>{routes}</AdminLayout>;
  }

  return <MainLayout>{routes}</MainLayout>;
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
