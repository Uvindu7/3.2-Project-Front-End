import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout
import MainLayout from './components/layout/MainLayout';
import ScrollToTop from './components/layout/ScrollToTop';

// Pages
import HomePage from "./HomePage";
import FashionPage from "./components/fashion/FashionPage";
import ProductDetails from './components/product/ProductDetails';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Contact from './components/contact/Contact';
import Shop from './components/shop/Shop';
import CartPage from './components/cart/CartPage';
import CheckoutPage from './components/checkout/CheckoutPage';
import MensPage from './components/shop/MensPage';
import WomensPage from './components/shop/WomensPage';
import KidsPage from './components/shop/KidsPage';

// Cart Context
import { CartProvider } from './context/CartContext';

import { AuthProvider } from './context/AuthContext';
import Profile from './components/auth/Profile';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminReviews from './components/admin/AdminReviews';
import AdminProducts from './components/admin/AdminProducts';

function App() {
  return (
    <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<FashionPage />} />
            <Route path="/trending" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/mens" element={<MensPage />} />
            <Route path="/womens" element={<WomensPage />} />
            <Route path="/kids" element={<KidsPage />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
