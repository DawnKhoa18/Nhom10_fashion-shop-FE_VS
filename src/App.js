import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; 
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage'; 
import ProductList from './pages/ProductList'; 
import ProductDetail from './pages/ProductDetail'; 
import CheckoutPage from './pages/CheckoutPage'; // Import file CheckoutPage có sẵn
import './App.css';

function App() {
  return (
    <Router>
      <CartProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tat-ca" element={<ProductList defaultSlug="tat-ca" />} />
            <Route path="/hang-moi" element={<ProductList defaultSlug="hang-moi" />} />
            <Route path="/hang-ban-chay" element={<ProductList defaultSlug="hang-ban-chay" />} />
            <Route path="/danh-muc/:slug" element={<ProductList />} />
            <Route path="/san-pham/:id" element={<ProductDetail />} />
            {/* Route cho trang thanh toán */}
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </MainLayout>
      </CartProvider>
    </Router>
  );
}

export default App;