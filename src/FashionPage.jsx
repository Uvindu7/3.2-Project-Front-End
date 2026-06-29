import React from "react";

import Hero from "./components/fashion/Hero";
import FeatureSection from "./components/fashion/FeatureSection";
import TechnologySection from "./components/fashion/TechnologySection";
import PrecisionSection from "./components/fashion/PrecisionSection";

function FashionPage() {
  return (
    <>
      <Hero />
      <FeatureSection />
      <TechnologySection />
      <PrecisionSection />
    </>
  );
}

export default FashionPage;