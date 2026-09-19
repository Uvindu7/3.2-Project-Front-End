import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../lib/api';
import SidebarFilters from './SidebarFilters';
import ProductGrid from './ProductGrid';
import RecentlyViewed from './RecentlyViewed';
import { useCart } from '../../context/CartContext';

const Shop = ({ onProductClick }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse search query
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  // Filter & Sort State
  const [activeCategory, setActiveCategory] = useState('All Collection');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [appliedSizes, setAppliedSizes] = useState([]);
  const [pendingPriceRange, setPendingPriceRange] = useState({ min: 0, max: 5000 });
  const [appliedPriceRange, setAppliedPriceRange] = useState({ min: 0, max: 5000 });
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


  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleAvailability = (key) => {
    setAvailability(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFit = (key) => {
    setFit(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApplyFilters = () => {
    setAppliedSizes(selectedSizes);
    setAppliedPriceRange(pendingPriceRange);
  };

  const handleClearFilters = () => {
    setSelectedSizes([]);
    setAppliedSizes([]);
    setPendingPriceRange({ min: 0, max: 5000 });
    setAppliedPriceRange({ min: 0, max: 5000 });
    setAvailability({ inStock: true, outOfStock: false });
    setFit({ slimFit: false, baggy: false });
    setActiveCategory('All Collection');
  };

  const handleQuickAdd = (product) => {
    addToCart({
      ...product,
      size: 'M',
      color: product.color || 'Default',
      collection: 'LIYARA',
    });
    navigate('/cart');
  };

  // Filtered Products
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Price range filter
    const maxPrice = parseInt(appliedPriceRange.max, 10) || 5000;
    const minPrice = parseInt(appliedPriceRange.min, 10) || 0;
    if (product.price < minPrice || product.price > maxPrice) {
      return false;
    }
    // Category filter
    if (activeCategory !== 'All Collection' && activeCategory !== 'Recently Viewed') {
      const catName = product.Category?.name?.toLowerCase() || '';
      const filterName = activeCategory.toLowerCase().replace("'s collection", "").trim();
      
      if (!catName.includes(filterName)) return false;
    }
    
    // Availability filter
    if (availability.inStock && !availability.outOfStock) {
      if (product.stock <= 0) return false;
    }
    if (availability.outOfStock && !availability.inStock) {
      if (product.stock > 0) return false;
    }
    if (!availability.inStock && !availability.outOfStock) {
      return false;
    }

    // Size filter (mocked - assuming all products have all standard sizes, but if they specifically want 3XL maybe some don't. We'll just let all pass for standard sizes, as backend doesn't store size arrays)
    if (appliedSizes && appliedSizes.length > 0) {
      // In a real app, we'd check if product.availableSizes contains one of appliedSizes
      // For now, we assume all products are available in selected sizes.
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
      
      // If fit filters are applied but product doesn't match any, filter it out
      if (!matchesFit) return false;
    }

    return true;
  });

  // Apply Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'low-high') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'high-low') return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === 'recent') return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
    // featured (default) or any other fallback
    return 0; 
  });

  if (loading) return <div className="pt-32 min-h-screen text-center text-xl">Loading products...</div>;

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <SidebarFilters
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              selectedSizes={selectedSizes}
              toggleSize={toggleSize}
              priceRange={pendingPriceRange}
              setPriceRange={setPendingPriceRange}
              availability={availability}
              toggleAvailability={toggleAvailability}
              fit={fit}
              toggleFit={toggleFit}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <ProductGrid
              products={sortedProducts}
              onQuickAdd={handleQuickAdd}
              onToggleWishlist={(id) => console.log('Toggle wishlist:', id)}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
            
            <div className="mt-20">
              <RecentlyViewed onQuickAdd={handleQuickAdd} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
