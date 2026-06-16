import React from 'react';
import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import ProductSection from './components/home/ProductSection';
import CategorySection from './components/home/CategorySection';
import Footer from './components/layout/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Hero />
        
        <ProductSection 
          title="NEW ARRIVALS" 
          description="Explore the latest trends and must-haves. Shop now and stay stylish with our fresh collection!" 
        />
        
        <ProductSection 
          title="BEST SELLER" 
          description="Discover our most popular items. Shop the favorites everyone loves!" 
        />

        <CategorySection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
