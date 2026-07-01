import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import HomePage from "./HomePage";
import FashionPage from "./FashionPage";
import ProductDetails from './components/product/ProductDetails';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Contact from './components/contact/Contact';
import Shop from './components/shop/Shop';
import CartPage from './components/cart/CartPage';
import CheckoutPage from './components/checkout/CheckoutPage';

// Cart Context
import { CartProvider } from './context/CartContext';

import { AuthProvider } from './context/AuthContext';
import Profile from './components/auth/Profile';

function App() {
  return (
    <CartProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/fashion" element={<FashionPage />} />
            <Route path="/product" element={<ProductDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
            
    </AuthProvider>
  );
}

export default App;
