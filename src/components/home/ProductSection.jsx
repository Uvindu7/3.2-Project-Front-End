import React from 'react';
import ProductCard from './ProductCard';
import './ProductSection.css';

const ProductSection = ({ title, description, onProductClick }) => {
  const products = [
    { id: 1, name: 'Raglan Tee', image: '/images/product-tee.png', added: false },
    { id: 2, name: 'Raglan Tee', image: '/images/product-tee.png', added: false },
    { id: 3, name: 'Raglan Tee', image: '/images/product-tee.png', added: true },
    { id: 4, name: 'Raglan Tee', image: '/images/product-tee.png', added: false },
  ];

  return (
    <section className="product-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title-large">{title}</h2>
          <p className="section-desc">{description}</p>
        </div>
        
        <div className="product-grid-main">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              image={product.image} 
              name={product.name} 
              added={product.added} 
              onClick={onProductClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
