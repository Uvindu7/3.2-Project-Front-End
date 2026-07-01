import React from "react";

import Hero from "./components/home/Hero";
import ProductSection from "./components/home/ProductSection";
import CategorySection from "./components/home/CategorySection";

function HomePage() {
  const newArrivals = [
    { id: 1, name: 'Premium Crew Tee', image: '/images/charcoal-tee.png', added: false },
    { id: 2, name: 'Raglan Tee', image: '/images/product-tee.png', added: false },
    { id: 3, name: 'Raglan Tee', image: '/images/product-tee.png', added: true },
    { id: 4, name: 'Raglan Tee', image: '/images/product-tee.png', added: false },
  ];

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
      />

      <CategorySection />
    </>
  );
}

export default HomePage;