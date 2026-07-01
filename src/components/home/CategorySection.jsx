import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 1, name: 'WOMENS', image: '/images/womens.png', size: 'large', path: '/womens' },
  { id: 2, name: 'MENS', image: '/images/mens.png', size: 'large', path: '/mens' },
  { id: 3, name: 'KIDS', image: '/images/kids.png', size: 'full', path: '/kids' },
];

const CategorySection = () => {
  return (
    <section className="bg-white text-center py-20">
      <div className="container">
        <h2 className="text-2xl font-bold mb-12 text-[#111] font-outfit uppercase tracking-tight">SHOP BY CATEGORY</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={cat.path}
              className="relative rounded-[24px] overflow-hidden aspect-[4/5] bg-[#f5f5f5] group block h-full cursor-pointer"
            >
              <div className="w-full h-full relative">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-[600ms] ease-custom group-hover:scale-105" 
                />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-black/40 to-transparent">
                  <div className="bg-white text-[#111] px-5 py-2.5 rounded-[20px] text-[0.7rem] font-bold border-none mb-4 opacity-90 transition-all duration-300 ease-custom group-hover:opacity-100 group-hover:scale-105">
                    SHOP NOW
                  </div>
                  <h3 className="font-outfit text-white text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold tracking-tight leading-none uppercase">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

