import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import SidebarFilters from './SidebarFilters';
import ProductGrid from './ProductGrid';
import { useCart } from '../../context/CartContext';


const KidsPage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("Kid's Collection");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [availability, setAvailability] = useState({ inStock: true, outOfStock: false });
  const [fit, setFit] = useState({ slimFit: false, baggy: false });
  const [sortBy, setSortBy] = useState('featured');

  // Backend Product Data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const catName = product.Category?.name?.toLowerCase() || '';
    if (!catName.includes('kid')) return false;

    const maxPrice = parseInt(priceRange.max, 10) || 5000;
    const minPrice = parseInt(priceRange.min, 10) || 0;
    if (product.price < minPrice || product.price > maxPrice) return false;

    if (availability.inStock && !availability.outOfStock) {
      if (product.stock <= 0) return false;
    }
    if (availability.outOfStock && !availability.inStock) {
      if (product.stock > 0) return false;
    }
    if (!availability.inStock && !availability.outOfStock) {
      return false;
    }

    // Fit filter
    if (fit.slimFit || fit.baggy) {
      const desc = (product.description || '').toLowerCase();
      const name = (product.name || '').toLowerCase();
      
      let matchesFit = false;
      if (fit.slimFit && (desc.includes('slim') || desc.includes('fitted') || name.includes('slim'))) {
        matchesFit = true;
      }
      if (fit.baggy && (desc.includes('baggy') || desc.includes('oversized') || desc.includes('relaxed') || name.includes('baggy') || name.includes('oversized'))) {
        matchesFit = true;
      }
      
      if (!matchesFit) return false;
    }

    return true;
  });

  const handleClearFilters = () => {
    setSelectedSizes([]);
    setPriceRange({ min: 0, max: 5000 });
    setAvailability({ inStock: true, outOfStock: false });
    setFit({ slimFit: false, baggy: false });
  };

  // Apply Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'low-high') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'high-low') return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === 'recent') return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
    return 0; 
  });

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleQuickAdd = (product) => {
    addToCart({ ...product, size: 'XS', color: 'Default', collection: 'LIYARA' });
    navigate('/cart');
  };

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold font-outfit text-[#111] mb-2 uppercase tracking-tight">KIDS' COLLECTION</h1>
          <p className="text-gray-500 max-w-2xl">Fun and comfortable wear for the little ones. Quality fabrics for active explorers.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-64 flex-shrink-0">
            <SidebarFilters
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              selectedSizes={selectedSizes}
              toggleSize={toggleSize}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              availability={availability}
              toggleAvailability={(key) => setAvailability(prev => ({ ...prev, [key]: !prev[key] }))}
              fit={fit}
              toggleFit={(key) => setFit(prev => ({ ...prev, [key]: !prev[key] }))}
              onApplyFilters={() => {}}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="text-center text-xl mt-20">Loading products...</div>
            ) : (
              <ProductGrid
                products={sortedProducts}
                onQuickAdd={handleQuickAdd}
                onToggleWishlist={(id) => console.log('Wishlist:', id)}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />)
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidsPage;
