import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ image, name, added, onClick }) => {
  const [isAdded, setIsAdded] = useState(added);

  return (
    <div className="product-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="product-image-area">
        <img src={image} alt={name} className="product-img" />
        <button className="favorite-btn" onClick={(e) => e.stopPropagation()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <div className="card-hover-actions">
          <button 
            className={`quick-add-btn ${isAdded ? 'added' : ''}`}
            onClick={(e) => { e.stopPropagation(); setIsAdded(!isAdded); }}
          >
            {isAdded ? 'ADDED' : 'QUICK ADD'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
