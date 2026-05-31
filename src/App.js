import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage'; 
import ProductList from './pages/ProductList'; // <--- CHẮC CHẮN RẰNG ÔNG ĐÃ IMPORT DÒNG NÀY (Sửa lại đường dẫn file nếu cần)
import ProductDetail from './pages/ProductDetail'; // CHỈ THÊM IMPORT TRANG CHI TIẾT SẢN PHẨM
import './App.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* 1. Trang chủ */}
          <Route path="/" element={<HomePage />} />
          
          {/* 2. Các trang danh sách cứng cố định */}
          <Route path="/tat-ca" element={<ProductList defaultSlug="tat-ca" />} />
          <Route path="/hang-moi" element={<ProductList defaultSlug="hang-moi" />} />
          <Route path="/hang-ban-chay" element={<ProductList defaultSlug="hang-ban-chay" />} />
          
          {/* 3. Trang danh sách động theo slug danh mục từ Menu */}
          <Route path="/danh-muc/:slug" element={<ProductList />} />

          {/* ================= CHỈ SỬA ĐÚNG ROUTE CHI TIẾT SẢN PHẨM THEO ID Ở ĐÂY ================= */}
          <Route path="/san-pham/:id" element={<ProductDetail />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;