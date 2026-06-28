import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import ProductSection from './components/home/ProductSection';
import CategorySection from './components/home/CategorySection';
import ProductDetails from './components/product/ProductDetails';
import Footer from './components/layout/Footer';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Contact from './components/contact/Contact';
import Shop from './components/shop/Shop';

function App() {
  const [view, setView] = useState('home'); 

  const showHome = () => setView('home');
  const showProduct = () => setView('product');
  const showLogin = () => setView('login');
  const showRegister = () => setView('register');
  const showContact = () => setView('contact');
  const showAbout = () => {
    setView('home');
    setTimeout(() => {
      document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  const showTrending = () => setView('shop');

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans text-text-main antialiased selection:bg-black selection:text-white">
      <Navbar 
        onHomeClick={showHome} 
        onTrendingClick={showTrending}
        onProductClick={showProduct} 
        onLoginClick={showLogin} 
        onContactClick={showContact} 
        onAboutClick={showAbout}
      />
      <main>
        {view === 'home' && (
          <>
            <Hero onShopNow={showProduct} />
            <ProductSection 
              id="trending"
              title="NEW ARRIVALS" 
              description="Explore the latest trends and must-haves. Shop now and stay stylish with our fresh collection!" 
              onProductClick={showProduct}
            />
            <ProductSection 
              title="BEST SELLER" 
              description="Discover our most popular items. Shop the favorites everyone loves!" 
              onProductClick={showProduct}
            />
            <CategorySection />
          </>
        )}
        {view === 'shop' && (
          <Shop onProductClick={showProduct} />
        )}
        {view === 'product' && (
          <ProductDetails onBack={showHome} />
        )}
        {view === 'login' && (
          <Login onRegisterClick={showRegister} onBackClick={showHome} />
        )}
        {view === 'register' && (
          <Register onLoginClick={showLogin} onBackClick={showHome} />
        )}
        {view === 'contact' && (
          <Contact />
        )}
      </main>
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
}

export default App;

