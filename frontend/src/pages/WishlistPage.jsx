/**
 * Wishlist Page
 * Displays user's wishlist with filtering, sorting, and management options
 * 
 * Features:
 * - Display wishlist items in grid/list layout
 * - Filter by category, price range
 * - Sort by price, date added, rating
 * - Add items to cart
 * - Move items to comparison (max 4)
 * - Remove items from wishlist
 * - Share wishlist functionality
 * - Wishlist statistics
 * - Empty state handling
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layouts/MainLayout';
import { useWishlistStore } from '@/stores';
import { useAPILoading } from '@/hooks';
import { cartStore } from '@/stores';
import { toast } from 'react-toastify';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { items, removeItem, addToComparison, removeFromComparison, getStats, getSortedItems } = useWishlistStore();
  const { isLoading } = useAPILoading();
  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriceRange, setFilterPriceRange] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [inComparison, setInComparison] = useState(new Set());

  // Load comparison state from store
  useEffect(() => {
    const { getComparisonProducts } = useWishlistStore();
    const comparisonItems = getComparisonProducts();
    setInComparison(new Set(comparisonItems.map(p => p.id)));
  }, []);

  const stats = getStats();

  // Filter and sort items
  const filteredItems = items.filter((item) => {
    if (filterCategory && item.category !== filterCategory) return false;
    
    if (filterPriceRange !== 'all') {
      const [minPrice, maxPrice] = filterPriceRange.split('-').map(Number);
      if (item.price < minPrice || item.price > maxPrice) return false;
    }
    return true;
  });

  const sortedItems = getSortedItems(filterBy = null, sortBy);
  const displayItems = sortedItems.filter(item => 
    filterCategory ? item.category === filterCategory : true
  ).filter(item => {
    if (filterPriceRange === 'all') return true;
    const [minPrice, maxPrice] = filterPriceRange.split('-').map(Number);
    return item.price >= minPrice && item.price <= maxPrice;
  });

  // Get unique categories
  const categories = [...new Set(items.map(item => item.category))];

  const handleAddToCart = (item) => {
    try {
      cartStore.addItem(item, 1);
      toast.success(`${item.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleToggleComparison = (item) => {
    try {
      const newInComparison = new Set(inComparison);
      
      if (newInComparison.has(item.id)) {
        removeFromComparison(item.id);
        newInComparison.delete(item.id);
        toast.info(`${item.name} removed from comparison`);
      } else {
        if (newInComparison.size >= 4) {
          toast.warning('You can compare up to 4 products at a time');
          return;
        }
        addToComparison(item);
        newInComparison.add(item.id);
        toast.success(`${item.name} added to comparison`);
      }
      
      setInComparison(newInComparison);
    } catch (error) {
      toast.error('Failed to update comparison');
    }
  };

  const handleRemoveItem = (item) => {
    removeItem(item.id);
    if (inComparison.has(item.id)) {
      removeFromComparison(item.id);
      setInComparison(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
    toast.info(`${item.name} removed from wishlist`);
  };

  const handleViewComparison = () => {
    if (inComparison.size < 2) {
      toast.warning('Select at least 2 products to compare');
      return;
    }
    navigate('/compare');
  };

  const handleShareWishlist = async () => {
    try {
      // In a real app, this would call an API to generate a shareable link
      const shareText = `Check out my wishlist with ${items.length} items on DesignInn!`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'My DesignInn Wishlist',
          text: shareText,
          url: window.location.href,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Wishlist link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Empty state
  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-block text-6xl mb-4">❤️</div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8">
              Start adding items to your wishlist to keep track of products you love
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-gold text-black font-semibold px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Wishlist</h1>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.count}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gold">${stats.totalPrice.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.avgRating || 0).toFixed(1)}★
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">In Comparison</p>
              <p className="text-2xl font-bold text-gray-900">{inComparison.size}/4</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {inComparison.size >= 2 && (
              <button
                onClick={handleViewComparison}
                className="flex-1 sm:flex-none bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Comparison ({inComparison.size})
              </button>
            )}
            <button
              onClick={handleShareWishlist}
              className="flex-1 sm:flex-none bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Share Wishlist
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gold"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2">Price Range</label>
              <select
                value={filterPriceRange}
                onChange={(e) => setFilterPriceRange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gold"
              >
                <option value="all">All Prices</option>
                <option value="0-50">Under $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-500">$100 - $500</option>
                <option value="500-10000">$500+</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gold"
              >
                <option value="recent">Recently Added</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-semibold mb-2">View</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 py-2 rounded-lg border-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'border-gold bg-gold text-black'
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 py-2 rounded-lg border-2 transition-colors ${
                    viewMode === 'list'
                      ? 'border-gold bg-gold text-black'
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Items Display */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gold"></div>
            <p className="text-gray-600 mt-2">Loading wishlist...</p>
          </div>
        ) : displayItems.length > 0 ? (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Showing {displayItems.length} of {items.length} items
            </p>
            
            {viewMode === 'grid' ? (
              // Grid View
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      
                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveItem(item)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                      >
                        ✕
                      </button>

                      {/* Added to comparison badge */}
                      {inComparison.has(item.id) && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          In Comparison
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                      
                      {/* Price and Rating */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-gold">${item.price}</span>
                        <span className="text-sm">
                          {(item.rating || 0).toFixed(1)}★
                        </span>
                      </div>

                      {/* Buttons */}
                      <div className="space-y-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="w-full bg-gold text-black font-semibold py-2 rounded-lg hover:bg-amber-600 transition-colors"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleToggleComparison(item)}
                          className={`w-full font-semibold py-2 rounded-lg border-2 transition-colors ${
                            inComparison.has(item.id)
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          {inComparison.has(item.id) ? '✓ In Comparison' : '+ Compare'}
                        </button>
                        <button
                          onClick={() => navigate(`/products/${item.slug}`)}
                          className="w-full border border-gray-300 text-gray-600 font-semibold py-2 rounded-lg hover:border-gray-400 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div className="space-y-3">
                {displayItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-gray-500">{item.category}</p>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">${item.price}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item)}
                          className="text-red-500 hover:text-red-600 font-semibold"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex items-end justify-between mt-3">
                        <span className="text-sm">{(item.rating || 0).toFixed(1)}★</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="bg-gold text-black font-semibold px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors text-sm"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => handleToggleComparison(item)}
                            className={`font-semibold px-4 py-2 rounded-lg border-2 transition-colors text-sm ${
                              inComparison.has(item.id)
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            {inComparison.has(item.id) ? '✓' : '+ Compare'}
                          </button>
                          <button
                            onClick={() => navigate(`/products/${item.slug}`)}
                            className="border border-gray-300 text-gray-600 font-semibold px-3 py-2 rounded-lg hover:border-gray-400 transition-colors text-sm"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No items match your filters. Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default WishlistPage;
