import React, { useState, useEffect } from "react";
import api from "./lib/api";

import Hero from "./components/home/Hero";
import ProductSection from "./components/home/ProductSection";
import CategorySection from "./components/home/CategorySection";

function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  // For New Arrivals, let's take the last 4 products added
  const newArrivals = [...products].sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt)).slice(0, 4);
  
  // For Best Sellers, let's just pick another slice, or sort differently if we had sales data
  // Using the first 4 products as a fallback for "Best Sellers"
  const bestSellers = products.slice(0, 4);

  return (
    <>
      <Hero />

      <ProductSection
        title="NEW ARRIVALS"
        description="Explore the latest trends and must-haves. Shop now and stay stylish with our fresh collection!"
        products={newArrivals}
      />

      <ProductSection
        title="BEST SELLER"
        description="Discover our most popular items. Shop the favorites everyone loves!"
        products={bestSellers}
      />

      <CategorySection />
    </>
  );
}

export default HomePage;