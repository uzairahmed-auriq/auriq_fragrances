"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Filter, ChevronDown, ChevronUp, X } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCardActions from "../components/home/ProductCardActions";

export default function CollectionsClient({ initialProducts }: { initialProducts: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortQuery = searchParams.get('sort') || 'featured';
  const searchQuery = searchParams.get('search') || '';

  const [sortBy, setSortBy] = useState(sortQuery);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  const [products] = useState<any[]>(initialProducts);
  const [search, setSearch] = useState(searchQuery);
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [familyFilters, setFamilyFilters] = useState<string[]>([]);
  const [genderFilters, setGenderFilters] = useState<string[]>([]);
  const [brandFilters, setBrandFilters] = useState<string[]>([]);

  const toggleArrayFilter = (arr: string[], setArr: (v: string[]) => void, value: string) => {
    setArr(arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  };

  const matchesPriceRange = (price: number, label: string) => {
    if (label === 'Under Rs. 10,000') return price < 10000;
    if (label === 'Rs. 10,000 - Rs. 15,000') return price >= 10000 && price <= 15000;
    if (label === 'Rs. 15,000 - Rs. 20,000') return price > 15000 && price <= 20000;
    if (label === 'Over Rs. 20,000') return price > 20000;
    return false;
  };

  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    if (sortQuery) setSortBy(sortQuery);
  }, [sortQuery]);

  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  const handleSortChange = (val: string) => {
    setSortBy(val);
    setIsSortDropdownOpen(false);
    router.push(`/collections?sort=${val}`);
  };

  const getSortLabel = (val: string) => {
    switch(val) {
      case 'new-arrivals': return 'New Arrivals';
      case 'best-sellers': return 'Best Sellers';
      case 'price-low': return 'Price: Low to High';
      case 'price-high': return 'Price: High to Low';
      default: return 'Featured';
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand || "").toLowerCase().includes(search.toLowerCase());

    const price = Number(p.variants?.[0]?.price || 0);
    const matchesPrice = priceFilters.length === 0 || priceFilters.some(label => matchesPriceRange(price, label));

    const matchesFamily = familyFilters.length === 0 || familyFilters.some(f => (p.fragrance_type || "").toLowerCase() === f.toLowerCase());

    const matchesGender = genderFilters.length === 0 || genderFilters.some(g => (p.gender || "").toLowerCase() === g.toLowerCase());

    const matchesBrand = brandFilters.length === 0 || brandFilters.some(b => (p.brand || "").toLowerCase() === b.toLowerCase());

    return matchesSearch && matchesPrice && matchesFamily && matchesGender && matchesBrand;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = Number(a.variants?.[0]?.price || 0);
    const priceB = Number(b.variants?.[0]?.price || 0);
    
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'new-arrivals') return b.id - a.id;
    if (sortBy === 'best-sellers') return a.id - b.id;
    return 0;
  });

  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    family: true,
    gender: true,
    occasion: true,
    brand: true,
  });

  const toggleFilter = (key: keyof typeof expandedFilters) => {
    setExpandedFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const FilterSidebar = () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-serif text-gradient-gold font-bold tracking-widest">Filters</h3>
        <button onClick={() => { setPriceFilters([]); setGenderFilters([]); }} className="text-[10px] text-foreground/50 hover:text-foreground uppercase tracking-[0.2em] transition-colors">Clear All</button>
      </div>

      {/* Price Filter */}
      <div className="border-t border-foreground/10 pt-6">
        <button
          className="flex w-full items-center justify-between text-foreground hover:text-gold transition-colors"
          onClick={() => toggleFilter('price')}
        >
          <span className="text-xs tracking-[0.2em] uppercase font-bold">Price</span>
          {expandedFilters.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${expandedFilters.price ? 'max-h-48 mt-5' : 'max-h-0'}`}>
          <div className="flex flex-col gap-4">
            {['Under Rs. 10,000', 'Rs. 10,000 - Rs. 15,000', 'Rs. 15,000 - Rs. 20,000', 'Over Rs. 20,000'].map(label => (
              <label key={label} className="flex items-center gap-4 cursor-pointer group">
                <input type="checkbox" checked={priceFilters.includes(label)} onChange={() => toggleArrayFilter(priceFilters, setPriceFilters, label)} className="accent-[#d4af37] w-4 h-4 bg-transparent border-foreground/30 cursor-pointer" />
                <span className="text-sm text-foreground/60 group-hover:text-foreground transition-colors tracking-wide font-semibold">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Gender Filter */}
      <div className="border-t border-foreground/10 pt-6">
        <button
          className="flex w-full items-center justify-between text-foreground hover:text-gold transition-colors"
          onClick={() => toggleFilter('gender')}
        >
          <span className="text-xs tracking-[0.2em] uppercase font-bold">Gender</span>
          {expandedFilters.gender ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${expandedFilters.gender ? 'max-h-40 mt-5' : 'max-h-0'}`}>
          <div className="flex flex-col gap-4">
            {['Men', 'Women', 'Unisex'].map(label => {
              const genderValue = label === 'Men' ? 'MALE' : label === 'Women' ? 'FEMALE' : 'UNISEX';
              return (
                <label key={label} className="flex items-center gap-4 cursor-pointer group">
                  <input type="checkbox" checked={genderFilters.includes(genderValue)} onChange={() => toggleArrayFilter(genderFilters, setGenderFilters, genderValue)} className="accent-[#d4af37] w-4 h-4 bg-transparent border-foreground/30 cursor-pointer" />
                  <span className="text-sm text-foreground/60 group-hover:text-foreground transition-colors tracking-wide font-semibold">{label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden pb-24">
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="relative z-10 container-lux pt-16 md:pt-24">
          {/* Page Header */}
          <div className="flex flex-col items-center justify-center text-center mb-12 border-b border-foreground/10 pb-12">
            <span className="text-gold text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4">Discover</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-gradient-gold font-bold tracking-widest mb-6">The Collection</h1>
            <p className="max-w-2xl text-foreground/60 text-sm md:text-base leading-relaxed tracking-wide px-4">
              Explore our complete portfolio of luxury fragrances. Each scent is a masterpiece, crafted with the finest ingredients to evoke profound emotions.
            </p>
          </div>

          {/* Main Layout: Sidebar + Grid */}
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Mobile Filter Toggle */}
            <div className="w-full flex justify-between items-center lg:hidden border-b border-foreground/10 pb-4">
              <button 
                onClick={() => setIsMobileFiltersOpen(true)}
                className="flex items-center gap-2 text-foreground hover:text-gold transition-colors text-sm font-medium tracking-widest uppercase border border-foreground/20 px-6 py-3 rounded-none backdrop-blur-sm"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              
              <div className="flex items-center gap-2 relative">
                <span className="text-foreground/50 text-[10px] uppercase tracking-widest">Sort By:</span>
                <button 
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="flex items-center gap-2 text-foreground hover:text-gold transition-colors text-xs font-bold tracking-wider uppercase"
                >
                  {getSortLabel(sortBy)} <ChevronDown className="w-3 h-3" />
                </button>
                {isSortDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-foreground/10 rounded shadow-xl z-50">
                    {['featured', 'new-arrivals', 'best-sellers', 'price-low', 'price-high'].map(option => (
                      <button 
                        key={option}
                        onClick={() => handleSortChange(option)}
                        className={`w-full text-left px-4 py-3 text-xs tracking-widest uppercase hover:bg-gold/10 transition-colors ${sortBy === option ? 'text-gold font-bold' : 'text-foreground'}`}
                      >
                        {getSortLabel(option)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-1/4 sticky top-32">
              <FilterSidebar />
            </div>

            {/* Mobile Sidebar Drawer */}
            {isMobileFiltersOpen && (
              <div className="fixed inset-0 z-[100] lg:hidden flex">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
                <div className="relative w-[85%] max-w-sm bg-background h-full overflow-y-auto p-8 border-r border-foreground/10 shadow-2xl flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-gold font-serif text-xl font-bold tracking-widest">Filters</span>
                    <button onClick={() => setIsMobileFiltersOpen(false)} className="text-foreground/50 hover:text-foreground transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <FilterSidebar />
                </div>
              </div>
            )}

            {/* Product Grid Area */}
            <div className="w-full lg:w-3/4 flex flex-col">
              
              {/* Desktop Top Toolbar (Sorting only since filters are left) */}
              <div className="hidden lg:flex justify-end items-center mb-8 pb-4 border-b border-foreground/5 relative">
                <div className="flex items-center gap-3">
                  <span className="text-foreground/40 text-[10px] uppercase tracking-[0.2em] font-bold">Sort By:</span>
                  <button 
                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                    className="flex items-center gap-2 text-foreground hover:text-gold transition-colors text-xs font-bold tracking-widest uppercase"
                  >
                    {getSortLabel(sortBy)} <ChevronDown className="w-4 h-4 text-gold" />
                  </button>
                  {isSortDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-foreground/10 rounded shadow-xl z-50">
                      {['featured', 'new-arrivals', 'best-sellers', 'price-low', 'price-high'].map(option => (
                        <button 
                          key={option}
                          onClick={() => handleSortChange(option)}
                          className={`w-full text-left px-4 py-3 text-xs tracking-widest uppercase hover:bg-gold/10 transition-colors ${sortBy === option ? 'text-gold font-bold' : 'text-foreground'}`}
                        >
                          {getSortLabel(option)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Grid - 3 columns on desktop since sidebar takes 1/4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {sortedProducts.map((product) => {
                  const price = product.variants?.[0]?.price || 0;
                  const imageUrl = product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop";
                  return (
                    <div key={product.id} className="group relative flex flex-col lux-glass-card p-5">
                      <div className="flex flex-col h-full">
                        <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden rounded-xl mb-6 bg-background z-10 shadow-2xl">
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
                          />
                          <ProductCardActions productId={product.id} variantId={product.variants?.[0]?.id} />
                        </Link>

                        <div className="flex flex-col text-center relative z-10 px-2">
                          <span className="text-[10px] text-gold uppercase tracking-[0.2em] mb-3 font-bold">{product.brand || 'Auriq'}</span>
                          <Link href={`/products/${product.id}`}>
                            <h3 className="font-serif text-xl text-foreground mb-2 font-bold drop-shadow-md hover:text-gold transition-colors">{product.name}</h3>
                          </Link>
                          <span className="text-foreground/80 text-sm tracking-wide font-medium">Rs. {Number(price).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Pagination */}
              {sortedProducts.length > 0 && sortedProducts.slice(0, visibleCount).length > 0 && (
                <div className="flex justify-center mt-24">
                  {visibleCount < sortedProducts.length && (
                  <button onClick={() => setVisibleCount(v => v + 12)} className="px-12 py-4 border border-foreground/20 text-foreground font-bold tracking-[0.2em] hover:bg-foreground hover:text-background transition-all duration-500 text-xs uppercase shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                    Load More ({sortedProducts.length - visibleCount} remaining)
                  </button>
                )}
                </div>
              )}

            </div>
          </div>
          
        </div>
      </main>
      <Footer />
    </>
  );
}
