/**
 * Product Comparison Page
 * Displays side-by-side comparison of selected products
 * 
 * Features:
 * - Display up to 4 products in comparison table
 * - Show specs, price, rating, availability
 * - Add/remove products from comparison
 * - Add to cart buttons
 * - Full product details links
 * - Responsive table layout (scroll on mobile)
 * - Export comparison as data
 * - Add more products to comparison
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { useWishlistStore } from '@/stores';
import { cartStore } from '@/stores';
import { productsAPI } from '@/api';
import { useAPILoading } from '@/hooks';
import { toast } from 'react-toastify';

const ProductComparison = () => {
  const navigate = useNavigate();
  const { getComparisonProducts, removeFromComparison, clearComparison } = useWishlistStore();
  const { isLoading } = useAPILoading();
  const [comparisonItems, setComparisonItems] = useState([]);
  const [expandedSpecs, setExpandedSpecs] = useState({});

  useEffect(() => {
    const items = getComparisonProducts();
    setComparisonItems(items);
  }, []);

  const handleRemoveProduct = (productId) => {
    removeFromComparison(productId);
    setComparisonItems(comparisonItems.filter(item => item.id !== productId));
    toast.info('Product removed from comparison');
  };

  const handleAddToCart = (product) => {
    try {
      cartStore.addItem(product, 1);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleClearComparison = () => {
    if (window.confirm('Are you sure? This will clear all comparison selections.')) {
      clearComparison();
      setComparisonItems([]);
      toast.info('Comparison cleared');
    }
  };

  const handleAddMoreProducts = () => {
    navigate('/products');
  };

  // Empty state
  if (comparisonItems.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-block text-6xl mb-4">📊</div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">No Products to Compare</h1>
            <p className="text-gray-600 mb-8">
              Add at least 2 products to your comparison from your wishlist
            </p>
            <button
              onClick={() => navigate('/wishlist')}
              className="bg-gold text-black font-semibold px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Go to Wishlist
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (comparisonItems.length === 1) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Add More Products</h1>
            <p className="text-gray-600 mb-8">
              Select at least 2 products to enable comparison
            </p>
            <button
              onClick={() => navigate('/wishlist')}
              className="bg-gold text-black font-semibold px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Back to Wishlist
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Common specs to compare
  const specKeys = [
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
    { key: 'rating', label: 'Rating' },
    { key: 'stock', label: 'Stock', formatter: (v) => v > 0 ? '✓ In Stock' : '✗ Out of Stock' },
    { key: 'brand', label: 'Brand' },
    { key: 'weight', label: 'Weight' },
    { key: 'dimensions', label: 'Dimensions' },
    { key: 'warranty', label: 'Warranty' },
    { key: 'color', label: 'Available Colors' },
  ];

  const toggleSpec = (specKey) => {
    setExpandedSpecs(prev => ({
      ...prev,
      [specKey]: !prev[specKey]
    }));
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Comparison</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            {comparisonItems.length < 4 && (
              <button
                onClick={handleAddMoreProducts}
                className="flex-1 sm:flex-none bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Add More Products
              </button>
            )}
            <button
              onClick={handleClearComparison}
              className="flex-1 sm:flex-none bg-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gold"></div>
            <p className="text-gray-600 mt-2">Loading comparison...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Desktop View - Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {/* Product Header Row */}
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-semibold text-gray-900 min-w-40 bg-gray-50">
                      Product
                    </td>
                    {comparisonItems.map((product) => (
                      <td key={product.id} className="p-4 min-w-48 border-l border-gray-200">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-32 object-cover rounded-lg mb-3"
                              />
                            )}
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                              {product.name}
                            </h3>
                            <button
                              onClick={() => handleRemoveProduct(product.id)}
                              className="text-red-500 hover:text-red-600 text-sm font-semibold"
                            >
                              Remove ✕
                            </button>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Price Row */}
                  <tr className="border-b border-gray-200 bg-blue-50">
                    <td className="p-4 font-semibold text-gray-900 bg-gray-50">Price</td>
                    {comparisonItems.map((product) => (
                      <td key={product.id} className="p-4 border-l border-gray-200">
                        <span className="text-2xl font-bold text-gold">
                          ${product.price}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Rating Row */}
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-semibold text-gray-900 bg-gray-50">Rating</td>
                    {comparisonItems.map((product) => (
                      <td key={product.id} className="p-4 border-l border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold">
                            {(product.rating || 0).toFixed(1)}
                          </span>
                          <span className="text-yellow-400">★</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Stock Row */}
                  <tr className="border-b border-gray-200 bg-blue-50">
                    <td className="p-4 font-semibold text-gray-900 bg-gray-50">Availability</td>
                    {comparisonItems.map((product) => (
                      <td key={product.id} className="p-4 border-l border-gray-200">
                        <span
                          className={`font-semibold ${
                            (product.stock || 0) > 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {(product.stock || 0) > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Other Specs */}
                  {specKeys.slice(4).map((spec) => (
                    <tr key={spec.key} className="border-b border-gray-200">
                      <td className="p-4 font-semibold text-gray-900 bg-gray-50">
                        {spec.label}
                      </td>
                      {comparisonItems.map((product) => (
                        <td key={product.id} className="p-4 border-l border-gray-200 text-gray-600">
                          {product[spec.key] || 'N/A'}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Action Buttons Row */}
                  <tr className="bg-gray-50 border-t border-gray-200">
                    <td className="p-4 bg-gray-50"></td>
                    {comparisonItems.map((product) => (
                      <td key={product.id} className="p-4 border-l border-gray-200">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-gold text-black font-semibold py-2 rounded-lg hover:bg-amber-600 transition-colors"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => navigate(`/products/${product.slug}`)}
                            className="w-full border border-gray-300 text-gray-600 font-semibold py-2 rounded-lg hover:border-gray-400 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile View - Card Layout */}
            <div className="md:hidden space-y-6 p-4">
              {comparisonItems.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-gray-900 mb-3">{product.name}</h3>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-bold text-gold text-lg">${product.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-semibold">{(product.rating || 0).toFixed(1)}★</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <span
                        className={`font-semibold ${
                          (product.stock || 0) > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {(product.stock || 0) > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gold text-black font-semibold py-2 rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => navigate(`/products/${product.slug}`)}
                      className="w-full border border-gray-300 text-gray-600 font-semibold py-2 rounded-lg hover:border-gray-400 transition-colors mb-2"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      className="w-full text-red-600 font-semibold py-2 hover:text-red-700"
                    >
                      Remove from Comparison
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Comparison Summary</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex justify-between">
                <span>Number of Products:</span>
                <span className="font-semibold">{comparisonItems.length}</span>
              </li>
              <li className="flex justify-between">
                <span>Price Range:</span>
                <span className="font-semibold">
                  ${Math.min(...comparisonItems.map(p => p.price))} - ${Math.max(...comparisonItems.map(p => p.price))}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Average Rating:</span>
                <span className="font-semibold">
                  {(comparisonItems.reduce((sum, p) => sum + (p.rating || 0), 0) / comparisonItems.length).toFixed(1)}★
                </span>
              </li>
              <li className="flex justify-between">
                <span>Best Value:</span>
                <span className="font-semibold">
                  {comparisonItems.sort((a, b) => a.price / (b.rating || 1) - b.price / (a.rating || 1))[0].name}
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Next Steps</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Compare specifications and features</li>
              <li>✓ Check prices and availability</li>
              <li>✓ Read customer reviews and ratings</li>
              <li>✓ Add your favorite to cart and checkout</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductComparison;
