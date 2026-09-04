import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, CATEGORIES } from '../types';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, RefreshCw, Sparkles } from 'lucide-react';

interface ShopPageProps {
  products: Product[];
  isLoading: boolean;
  onViewDetails: (product: Product) => void;
  onRefresh: () => void;
  isLive: boolean;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  isLoading,
  onViewDetails,
  onRefresh,
  isLive,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        }
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') {
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        }
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-zinc-800 gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#c5a059]">
            The Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-luxury text-white tracking-wide mt-1">
            Shop Bibi&apos;s Blooms
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-xl">
            Explore authentic handcrafted men&apos;s wears. Each piece is cut and assembled with exceptional tailoring for the discerning gentleman.
          </p>
        </div>

        {/* Sync Status & Refresh */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            <span
              className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>{isLive ? 'Live Supabase Sync' : 'Local / Demo Mode'}</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-md transition-colors disabled:opacity-50"
            title="Refresh Products from Supabase"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#c5a059]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search Senator, Agbada, Kaftan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/90 border border-zinc-800 focus:border-[#c5a059] rounded-md text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-zinc-200 rounded-md px-3 py-2 focus:outline-none focus:border-[#c5a059]"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest Additions</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-full whitespace-nowrap border transition-all ${
            selectedCategory === 'All'
              ? 'bg-[#c5a059] border-[#c5a059] text-black font-bold shadow-md shadow-[#c5a059]/20'
              : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white'
          }`}
        >
          All Items ({products.length})
        </button>

        {CATEGORIES.map((cat) => {
          const count = products.filter((p) => p.category === cat).length;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-full whitespace-nowrap border transition-all ${
                isSelected
                  ? 'bg-[#c5a059] border-[#c5a059] text-black font-bold shadow-md shadow-[#c5a059]/20'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white'
              }`}
            >
              {cat} {count > 0 && <span className="opacity-70 text-[10px]">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-zinc-900/50 border border-zinc-800 rounded-lg aspect-[3/4] animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/40">
            <Sparkles className="w-10 h-10 text-[#c5a059]/40 mb-3" />
            <h3 className="text-lg font-semibold text-zinc-200">No Products Found</h3>
            <p className="text-sm text-zinc-500 mt-1 max-w-sm">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search keywords or category filters.'
                : 'No products currently in the database. Use the Admin dashboard to add products.'}
            </p>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#c5a059] border border-[#c5a059]/40 rounded hover:bg-[#c5a059]/10"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
