import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import ProductSection from './components/home/ProductSection';
import CategorySection from './components/home/CategorySection';
import ProductDetails from './components/product/ProductDetails';
import Footer from './components/layout/Footer';
import './App.css';

function App() {
  const [view, setView] = useState('product'); // Defaulting to product for now as per user focus

  const showHome = () => setView('home');
  const showProduct = () => setView('product');

  return (
    <div className="App">
      <Navbar onHomeClick={showHome} onProductClick={showProduct} />
      <main>
        {view === 'home' ? (
          <>
            <Hero onShopNow={showProduct} />
            <ProductSection 
              title="NEW ARRIVALS" 
              description="Explore the latest trends and must-haves. Shop now and stay stylish with our fresh collection!" 
            />
            <ProductSection 
              title="BEST SELLER" 
              description="Discover our most popular items. Shop the favorites everyone loves!" 
            />
            <CategorySection />
          </>
        ) : (
          <ProductDetails onBack={showHome} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
