import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/admin/AdminLayout';
import HomePage from './pages/HomePage';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CheckoutPage from './pages/CheckoutPage';
import AdminHome from './pages/AdminHome';
import AdminProducts from './pages/AdminProducts';
import AdminProductForm from './pages/AdminProductForm';
import AdminOrders from './pages/AdminOrders';
import AdminOrderUpdate from './pages/AdminOrderUpdate';
import AdminStatistics from './pages/AdminStatistics';
import './App.css';
import './Admin.css';

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const routes = (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tat-ca" element={<ProductList defaultSlug="tat-ca" />} />
      <Route path="/hang-moi" element={<ProductList defaultSlug="hang-moi" />} />
      <Route path="/hang-ban-chay" element={<ProductList defaultSlug="hang-ban-chay" />} />
      <Route path="/danh-muc/:slug" element={<ProductList />} />
      <Route path="/san-pham/:id" element={<ProductDetail />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/admin/san-pham" element={<AdminProducts />} />
      <Route path="/admin/san-pham/them" element={<AdminProductForm mode="create" />} />
      <Route path="/admin/san-pham/sua/:id" element={<AdminProductForm mode="edit" />} />
      <Route path="/admin/don-hang" element={<AdminOrders />} />
      <Route path="/admin/don-hang/cap-nhat/:id" element={<AdminOrderUpdate />} />
      <Route path="/admin/thong-ke" element={<AdminStatistics />} />
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
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </Router>
  );
}

export default App;
