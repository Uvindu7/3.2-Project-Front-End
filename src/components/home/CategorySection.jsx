import React from 'react';
import './CategorySection.css';

const categories = [
  { id: 1, name: 'WOMENS', image: '/images/womens.png', size: 'large' },
  { id: 2, name: 'MENS', image: '/images/mens.png', size: 'large' },
  { id: 3, name: 'KIDS', image: '/images/kids.png', size: 'full' },
];

const CategorySection = () => {
  return (
    <section className="category-section">
      <div className="container">
        <h2 className="section-title">SHOP BY CATEGORY</h2>
        
        <div className="category-grid">
          <div className="top-row">
            {categories.slice(0, 2).map((cat) => (
              <div key={cat.id} className="category-card">
                <div className="category-image-wrapper">
                  <img src={cat.image} alt={cat.name} />
                  <div className="category-overlay">
                    <button className="shop-now-pill">SHOP NOW</button>
                    <h3 className="category-name">{cat.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bottom-row">
            <div className="category-card full-width">
              <div className="category-image-wrapper">
                <img src={categories[2].image} alt={categories[2].name} />
                <div className="category-overlay">
                  <button className="shop-now-pill">SHOP NOW</button>
                  <h3 className="category-name">{categories[2].name}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
