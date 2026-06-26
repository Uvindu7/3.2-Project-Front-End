import React, { useState } from "react";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import HomePage from "./HomePage";
import FashionPage from "./FashionPage";

import ProductDetails from "./components/product/ProductDetails";

import "./App.css";

function App() {

  const [view, setView] = useState("home");

  const showHome = () => setView("home");
  const showFashion = () => setView("fashion");
  const showProduct = () => setView("product");

  return (
    <div className="App">

      <Navbar
        onHomeClick={showHome}
        onFashionClick={showFashion}
      />

      <main>

        {view === "home" && (
          <HomePage onProductClick={showProduct} />
        )}

        {view === "fashion" && (
          <FashionPage />
        )}

        {view === "product" && (
          <ProductDetails onBack={showHome} />
        )}

      </main>

      <Footer />

    </div>
  );
}

export default App;