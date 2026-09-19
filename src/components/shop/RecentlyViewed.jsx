import React, { useState, useEffect } from 'react';
import api from '../../lib/api';

const RecentlyViewed = ({ onQuickAdd }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        const res = await api.get('/products');
        const allProducts = res.data;

        let recentProducts = [];

        const viewedStr = localStorage.getItem('recentlyViewed');
        if (viewedStr) {
          const viewedIds = JSON.parse(viewedStr);
          if (viewedIds.length > 0) {
            recentProducts = viewedIds
              .map(id => allProducts.find(p => p.id === id))
              .filter(p => p !== undefined)
              .map(p => ({
                id: p.id,
                image: p.imageUrl || '/images/product-tee.png',
                name: p.name,
                price: p.price,
                added: false,
                wishlisted: false,
                btnStyle: 'black'
              }));
          }
        }

        // Fallback: If no recently viewed items, show the newest 4 products as "Recommended"
        if (recentProducts.length === 0) {
          recentProducts = [...allProducts]
            .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
            .slice(0, 4)
            .map(p => ({
              id: p.id,
              image: p.imageUrl || '/images/product-tee.png',
              name: p.name,
              price: p.price,
              added: false,
              wishlisted: false,
              btnStyle: 'black',
              isFallback: true
            }));
        }

        setItems(recentProducts);
      } catch (err) {
        console.error('Failed to load recently viewed products', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentlyViewed();
  }, []);

  const toggleWishlist = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, wishlisted: !item.wishlisted } : item
      )
    );
  };

  const handleBtnClick = (item) => {
    setItems(
      items.map((it) => (it.id === item.id ? { ...it, added: !it.added } : it))
    );
    if (!item.added && onQuickAdd) {
      onQuickAdd({
        id: item.id,
        name: item.name,
        price: item.price,
        description: 'Recently viewed product'
      });
    }
  };

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <section className="py-12 border-t border-zinc-100">
      <div className="text-left mb-6">
        <h2 className="font-outfit text-xl font-extrabold tracking-wide text-zinc-900 uppercase">
          {items.length > 0 && items[0].isFallback ? 'Recommended For You' : 'Recently Viewed Products'}
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Explore the latest trends and must-haves. Shop now and stay stylish with our fresh collection!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group flex flex-col relative">
            <div className="aspect-[3/4] w-full bg-[#f4f4f4] rounded-sm overflow-hidden relative border border-zinc-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                onClick={() => {
                  if (item.id) window.location.href = `/product/${item.id}`;
                }}
              />

              {/* Heart Wishlist Overlay Top-Right */}
              <button
                onClick={() => toggleWishlist(item.id)}
                className="absolute top-3 right-3 bg-white/80 hover:bg-white text-zinc-800 rounded-full p-1.5 shadow-sm transition-colors duration-200"
              >
                <svg
                  className={`w-3.5 h-3.5 transition-colors duration-200 ${
                    item.wishlisted
                      ? 'fill-red-500 stroke-red-500 text-red-500'
                      : 'stroke-currentColor fill-none'
                  }`}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>

              {/* Bottom Button Overlay */}
              <div className="absolute bottom-0 left-0 right-0">
                <button
                  onClick={() => handleBtnClick(item)}
                  className={`w-full font-outfit text-[11px] font-bold tracking-widest py-3 uppercase transition-colors duration-200 ${
                    item.added
                      ? 'bg-black text-white hover:bg-zinc-800'
                      : item.btnStyle === 'black'
                      ? 'bg-black text-white hover:bg-zinc-800'
                      : 'bg-[#dddddd] text-zinc-800 hover:bg-zinc-300'
                  }`}
                >
                  {item.added ? 'Added' : 'Quick Add'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
