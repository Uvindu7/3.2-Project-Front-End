import React from 'react';
import ProductCard from './ProductCard';

const ProductSection = ({ title, description }) => {
  const products = [
    { id: 1, name: 'Raglan Tee', image: '/images/product-tee.png', added: false },
    { id: 2, name: 'Raglan Tee', image: '/images/product-tee.png', added: false },
    { id: 3, name: 'Raglan Tee', image: '/images/product-tee.png', added: true },
    { id: 4, name: 'Raglan Tee', image: '/images/product-tee.png', added: false },
  ];

  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-10 max-w-[600px]">
          <h2 className="text-[2rem] font-bold text-[#111] mb-2 font-outfit">{title}</h2>
          <p className="text-[0.9rem] text-text-muted">{description}</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              image={product.image} 
              name={product.name} 
              added={product.added} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;

