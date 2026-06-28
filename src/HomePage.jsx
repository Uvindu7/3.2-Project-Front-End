import React from "react";

import Hero from "./components/home/Hero";
import ProductSection from "./components/home/ProductSection";
import CategorySection from "./components/home/CategorySection";

function HomePage() {
  return (
    <>
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
    </>
  );
}

export default HomePage;