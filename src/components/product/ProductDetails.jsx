import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../lib/api';
import ProductSection from '../home/ProductSection';
import TwoDProductCard from './2DProductCard';
import ThreeDProductCard from './3DProductCard';
import TShirtModel from './TShirtModel';
import SizeButton from './SizeButton';
import ProductReviews from './ProductReviews';
import ProductCard from '../shop/ProductCard';


// SVG icon shown on the "3D INTERACTIVE" badge
const Icon3D = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

// SVG icon shown on the "BACK TO 2D" badge
const Icon2D = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Deep Charcoal');
  const [is3D, setIs3D] = useState(false);
  
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAvailableStock = (size) => {
    if (!product) return 0;
    if (size === 'S') return product.stockS;
    if (size === 'M') return product.stockM;
    if (size === 'L') return product.stockL;
    return 0;
  };

  const currentStock = getAvailableStock(selectedSize);

  useEffect(() => {
    if (quantity > currentStock && currentStock > 0) {
      setQuantity(currentStock);
    } else if (currentStock === 0) {
      setQuantity(1);
    }
  }, [selectedSize, currentStock, quantity]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const [prodRes, recRes, allRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/products/${id}/recommendations`),
          api.get(`/products`)
        ]);
        setProduct(prodRes.data);
        setRecommendations(recRes.data);

        // Find related products (same category, excluding current product)
        if (prodRes.data && allRes.data) {
          let related = allRes.data.filter(p => p.categoryId === prodRes.data.categoryId && p.id !== prodRes.data.id);
          
          // Fallback if not enough products in same category
          if (related.length < 4) {
            const otherProducts = allRes.data.filter(p => p.id !== prodRes.data.id && !related.find(r => r.id === p.id));
            related = [...related, ...otherProducts].slice(0, 4);
          } else {
            related = related.slice(0, 4);
          }
          setRelatedProducts(related);
        }

        // Update Recently Viewed in localStorage
        if (prodRes.data) {
          const viewedStr = localStorage.getItem('recentlyViewed');
          let viewedIds = viewedStr ? JSON.parse(viewedStr) : [];
          
          // Remove if exists to push to front
          viewedIds = viewedIds.filter(vId => vId !== prodRes.data.id);
          viewedIds.unshift(prodRes.data.id);
          
          // Keep only last 12
          if (viewedIds.length > 12) {
            viewedIds.pop();
          }
          localStorage.setItem('recentlyViewed', JSON.stringify(viewedIds));
        }
      } catch (err) {
        console.error('Failed to fetch product data', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProductData();
    }
  }, [id]);

  const colors = [
    { name: 'Black', hex: '#111' },
    { name: 'Light Grey', hex: '#ddd' },
    { name: 'Deep Charcoal', hex: '#333' }
  ];

  if (loading) {
    return <div className="pt-32 pb-20 min-h-screen text-center text-xl">Loading product...</div>;
  }

  if (!product) {
    return <div className="pt-32 pb-20 min-h-screen text-center text-xl">Product not found</div>;
  }

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="container">
        <div className="mb-4">
          <button className="flex items-center gap-2 text-[0.85rem] text-[#666] font-medium transition-all duration-300 ease-custom hover:text-[#111] hover:-translate-x-1 border-none bg-transparent" onClick={() => navigate(-1)}>
            <span>←</span> Back to Browse
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start mb-12">
          {/* Product Image Section */}
          {is3D ? (
            <ThreeDProductCard
              Model={TShirtModel}
              badge="BACK TO 2D"
              badgeIcon={Icon2D}
              onBadgeClick={() => setIs3D(false)}
            />
          ) : (
            <TwoDProductCard
              src={product.imageUrl || "/images/charcoal-tee.png"}
              alt={product.name}
            />
          )}

          {/* Product Info Section */}
          <div className="flex flex-col gap-4">
            <span className="text-[0.9rem] font-bold text-[#888] tracking-[0.1em]">
              {product.Category?.name ? product.Category.name.toUpperCase() : 'FASHION'}
            </span>
            <div className="grid grid-cols-1 gap-5">
              <h1 className="text-[1.76rem] font-extrabold leading-[1.2] text-[#111] font-hanken">{product.name}</h1>
              
              {(() => {
                const isWholesale = quantity >= 10 && product.wholesaleDiscountPercent > 0;
                const hasNormalDiscount = !isWholesale && product.discountPercent > 0;
                const effectivePercent = isWholesale ? product.wholesaleDiscountPercent : (hasNormalDiscount ? product.discountPercent : 0);
                const effectivePrice = product.price * (1 - effectivePercent / 100);

                return (
                  <div className="flex items-center gap-4 -mt-2">
                    {effectivePercent > 0 ? (
                      <>
                        <h2 className="text-2xl font-regular text-red-500 line-through">RS {product.price}</h2>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold text-green-600">
                            RS {effectivePrice.toFixed(2)}
                          </h2>
                          <span className={`text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-widest ${isWholesale ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                            {effectivePercent}% {isWholesale ? 'WHOLESALE OFF' : 'OFF'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <h2 className="text-2xl font-regular text-[#111]">RS {product.price}</h2>
                    )}
                  </div>
                );
              })()}
            </div>

            <p className="text-[#666] text-[0.95rem] leading-relaxed mt-4 font-sans">
              {product.description || 'A structured drape meets effortless comfort. Features a reinforced ribbed collar and a slightly dropped shoulder for a modern, architectural silhouette.'}
            </p>

            <div className="mt-4 flex flex-col gap-4">
              <span className="text-[0.8rem] font-bold text-[#333]">COLOR: {selectedColor.toUpperCase()}</span>
              <div className="flex gap-3">
                {colors.map(color => (
                  <button
                    key={color.name}
                    className={`w-8 h-8 rounded-full border border-transparent transition-all duration-300 ease-custom relative ${selectedColor === color.name ? 'border-[#111] shadow-[inset_0_0_0_2px_white]' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[0.8rem] font-bold text-[#333]">SIZE</span>
                <button className="text-[0.75rem] text-[#666] underline font-medium border-none bg-transparent">Size Guide</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <SizeButton size="S" selectedSize={selectedSize} onClick={setSelectedSize} disabled={getAvailableStock('S') === 0} />
                <SizeButton size="M" selectedSize={selectedSize} onClick={setSelectedSize} disabled={getAvailableStock('M') === 0} />
                <SizeButton size="L" selectedSize={selectedSize} onClick={setSelectedSize} disabled={getAvailableStock('L') === 0} />
              </div>
              {currentStock > 0 && currentStock < 10 && (
                <p className="text-red-500 text-sm font-semibold mt-1">Only {currentStock} left in stock!</p>
              )}
              {currentStock === 0 && (
                <p className="text-red-500 text-sm font-semibold mt-1">Out of stock in this size.</p>
              )}
            </div>

            <div className="flex gap-4 mt-4">
              <div className="flex items-center border-[1.5px] border-[#eee] rounded-lg overflow-hidden">
                <button className="px-5 py-3 text-xl text-[#333] border-none bg-transparent" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={currentStock === 0}>−</button>
                <span className="px-4 font-bold min-w-[40px] text-center">{quantity}</span>
                <button className="px-5 py-3 text-xl text-[#333] border-none bg-transparent" onClick={() => setQuantity(Math.min(currentStock, quantity + 1))} disabled={currentStock === 0 || quantity >= currentStock}>+</button>
              </div>
              <button
                disabled={currentStock === 0}
                onClick={() => {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    discountPercent: product.discountPercent,
                    wholesaleDiscountPercent: product.wholesaleDiscountPercent,
                    image: product.imageUrl,
                    collection: product.Category?.name || 'FASHION',
                    color: selectedColor,
                    size: selectedSize,
                    quantity,
                    maxStock: currentStock
                  });
                  navigate('/cart');
                }}
                className={`flex-1 rounded-lg font-bold text-[0.9rem] tracking-wider flex items-center justify-center gap-3 ${currentStock === 0 ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-black text-white'}`}
              >
                {currentStock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'} <span>🛒</span>
              </button>
            </div>

            <button 
              disabled={currentStock === 0} 
              onClick={() => {
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  discountPercent: product.discountPercent,
                  wholesaleDiscountPercent: product.wholesaleDiscountPercent,
                  image: product.imageUrl,
                  collection: product.Category?.name || 'FASHION',
                  color: selectedColor,
                  size: selectedSize,
                  quantity,
                  maxStock: currentStock
                });
                navigate('/checkout');
              }}
              className={`w-full p-5 border-[1.5px] rounded-lg font-bold text-[0.9rem] tracking-wider transition-all duration-300 ease-custom bg-transparent ${currentStock === 0 ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-[#111] hover:bg-[#f5f5f5]'}`}
            >
              BUY NOW
            </button>

            <div className="mt-8 flex flex-col gap-4 pt-8 border-t border-[#eee]">
              <div className="flex items-center gap-4 text-[0.85rem] text-[#555] font-medium">
                <span className="icon">🚚</span>
                <span>Complimentary Express Shipping</span>
              </div>
              <div className="flex items-center gap-4 text-[0.85rem] text-[#555] font-medium">
                <span className="icon">🌿</span>
                <span>100% GOTS Certified Organic Cotton</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <ProductReviews productId={product.id} />

        {/* Recommendation Sections */}
        <div className="flex flex-col gap-8 mt-12">
          {recommendations.length > 0 && (
            <div>
              <h2 className="text-[2rem] font-bold text-[#111] mb-2 font-outfit uppercase">Smart Outfit Recommendations</h2>
              <p className="text-[0.9rem] text-[#666] mb-6">Complete your {product.style} look with these matching items.</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {recommendations.map(rec => (
                  <div key={rec.id} className="flex flex-col group cursor-pointer bg-white rounded-xl overflow-hidden border border-[#eee] hover:shadow-md transition-shadow">
                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                      <img 
                        src={rec.imageUrl && rec.imageUrl.startsWith('http') ? rec.imageUrl : (rec.imageUrl ? `http://localhost:5000${rec.imageUrl}` : '/images/placeholder.png')} 
                        alt={rec.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold tracking-widest uppercase rounded">
                        {rec.clothingType}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col items-center text-center">
                      <h3 className="font-bold text-[0.95rem] text-[#111] mb-1">{rec.name}</h3>
                      <p className="text-[0.8rem] text-[#666] flex items-center justify-center gap-2">
                        {rec.color && <span className="w-3 h-3 rounded-full border border-gray-300" style={{backgroundColor: rec.color.toLowerCase()}}></span>}
                        {rec.style} Style
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ProductSection
            title="RELATED PRODUCTS"
            description="Explore the latest trends and must-haves. Shop now and stay stylish with our fresh collection!"
            products={relatedProducts}
            onProductClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

