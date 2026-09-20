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

// Cart Context
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import Profile from './components/auth/Profile';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminReviews from './components/admin/AdminReviews';
import AdminCategories from './components/admin/AdminCategories';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';
import AdminReports from './components/admin/AdminReports';
import AdminRecommendations from './components/admin/AdminRecommendations';
import BodyViewport from './components/3dviewport/BodyViewport';
import VirtualFittingStudio from './components/3dviewport/VirtualFittingStudio';

function App() {
  return (
    <ModalProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<FashionPage />} />
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
              <Route path="/3d-viewport" element={<BodyViewport />} />
              <Route path="/body-customizer" element={<BodyViewport />} />
              <Route path="/3dviewport" element={<BodyViewport />} />
              <Route path="/virtual-fitting" element={<VirtualFittingStudio />} />
              <Route path="/virtual-fit" element={<VirtualFittingStudio />} />
              <Route path="/try-fit" element={<VirtualFittingStudio />} />
              <Route path="/mens" element={<Shop key="mens" initialCategory="Men's Collection" title="MEN'S COLLECTION" description="Discover our premium range of men's apparel, designed for comfort and style." />} />
              <Route path="/womens" element={<Shop key="womens" initialCategory="Women's Collection" title="WOMEN'S COLLECTION" description="Explore our elegant and comfortable women's apparel for every occasion." />} />
              <Route path="/kids" element={<Shop key="kids" initialCategory="Kids Collection" title="KIDS COLLECTION" description="Fun, durable, and comfortable clothing designed for active kids." />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="recommendations" element={<AdminRecommendations />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
    </ModalProvider>
  );
}

export default App;
