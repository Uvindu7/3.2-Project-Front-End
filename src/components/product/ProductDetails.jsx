import React, { useState } from 'react';
import ProductSection from '../home/ProductSection';
import './ProductDetails.css';

const ProductDetails = ({ onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Deep Charcoal');

  const colors = [
    { name: 'Black', hex: '#111' },
    { name: 'Light Grey', hex: '#ddd' },
    { name: 'Deep Charcoal', hex: '#333' }
  ];

  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <div className="product-details-page">
      <div className="container">
        <div className="breadcrumb">
          <button className="back-btn" onClick={onBack}>
            <span>←</span> Back to Browse
          </button>
        </div>

        <div className="product-main">
          {/* Product Image Section */}
          <div className="product-visual">
            <div className="image-card">
              <span className="badge-3d">
                <span className="icon">🎮</span> 3D INTERACTIVE
              </span>
              <img 
                src="/images/charcoal-tee.png" 
                alt="Comfort Fit Crew Neck T Shirt" 
                className="main-product-img"
              />
            </div>
          </div>

          {/* Product Info Section */}
          <div className="product-info">
            <span className="product-meta">POPULAR MENS</span>
            <h1 className="product-title">Comfort Fit Crew Neck T Shirt</h1>
            <h2 className="product-price">RS 2900.00</h2>

            <p className="product-description">
              Manufactured from 240GSM heavyweight organic cotton. 
              A structured drape meets effortless comfort. 
              Features a reinforced ribbed collar and a slightly dropped shoulder for 
              a modern, architectural silhouette.
            </p>

            <div className="selection-group">
              <span className="selection-label">COLOR: {selectedColor.toUpperCase()}</span>
              <div className="color-options">
                {colors.map(color => (
                  <button 
                    key={color.name}
                    className={`color-dot ${selectedColor === color.name ? 'active' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="selection-group">
              <div className="label-row">
                <span className="selection-label">SIZE</span>
                <button className="size-guide">Size Guide</button>
              </div>
              <div className="size-options">
                {sizes.map(size => (
                  <button 
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="purchase-actions">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button className="add-to-cart-btn">
                ADD TO CART <span>🛒</span>
              </button>
            </div>

            <button className="buy-now-btn">BUY NOW</button>

            <div className="product-features">
              <div className="feature-item">
                <span className="icon">🚚</span>
                <span>Complimentary Express Shipping</span>
              </div>
              <div className="feature-item">
                <span className="icon">🌿</span>
                <span>100% GOTS Certified Organic Cotton</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation Sections */}
        <div className="recommendations-area">
          <ProductSection 
            title="SMART RECOMMENDATIONS" 
            description="Explore the latest trends and must-haves. Shop now and stay stylish with our fresh collection!" 
            onProductClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          />
          <ProductSection 
            title="RELATED PRODUCTS" 
            description="Explore the latest trends and must-haves. Shop now and stay stylish with our fresh collection!" 
            onProductClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          />
          <ProductSection 
            title="RECENTLY VIEWED PRODUCTS" 
            description="Explore the latest trends and must-haves. Shop now and stay stylish with our fresh collection!" 
            onProductClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
