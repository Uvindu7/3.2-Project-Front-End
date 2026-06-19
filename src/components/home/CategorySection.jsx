import React from 'react';

const categories = [
  { id: 1, name: 'WOMENS', image: '/images/womens.png', size: 'large' },
  { id: 2, name: 'MENS', image: '/images/mens.png', size: 'large' },
  { id: 3, name: 'KIDS', image: '/images/kids.png', size: 'full' },
];

const CategorySection = () => {
  return (
    <section className="bg-white text-center py-20">
      <div className="container">
        <h2 className="text-2xl font-bold mb-12 text-[#111] font-outfit">SHOP BY CATEGORY</h2>
        
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.slice(0, 2).map((cat) => (
              <div key={cat.id} className="relative rounded-[24px] overflow-hidden aspect-[16/14] bg-[#f5f5f5] group">
                <div className="w-full h-full">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-[600ms] ease-custom group-hover:scale-105" />
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-black/40 to-transparent">
                    <button className="bg-white text-[#111] px-5 py-2.5 rounded-[20px] text-[0.7rem] font-bold border-none mb-4 opacity-90 transition-all duration-300 ease-custom hover:opacity-100 hover:scale-105">SHOP NOW</button>
                    <h3 className="font-outfit text-white text-[clamp(2rem,5vw,4rem)] font-extrabold tracking-tight leading-none uppercase">{cat.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bottom-row">
            <div className="relative rounded-[24px] overflow-hidden aspect-[16/10] md:aspect-[16/6] bg-[#f5f5f5] group">
              <div className="w-full h-full">
                <img src={categories[2].image} alt={categories[2].name} className="w-full h-full object-cover transition-transform duration-[600ms] ease-custom group-hover:scale-105" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-black/40 to-transparent">
                  <button className="bg-white text-[#111] px-5 py-2.5 rounded-[20px] text-[0.7rem] font-bold border-none mb-4 opacity-90 transition-all duration-300 ease-custom hover:opacity-100 hover:scale-105">SHOP NOW</button>
                  <h3 className="font-outfit text-white text-[clamp(2rem,5vw,4rem)] font-extrabold tracking-tight leading-none uppercase">{categories[2].name}</h3>
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

