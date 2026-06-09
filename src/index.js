import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

// BƯỚC 1: Import CartProvider từ thư mục context của bạn vào đây
import { CartProvider } from './context/CartContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* BƯỚC 2: Bọc thẻ <CartProvider> ôm xung quanh <App /> */}
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);